import { combineReducers } from 'redux';

import createReducer from '../../../modules/createReducer';
import * as types from '../actions/types';

import { pagingOption } from '../../../reducers/pagingReducer';
import { isShowLoader } from '../../../reducers/loaderReducer';
import { defaultFilterParams, resource } from '../libs/constants';

const languageCodeList = createReducer({}, {});
const targetCountryCodeList = createReducer({}, {});
const dealOptionsList = createReducer({}, {});
const canAddAffMktAccount = createReducer(false, {});
const defaultAff = {
    affId: '',
    affName: ''
};

const defaultMktAffInfo = createReducer(defaultAff, {});
export const params = createReducer(null, {
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, defaultFilterParams, prevState, action.data);
    }
});

export const isShowAddAffMktAccountPopup = createReducer(false, {
    [types.SET_IS_SHOW_ADD_AF_MKT_ACCOUNT_POPUP](prevState, action) {
        return action.data;
    }
});

export const aff = createReducer(defaultAff, {
    [types.SET_AFF](prevState, action) {
        return action.data;
    }
});

export const reportTitle = createReducer(resource.ReportName, {
    [types.SET_REPORT_TITLE](prevState, action) {
        return action.data;
    }
});

export default combineReducers({
    params,
    pagingOption,
    isShowLoader,
    languageCodeList,
    targetCountryCodeList,
    canAddAffMktAccount,
    defaultMktAffInfo,
    isShowAddAffMktAccountPopup,
    aff,
    reportTitle,
    dealOptionsList
});