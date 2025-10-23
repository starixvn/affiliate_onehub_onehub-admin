import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import { setPagingOption } from '../../../../actions/pagingAction';
import { v4 as uuidv4 } from 'uuid';

import * as types from './types';

export { toggleLoader, setPagingOption };

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setShouldResetScrollPosition = (data) => {
    return {
        type: types.SHOULD_RESET_SCROLL_POSITION,
        data
    }
}

export const setGridData = (data) => {
    return {
        type: types.SET_GRID_DATA,
        data
    }
}

export const setCampaignList = (data) => {
    return {
        type: types.SET_CAMPAIGN_LIST,
        data
    }
}

export const setDealList = (data) => {
    return {
        type: types.SET_DEAL_LIST,
        data
    }
}

export const setTargetCountryList = (data) => {
    return {
        type: types.SET_TARGET_COUNTRY_LIST,
        data
    }
}

export const setLanguageList = (data) => {
    return {
        type: types.SET_LANGUAGE_LIST,
        data
    }
}

export const setStatusList = (data) => {
    return {
        type: types.SET_STATUS_LIST,
        data
    }
}

export const setNotification = (data) => {
    return {
        type: types.SET_NOTIFICATION,
        data
    }
}

export const fetchData = (param) => async (dispatch) => {
    dispatch(toggleLoader(true));

    // Add RequestId for tracking
    const paramWithId = {
        ...param,
        RequestId: uuidv4()
    };

    const url = 'Portal/PageManagement/GetPageManagementList';
    const response = await post(url, paramWithId);

    const data = response && response.status === 200 ? response.data : null;
    
    dispatch(setGridData(data ? data.MainData : []));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: paramWithId.PageIndex, PageSize: paramWithId.PageSize }));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(toggleLoader(false));
}

export const toggleLandingPageStatus = (param) => async () => {
    const url = 'Portal/PageManagement/ToggleLandingPageStatus';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}
