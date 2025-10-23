import { combineReducers } from 'redux';

import createReducer from '../../../../modules/createReducer';
import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';
import * as types from '../actions/types';

export const landingPageUrl = createReducer(null, {});
export const allLanguagesInSystem = createReducer(null, {});
export const isModifyInPageManagement = createReducer(false, {});

export const targetCountryList = createReducer(null, {
    [types.SET_TARGET_COUNTRY_LIST](prevState, action) {
        return action.data;
    }
});

export const languageList = createReducer(null, {
    [types.SET_LANGUAGE_LIST](prevState, action) {
        return action.data;
    }
});

export const dealList = createReducer(null, {
    [types.SET_DEAL_LIST](prevState, action) {
        return action.data;
    }
});

export const statusList = createReducer(null, {
    [types.SET_STATUS_LIST](prevState, action) {
        return action.data;
    }
});

export const campaignList = createReducer(null, {
    [types.SET_CAMPAIGN_LIST](prevState, action) {
        return action.data;
    }
});

export const param = createReducer(null, {
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const shouldResetScrollPosition = createReducer(true, {
    [types.SHOULD_RESET_SCROLL_POSITION](prevState, action) {
        return action.data;
    }
})

export const gridData = createReducer(null, {
    [types.SET_GRID_DATA](prevState, action) {
        return action.data;
    }
})

export const notification = createReducer({ message: '', isConfirmPopup: false, onConfirm: null }, {
    [types.SET_NOTIFICATION](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export default combineReducers({
    landingPageUrl,
    isModifyInPageManagement,
    targetCountryList,
    languageList,
    allLanguagesInSystem,
    dealList,
    statusList,
    campaignList,
    param,
    gridData,
    pagingOption,
    isShowLoader,
    shouldResetScrollPosition,
    notification,
});