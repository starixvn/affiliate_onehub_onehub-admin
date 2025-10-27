import { post } from '@/modules/ajaxRequest';
import { toggleLoader } from '@/actions/loaderAction';
import { v4 as uuidv4 } from 'uuid';
import * as types from './types';

export { toggleLoader };

export const setFormData = (data) => ({
    type: types.SET_FORM_DATA,
    data
});

export const updateFormField = (field, value) => ({
    type: types.UPDATE_FORM_FIELD,
    field,
    value
});

export const initializeFromPageBuilderDetail = (pageBuilderDetail) => (dispatch, getState) => {
    const state = getState();
    const moduleList = state.moduleList || [];
    const dealList = state.dealList || [];
    const campaignList = state.campaignList || [];
    const sources = state.sources || {};
    
    // Dispatch the initialization with module configuration, dealList, campaignList, and sources
    dispatch({
        type: types.INITIALIZE_FROM_PAGE_BUILDER_DETAIL,
        pageBuilderDetail,
        moduleList,
        dealList,
        campaignList,
        sources
    });
};

export const initializeDefaultValues = () => (dispatch, getState) => {
    const state = getState();
    const dealList = state.dealList || [];
    const campaignList = state.campaignList || [];
    
    // Set default values for create mode
    const defaultCampaignId = campaignList.length > 0 ? campaignList[0].CampaignId : null;
    const defaultDealIds = dealList.map(deal => deal.key); // All available deals
    
    dispatch({
        type: types.INITIALIZE_DEFAULT_VALUES,
        defaultCampaignId,
        defaultDealIds
    });
};

export const setValidationErrors = (errors) => ({
    type: types.SET_VALIDATION_ERRORS,
    errors
});

export const clearValidationErrors = () => ({
    type: types.CLEAR_VALIDATION_ERRORS
});

export const addModuleComponent = () => (dispatch, getState) => {
    const { ui } = getState();
    const newModule = {
        id: Date.now(),
        orderId: ui.nextModuleOrder,
        moduleId: null,
        sourceId: null
    };
    
    dispatch({
        type: types.ADD_MODULE_COMPONENT,
        module: newModule
    });
};

export const insertModuleAfter = (afterModuleId) => (dispatch, getState) => {
    const { moduleComponents } = getState();
    const afterIndex = moduleComponents.findIndex(m => m.id === afterModuleId);
    
    const newModule = {
        id: Date.now(),
        orderId: 0,
        moduleId: null,
        mediaId: null
    };
    
    dispatch({
        type: types.INSERT_MODULE_AFTER,
        module: newModule,
        afterModuleId,
        insertIndex: afterIndex + 1
    });
};

export const removeModuleComponent = (moduleId) => ({
    type: types.REMOVE_MODULE_COMPONENT,
    moduleId
});

export const reorderModuleComponents = () => ({
    type: types.REORDER_MODULE_COMPONENTS
});

export const updateModuleComponent = (moduleId, field, value) => ({
    type: types.UPDATE_MODULE_COMPONENT,
    moduleId,
    field,
    value
});

export const setModuleComponents = (modules) => ({
    type: types.SET_MODULE_COMPONENTS,
    modules
});

export const setCampaignList = (campaigns) => ({
    type: types.SET_CAMPAIGN_LIST,
    campaigns
});

export const setDealList = (deals) => ({
    type: types.SET_DEAL_LIST,
    deals
});

export const setNormalDealList = (normalDeals) => ({
    type: types.SET_NORMAL_DEAL_LIST,
    normalDeals
});

export const addDealToList = (deal) => ({
    type: types.ADD_DEAL_TO_LIST,
    deal
});

export const addCampaignToList = (campaign) => ({
    type: types.ADD_CAMPAIGN_TO_LIST,
    campaign
});

export const setModuleList = (modules) => ({
    type: types.SET_MODULE_LIST,
    modules
});

export const setSources = (moduleId, sources) => ({
    type: types.SET_SOURCES,
    moduleId,
    sources
});

export const setStatusList = (statusList) => ({
    type: types.SET_STATUS_LIST,
    statusList
});

export const setLoadingState = (isLoading) => ({
    type: types.SET_LOADING_STATE,
    isLoading
});

export const setHasPreviewedOrCreated = (hasPreviewedOrCreated) => ({
    type: types.SET_HAS_PREVIEWED_OR_CREATED,
    hasPreviewedOrCreated
});

export const setPreviewUrl = (previewUrl) => ({
    type: types.SET_PREVIEW_URL,
    previewUrl
});

export const fetchCampaigns = (selectFirst = false) => async (dispatch) => {
    try {
        const url = 'api/PageBuilder/GetCampaignInfoList';
        const response = await post(url, { RequestId: uuidv4() });
        
        if (response && response.status === 200) {
            const campaigns = response.data || [];
            dispatch(setCampaignList(campaigns));
        }
    } catch (error) {
        console.error('Error fetching campaigns:', error);
    }
};

