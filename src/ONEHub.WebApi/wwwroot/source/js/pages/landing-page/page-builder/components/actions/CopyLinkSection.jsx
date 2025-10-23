import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, FormGroup, Alert } from 'reactstrap';

const CopyLinkSection = ({ formData, moduleComponents, languageList, landingPageUrl, pageBuilderDetail, isEditMode, ui, validation }) => {
    const [alertState, setAlertState] = useState({ show: false, type: 'success', message: '' });

    const constructPreviewUrl = useCallback((sourceLanguageCode, sourceTargetCountryCode, sourcePageCode) => {
        if (!landingPageUrl || !sourcePageCode) return '';

        const selectedLanguage = languageList?.find(lang => 
            lang.LanguageCode == sourceLanguageCode && 
            lang.TargetCountryCode == sourceTargetCountryCode
        );

        const shortedLanguageCode = selectedLanguage?.TargetLanguageCode || selectedLanguage?.ShortedLanguageCode;
        
        return `${landingPageUrl}/${shortedLanguageCode}/${sourcePageCode}`;
    }, [landingPageUrl, languageList]);

    const getPreviewUrl = useCallback(() => {
        if (ui.previewUrl) {
            return ui.previewUrl;
        }
        
        if (isEditMode && pageBuilderDetail && pageBuilderDetail.PageCode && !validation.isValidating) {
            return constructPreviewUrl(
                pageBuilderDetail.LanguageCode,
                pageBuilderDetail.TargetCountryCode,
                pageBuilderDetail.PageCode
            );
        }
        
        return '';
    }, [ui.previewUrl, isEditMode, pageBuilderDetail, constructPreviewUrl]);

    const handleCopyToClipboard = useCallback(async () => {
        const urlToCopy = getPreviewUrl();
        
        if (!urlToCopy) {
            setAlertState({ 
                show: true, 
                type: 'danger', 
                message: 'No URL available to copy. Please generate a preview first.' 
            });
            setTimeout(() => setAlertState({ show: false, type: 'success', message: '' }), 5000);
            return;
        }

        setAlertState({ show: false, type: 'success', message: '' });

        try {
            await navigator.clipboard.writeText(urlToCopy);
            setAlertState({ 
                show: true, 
                type: 'success', 
                message: 'Link copied to clipboard successfully!' 
            });
            
            setTimeout(() => {
                setAlertState({ show: false, type: 'success', message: '' });
            }, 3000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = urlToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setAlertState({ 
                        show: true, 
                        type: 'success', 
                        message: 'Link copied to clipboard successfully!' 
                    });
                    setTimeout(() => setAlertState({ show: false, type: 'success', message: '' }), 3000);
                } else {
                    throw new Error('execCommand copy returned false');
                }
            } catch (fallbackErr) {
                setAlertState({ 
                    show: true, 
                    type: 'danger', 
                    message: 'Failed to copy URL to clipboard. Please copy the URL manually.' 
                });
                setTimeout(() => setAlertState({ show: false, type: 'success', message: '' }), 5000);
            }
            
            document.body.removeChild(textArea);
        }
    }, [getPreviewUrl]);

    const isFormValid = isEditMode && pageBuilderDetail ? 
                       (pageBuilderDetail.CampaignId && 
                        pageBuilderDetail.PageName && 
                        pageBuilderDetail.PageCode &&
                        pageBuilderDetail.ModuleComponentsSetting?.length > 0) :
                       (formData.campaignId && 
                        formData.pageName && 
                        formData.pageCode &&
                        moduleComponents.length > 0);

    const isCopyLinkEnabled = !!getPreviewUrl() || 
                             (isEditMode && pageBuilderDetail && isFormValid) || 
                             ui.hasPreviewedOrCreated;

    return (
        <div className="mt-3">
            <FormGroup>
                <div>
                    <div className='p-2 bg-light border w-100' style={{ fontSize: '11px', wordBreak: 'break-word', minHeight: '51px' }}>
                        {
                            alertState.show ? (
                                <span className={`text-${alertState.type}`}>{alertState.message}</span>
                            ) : (
                                <span>{getPreviewUrl()}</span>
                            )
                        }
                    </div>
                    
                    <Button
                        color={isCopyLinkEnabled ? 'primary' : 'secondary'}
                        className='w-100'
                        disabled={!isCopyLinkEnabled}
                        onClick={handleCopyToClipboard}
                        title="Copy to clipboard"
                    >
                        <i className="fa fa-copy me-1"></i>
                        Copy Link
                    </Button>
                </div>
            </FormGroup>
        </div>
    );
};

function mapStateToProps({ formData, moduleComponents, ui, languageList, landingPageUrl, pageBuilderDetail, isEditMode, validation }) {
    return {
        formData,
        moduleComponents,
        languageList,
        landingPageUrl,
        pageBuilderDetail,
        isEditMode,
        ui,
        validation
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(CopyLinkSection));
