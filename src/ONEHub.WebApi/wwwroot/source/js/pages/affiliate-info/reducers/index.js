import { combineReducers } from 'redux';

import createReducer from '../../../modules/createReducer';
import * as types from '../actions/types';

import { pagingOption } from '../../../reducers/pagingReducer';
import { isShowLoader } from '../../../reducers/loaderReducer';
import { showPopupPassword } from '../../common/reducers';
import { claimsPrincipal } from '../../../reducers/claimReducer';

const commGroupList = createReducer(null, {
    [types.SET_COMM_GROUP_LIST](prevState, action) {
        return action.data;
    }
});

const languageList = createReducer({}, {});
const targetCountryList = createReducer({}, {});

const groupId = createReducer(0, {});

export const reportTitle = createReducer('', {
    [types.SET_REPORT_TITLE](prevState, action) {
        return action.data;
    }
})

export const param = createReducer(null, {
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const showPopupCommGroup = createReducer(false, {
    [types.SET_SHOW_POPUP_COMMGROUP](prevState, action) {
        return action.data;
    }
})

export const affId = createReducer(0, {
    [types.SET_AFFID](prevState, action) {
        return action.data;
    }
})

export const parentAffName = createReducer(null, {
    [types.SET_PARENT_AFF_NAME](prevState, action) {
        return action.data;
    }
})

export const commGroup = createReducer(0, {
    [types.SET_COMM_GROUP](prevState, action) {
        return action.data;
    }
})

export const columnList = createReducer(0, {
    [types.SET_SELECTED_COLUMN](prevState, action) {
        return [...action.data];
    }
})

export default combineReducers({
    pagingOption,
    reportTitle,
    param,
    commGroupList,
    languageList,
    targetCountryList,
    isShowLoader,
    showPopupPassword,
    showPopupCommGroup,
    claimsPrincipal,
    affId,
    parentAffName,
    commGroup,
    groupId,
    columnList
});