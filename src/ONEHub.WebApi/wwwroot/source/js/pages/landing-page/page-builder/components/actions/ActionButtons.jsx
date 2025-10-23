import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col } from 'reactstrap';

import CopyLinkSection from './CopyLinkSection';
import { showSuccessToast, showErrorToast,showConfirmToast } from '../../../../common/components/Toast';
import { 
    saveLandingPage, 
    generatePreviewUrl,
    setFormData,
    setModuleComponents,
    clearValidationErrors,
    setValidationErrors,
    setHasPreviewedOrCreated,
    setPreviewUrl,
    initializeFromPageBuilderDetail,
    setNotification,
    setPageBuilderDetail,
    transitionToEditMode,
    updatePageBuilderDetail
} from '../../actions';
import { pageBuilderLabels, pageBuilderDefaultState, pageCodePattern, validationMessages } from '../../libs/constants';
import { claimResource } from '../../../../../modules/claim';

const ActionButtons = ({ 
    formData, 
    moduleComponents, 
    moduleList,
    isModifyInPageBuilder, 
    ui,
    isEditMode,
    pageBuilderDetail,
    languageList,
    landingPageUrl,
    campaignList,
    dealList,
    saveLandingPage,
    generatePreviewUrl,
    setFormData,
    setModuleComponents,
    clearValidationErrors,
    setValidationErrors,
    setHasPreviewedOrCreated,
    setPreviewUrl,
    initializeFromPageBuilderDetail,
    setNotification,
    setPageBuilderDetail,
    transitionToEditMode,
    updatePageBuilderDetail
}) => {
    const handlePreview = useCallback(async () => {
        if (!isModifyInPageBuilder || !validateForm(formData, moduleComponents)) {
            return;
        }
        
        try {
            const result = await generatePreviewUrl(formData, moduleComponents);
            
            if (result && result.IsSuccessful) {
                let constructedPreviewUrl = '';
                
                if (landingPageUrl && formData.pageCode) {
                    const selectedLanguage = languageList?.find(lang => 
                        lang.LanguageCode === formData.languageCode && 
                        lang.TargetCountryCode === formData.targetCountryCode
                    );
                    
                    const shortedLanguageCode = selectedLanguage?.ShortedLanguageCode || '';
                    
                    constructedPreviewUrl = `${landingPageUrl}/${shortedLanguageCode}/${formData.pageCode}?isPreview=true&pageId=${result.Message}`;
                }
                
                setPreviewUrl(constructedPreviewUrl || result.PreviewUrl);
                setHasPreviewedOrCreated(true);
                showSuccessToast("Preview Generated!", "Landing page preview is ready to view.");
            } else {
                showErrorToast("Preview Failed", result ? result.Message : 'Failed to generate preview. Please check your form data and try again.');
            }
        } catch (err) {
            showErrorToast("Preview Error", 'An error occurred while generating the preview.');
        }
    }, [validateForm, formData, moduleComponents, generatePreviewUrl, languageList, landingPageUrl, setPreviewUrl, setHasPreviewedOrCreated, setNotification]);

    const validateForm = useCallback((currentFormData = formData, currentModuleComponents = moduleComponents) => {
        const errors = {};

        if (!currentFormData.campaignId) {
            errors.campaignId = validationMessages.campaignRequired;
        }

        if (!currentFormData.pageName || currentFormData.pageName.trim() === '') {
            errors.pageName = validationMessages.pageNameRequired;
        } else if (currentFormData.pageName.trim().length > 50) {
            errors.pageName = validationMessages.pageNameInvalid;
        }

        if (!currentFormData.pageCode || currentFormData.pageCode.trim() === '') {
            errors.pageCode = validationMessages.pageCodeRequired;
        } else if (currentFormData.pageCode && !pageCodePattern.test(currentFormData.pageCode) || currentFormData.pageCode.trim().length > 50) {
            errors.pageCode = validationMessages.pageCodeInvalid;
        }

        if (!currentFormData.dealIds || 
            (Array.isArray(currentFormData.dealIds) && currentFormData.dealIds.length === 0) ||
            (typeof currentFormData.dealIds === 'string' && currentFormData.dealIds.trim() === '')) {
            errors.dealIds = validationMessages.atLeastOneDeal;
        }

        // Module components validation
        if (!currentModuleComponents || currentModuleComponents.length === 0) {
            errors.moduleComponents = validationMessages.atLeastOneModule;
        } else {
            // Validate each module component
            currentModuleComponents.forEach(module => {                
                if (!module.moduleId) {
                    errors[`module_${module.id}`] = validationMessages.moduleRequired;
                    return;
                }

                // Get module info from moduleList
                const moduleInfo = moduleList.find(m => m.ModuleId === module.moduleId);
                
                if (moduleInfo) {
                    // Check if module requires a source (mediaId)
                    // For special modules like YouTube, Contact Us, Login Button, they might not need traditional sources
                    const isYoutubeModule = moduleInfo.ModuleType === 4;
                    const isContactUsModule = moduleInfo.ModuleType === 2;
                    const isLoginBtnModule = moduleInfo.ModuleType === 5;
                    
                    // For special modules, check if they have the required data
                    if (isYoutubeModule) {
                        // YouTube modules need a URL in mediaId
                        if (!module.extraInfo || module.extraInfo.trim() === '') {
                            errors[`media_${module.id}`] = validationMessages.youtubeRequired;
                        }
                    } else if (isContactUsModule || isLoginBtnModule) {
                        // Contact Us and Login Button modules need both mediaId (source) and extraInfo
                        if (!module.mediaId && !(Array.isArray(module.mediaId) && module.mediaId.length > 0)) {
                            errors[`media_${module.id}`] = validationMessages.sourceRequired;
                        }
                        // extraInfo is now required based on user changes
                        if (!module.extraInfo || module.extraInfo.trim() === '') {
                            errors[`extra_${module.id}`] = `${isContactUsModule ? validationMessages.contactUsRequired : validationMessages.loginBtnRequired}`;
                        }
                    } else {
                        // Regular modules need mediaId
                        if (!module.mediaId && !(Array.isArray(module.mediaId) && module.mediaId.length > 0)) {
                            errors[`media_${module.id}`] = validationMessages.sourceRequired;
                        }
                    }
                }
            });

            // Validate IsUnique modules - ensure only one instance exists
            const uniqueModules = moduleList.filter(m => m.IsUnique);
            uniqueModules.forEach(uniqueModule => {
                const instances = currentModuleComponents.filter(comp => comp.moduleId === uniqueModule.ModuleId);
                if (instances.length > 1) {
                    instances.slice(1).forEach(instance => {
                        errors[`unique_module_${instance.id}`] = `${uniqueModule.ModuleName} can only be used once`;
                    });
                }
            });
        }
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            
            return false;
        }

        // Clear validation errors if form is valid
        clearValidationErrors();
        return true;
    }, [formData, moduleComponents, moduleList, setValidationErrors, clearValidationErrors]);

    const handleReset = useCallback(() => {
        const confirmTitle = isEditMode ? 'Reset Form' : 'Reset Form';
        const confirmMessage = isEditMode 
            ? 'Are you sure you want to reset the form? All changes will be reverted to the original values.'
            : 'Are you sure you want to reset the form? All unsaved changes will be lost.';
            
        showConfirmToast({
            title: confirmTitle,
            content: [confirmMessage],
            onConfirm: () => {
                if (pageBuilderDetail) {
                    // Reset to original edit values
                    initializeFromPageBuilderDetail(pageBuilderDetail);
                    // Reset preview URL and preview state in edit mode
                    setPreviewUrl('');
                    setHasPreviewedOrCreated(false);
                    // Clear validation errors after form is initialized
                    // Use requestAnimationFrame to ensure DOM updates are complete
                    requestAnimationFrame(() => {
                        clearValidationErrors();
                    });
                } else {
                    // Clear validation errors first for create mode
                    clearValidationErrors();
                    
                    // Reset to empty form for create mode with default values
                    const defaultFormData = { ...pageBuilderDefaultState.formData };
                    
                    // Set default campaignId to first item in campaignList
                    if (campaignList && campaignList.length > 0) {
                        defaultFormData.campaignId = campaignList[0].CampaignId;
                    }
                    
                    // Set default dealIds to all items in dealList
                    if (dealList && dealList.length > 0) {
                        defaultFormData.dealIds = dealList.map(deal => deal.key);
                    }
                    
                    setFormData(defaultFormData);
                    setModuleComponents(pageBuilderDefaultState.moduleComponentsSetting);
                    setHasPreviewedOrCreated(false);
                    setPreviewUrl(''); // Clear any existing preview URL
                }
                showSuccessToast("Form Reset", "Form has been reset successfully!");
            },
            onCancel: () => {
                // Cancel callback - do nothing
            }
        });
    }, [isEditMode, pageBuilderDetail, campaignList, dealList, setFormData, setModuleComponents, clearValidationErrors, setHasPreviewedOrCreated, setPreviewUrl, initializeFromPageBuilderDetail]);

    const handleCreate = useCallback(async () => {
        // Always validate form and show errors when Create is clicked
        // Pass current formData and moduleComponents to ensure we have latest values
        if (!isModifyInPageBuilder || !validateForm(formData, moduleComponents)) {
            // Validation errors are already set by validateForm, just return
            return;
        }

        const result = await saveLandingPage(formData, moduleComponents);
        
        if (result && result.IsSuccessful) {
            // Generate new preview URL after successful save
            const selectedLanguage = languageList?.find(lang => 
                lang.LanguageCode == formData.languageCode && 
                lang.TargetCountryCode == formData.targetCountryCode
            );
            const shortedLanguageCode = selectedLanguage?.TargetLanguageCode || selectedLanguage?.ShortedLanguageCode;
            
            let constructedPreviewUrl = '';
            if (landingPageUrl && formData.pageCode && shortedLanguageCode) {
                constructedPreviewUrl = `${landingPageUrl}/${shortedLanguageCode}/${formData.pageCode}`;
            }
            
            if (isEditMode) {
                // Update mode: Show success message and update pageBuilderDetail
                showSuccessToast("Landing Page Updated!", 'Landing page has been updated successfully!');
                
                // Update pageBuilderDetail with current form data
                updatePageBuilderDetail(formData, moduleComponents);
                
                // Update preview URL for the updated page
                if (constructedPreviewUrl) {
                    setPreviewUrl(constructedPreviewUrl);
                    setHasPreviewedOrCreated(true);
                }
            } else {
                // Create mode: Show success message and transition to edit mode
                showSuccessToast("Landing Page Created!", 'Landing page has been created successfully!');
                
                // Extract pageId from result (assuming result.Message contains the pageId or result has PageId property)
                const pageId = result.Message || result.Data?.PageId;
                
                if (pageId) {
                    // Transition to edit mode with the newly created page data
                    transitionToEditMode(pageId, formData, moduleComponents);
                    
                    // Update preview URL for the created page
                    if (constructedPreviewUrl) {
                        setPreviewUrl(constructedPreviewUrl);
                        setHasPreviewedOrCreated(true);
                    }
                } else {
                    console.warn('PageId not found in server response:', result);
                }
                
                // Clear validation errors
                clearValidationErrors();
            }
        } else {
            showErrorToast(
                isEditMode ? "Update Failed" : "Creation Failed", 
                result ? result.Message : (isEditMode ? 'Failed to update landing page. Please try again.' : 'Failed to create landing page. Please try again.')
            );
        }
    }, [validateForm, saveLandingPage, formData, moduleComponents, setHasPreviewedOrCreated, isEditMode, setFormData, setModuleComponents, clearValidationErrors, setPreviewUrl, languageList, landingPageUrl, setNotification, updatePageBuilderDetail, transitionToEditMode]);

    // Note: Removed isFormValid logic since buttons are now always clickable
    // and validation happens when buttons are clicked

    return (
        <Row className="py-4">
            <Col>
                <div className="action-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px' }}>
                    <Button 
                        color="info" 
                        onClick={handlePreview}
                        disabled={!isModifyInPageBuilder || ui.isLoading}
                        title="Preview landing page"
                    >
                        <i className="fa fa-eye me-1"></i>
                        {pageBuilderLabels.preview}
                    </Button>
                    <Button 
                        color="success" 
                        onClick={handleCreate}
                        disabled={!isModifyInPageBuilder || ui.isLoading}
                        title={isEditMode ? "Update landing page" : "Create landing page"}
                    >
                        {ui.isLoading ? (
                            <>
                                <i className="fa fa-spinner fa-spin me-1"></i>
                                {isEditMode ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <i className="fa fa-save me-1"></i>
                                {isEditMode ? pageBuilderLabels.update : pageBuilderLabels.create}
                            </>
                        )}
                    </Button>

                    <Button 
                        className="border border-primary text-dark bg-light" 
                        onClick={handleReset}
                        disabled={!isModifyInPageBuilder || ui.isLoading}
                        title="Reset form to initial state"
                    >
                        <i className="fa fa-refresh me-1"></i>
                        {pageBuilderLabels.reset}
                    </Button>
                </div>

                {/* Copy Link Section - Shows when enabled */}
                <CopyLinkSection />

            </Col>
        </Row>
    );
};

function mapStateToProps({ formData, moduleComponents, moduleList, ui, isEditMode, pageBuilderDetail, languageList, landingPageUrl, campaignList, dealList, claimsPrincipal }) {
    const isModifyInPageBuilder = claimsPrincipal.hasWriteClaim(claimResource.PageManagement);

    return Object.assign({}, { formData, moduleComponents, moduleList, ui, isEditMode, pageBuilderDetail, languageList, landingPageUrl, campaignList, dealList, isModifyInPageBuilder });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        saveLandingPage, 
        generatePreviewUrl,
        setFormData,
        setModuleComponents,
        clearValidationErrors,
        setValidationErrors,
        setHasPreviewedOrCreated,
        setPreviewUrl,
        initializeFromPageBuilderDetail,
        setNotification,
        setPageBuilderDetail,
        transitionToEditMode,
        updatePageBuilderDetail
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ActionButtons));