export const fetchDeals = (campaignId) => async (dispatch) => {
    try {
        const url = 'api/PageBuilder/GetDealList';
        const response = await post(url, { 
            campaignId,
            RequestId: uuidv4()
        });
        
        if (response && response.status === 200) {
            dispatch(setDealList(response.data || []));
        }
    } catch (error) {
        console.error('Error fetching deals:', error);
    }
};

export const fetchNormalDealList = () => async (dispatch) => {
    try {
        const url = 'api/PageBuilder/GetNormalDealList';
        const response = await post(url, { RequestId: uuidv4() });
        
        if (response && response.status === 200) {
            dispatch(setNormalDealList(response.data || []));
            return { success: true, data: response.data };
        } else {
            return { success: false, error: 'Unexpected response status' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const fetchModuleSources = (moduleId, targetCountryCode = null, languageCode = null) => async (dispatch) => {
    try {
        const url = 'api/PageBuilder/GetMediaSources';
        const response = await post(url, { 
            moduleId,
            targetCountryCode,
            languageCode,
            RequestId: uuidv4()
        });
        
        if (response && response.status === 200) {
            dispatch(setSources(moduleId, response.data || []));
        }
    } catch (error) {
        console.error('Error fetching module sources:', error);
    }
};

export const reloadAllModuleSources = (moduleComponents, targetCountryCode, languageCode) => async (dispatch) => {
    try {
        // Get unique module IDs from current module components
        const uniqueModuleIds = [...new Set(
            moduleComponents
                .map(component => component.moduleId)
                .filter(moduleId => moduleId) // Filter out null/undefined
        )];

        if (uniqueModuleIds.length === 0) {
            return;
        }

        // Fetch sources for each unique module and wait for ALL to complete
        const fetchPromises = uniqueModuleIds.map(moduleId => 
            dispatch(fetchModuleSources(moduleId, targetCountryCode, languageCode))
        );

        await Promise.all(fetchPromises);
        
        // Add a small delay to ensure Redux state is fully updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
    } catch (error) {
        console.error('Error reloading all module sources:', error);
        throw error; // Re-throw to let caller handle
    }
};

// Helper function to determine if a module supports multiple selection
const isModuleMultiSelect = (moduleId, moduleList) => {
    const moduleInfo = moduleList.find(m => m.ModuleId === moduleId);
    if (!moduleInfo) return false;
    
    const isMultipleUpload = moduleInfo.IsMultipleUpload;
    const forceMultiSelectModules = ['hero image', 'favorite games', 'provider', 'promo list'];
    const shouldBeMultiSelect = forceMultiSelectModules.some(name => 
        moduleInfo.ModuleName?.toLowerCase().includes(name.toLowerCase())
    );
    
    return isMultipleUpload || shouldBeMultiSelect;
};


export const validateAndResetInvalidSources = (moduleComponents, allSources) => (dispatch, getState) => {
    // If allSources is null, get fresh sources from Redux store
    const sourcesToUse = allSources || getState().sources;
    const state = getState();
    const moduleList = state.moduleList || [];
    
    try {
        moduleComponents.forEach(component => {
            const { id: componentId, moduleId, mediaId } = component;
            
            if (!moduleId || !mediaId) {
                return;
            }
            
            const availableSources = sourcesToUse[moduleId] || [];
            const availableSourceIds = availableSources.map(source => source.MediaId);
            const isMultiSelect = isModuleMultiSelect(moduleId, moduleList);
            
            if (isMultiSelect) {
                // Module supports multiple selection
                let currentValues = Array.isArray(mediaId) ? mediaId : (mediaId ? [mediaId] : []);
                const validMediaIds = currentValues.filter(id => availableSourceIds.includes(id));
                
                // For multi-select modules, always store as array (or null if empty)
                const newValue = validMediaIds.length > 0 ? validMediaIds : null;
                const needsUpdate = JSON.stringify(currentValues.sort()) !== JSON.stringify((validMediaIds || []).sort()) || 
                                   !Array.isArray(mediaId);
                
                if (needsUpdate) {
                    dispatch(updateModuleComponent(componentId, 'mediaId', newValue));
                }
            } else {
                // Module supports single selection only
                let currentValue = Array.isArray(mediaId) ? mediaId[0] : mediaId;
                
                if (currentValue && !availableSourceIds.includes(currentValue)) {
                    dispatch(updateModuleComponent(componentId, 'mediaId', null));
                } else if (Array.isArray(mediaId)) {
                    // Convert array to single value for single-select modules
                    dispatch(updateModuleComponent(componentId, 'mediaId', currentValue || null));
                }
            }
        });
    } catch (error) {
        console.error('Error validating and resetting invalid sources:', error);
    }
};

export const saveLandingPage = (formData, moduleComponents, isReview = false) => async (dispatch) => {
    try {
        dispatch(setLoadingState(true));
        
        let moduleComponentsSetting = [];
        moduleComponents.forEach(component => {
            if (Array.isArray(component.mediaId)) {
                component.mediaId.forEach(mediaIdItem => {
                    moduleComponentsSetting.push({
                        ModuleId: component.moduleId,
                        OrderId: component.orderId,
                        MediaId: mediaIdItem,
                        ExtraInfo: component.extraInfo,
                    });
                });
            } else {
                moduleComponentsSetting.push({
                    ModuleId: component.moduleId,
                    OrderId: component.orderId,
                    MediaId: component.mediaId,
                    ExtraInfo: component.extraInfo,
                });
            }
        });
        
        const isUpdate = formData.pageId && formData.pageId > 0;
        const url = isUpdate && !isReview ? 'api/PageBuilder/UpdatePageBuilder' : 'api/PageBuilder/InsertPageBuilder';
        
        const payload = {
            PageId: formData.pageId || 0,
            CampaignId: formData.campaignId,
            PageName: formData.pageName.trim(),
            PageCode: formData.pageCode.trim(),
            TargetCountryCode: formData.targetCountryCode,
            LanguageCode: formData.languageCode,
            DealIds: Array.isArray(formData.dealIds) ? formData.dealIds.join(',') : formData.dealIds,
            StatusId: formData.status,
            ModuleComponentsSetting: moduleComponentsSetting,
            IsPreview: isReview,
            RequestId: uuidv4()
        };
        
        const response = await post(url, payload);
        
        if (response && response.status === 200) {
            return response.data;
        }
        
        return null;
    } catch (error) {
        return null;
    } finally {
        dispatch(setLoadingState(false));
    }
};

export const generatePreviewUrl = (formData, moduleComponents) => async (dispatch) => {
    return await dispatch(saveLandingPage(formData, moduleComponents, true));
};

export const insertLandingPageDeal = (dealId) => async (dispatch) => {
    try {
        const url = 'api/PageBuilder/InsertLandingPageDeal';
        const response = await post(url, { 
            dealId,
            RequestId: uuidv4()
        });
        
        if (response && response.status === 200) {
            if (response.data && response.data.IsSuccessful) {
                dispatch({
                    type: types.INSERT_LANDING_PAGE_DEAL_SUCCESS,
                    message: response.data.Message || 'Deal added successfully'
                });
                return response.data;
            } else {
                dispatch({
                    type: types.INSERT_LANDING_PAGE_DEAL_ERROR,
                    error: response.data?.Message || 'Failed to add deal'
                });
                return response.data;
            }
        } else {
            dispatch({
                type: types.INSERT_LANDING_PAGE_DEAL_ERROR,
                error: 'Unexpected response from server'
            });
            
            return { IsSuccessful: false, Message: 'Unexpected response from server' };
        }
    } catch (error) {
        dispatch({
            type: types.INSERT_LANDING_PAGE_DEAL_ERROR,
            error: error.message || 'An error occurred while adding the deal'
        });
        return { IsSuccessful: false, Message: error.message || 'An error occurred while adding the deal' };
    }
};

export const insertLandingPageCampaign = (campaignName, description) => async (dispatch) => {
    try {
        const url = 'api/PageBuilder/InsertLandingPageCampaign';
        const response = await post(url, { 
            campaignName: campaignName.trim(), 
            description: description.trim(),
            RequestId: uuidv4()
        });
        
        if (response && response.status === 200) {
            if (response.data && response.data.IsSuccessful) {
                dispatch({
                    type: types.INSERT_LANDING_PAGE_CAMPAIGN_SUCCESS,
                    message: response.data.Message || 'Campaign added successfully'
                });
                return response.data;
            } else {
                dispatch({
                    type: types.INSERT_LANDING_PAGE_CAMPAIGN_ERROR,
                    error: response.data?.Message || 'Failed to add campaign'
                });
                return response.data;
            }
        } else {
            dispatch({
                type: types.INSERT_LANDING_PAGE_CAMPAIGN_ERROR,
                error: 'Unexpected response from server'
            });
            
            return { IsSuccessful: false, Message: 'Unexpected response from server' };
        }
    } catch (error) {
        dispatch({
            type: types.INSERT_LANDING_PAGE_CAMPAIGN_ERROR,
            error: error.message || 'An error occurred while adding the campaign'
        });
        return { IsSuccessful: false, Message: error.message || 'An error occurred while adding the campaign' };
    }
};

export const setNotification = (data) => {
    return {
        type: types.SET_NOTIFICATION,
        data
    }
};

export const setPageBuilderDetail = (formData, moduleComponents, pageId = null) => ({
    type: types.SET_PAGE_BUILDER_DETAIL,
    formData,
    moduleComponents,
    pageId
});

// Convenience functions for backward compatibility and clarity
export const transitionToEditMode = (pageId, formData, moduleComponents) => 
    setPageBuilderDetail(formData, moduleComponents, pageId);

export const updatePageBuilderDetail = (formData, moduleComponents) => 
    setPageBuilderDetail(formData, moduleComponents, formData.pageId);