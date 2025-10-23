import { combineReducers } from 'redux';
import { SET_SELECTED_SITE_URL, SET_PARAM } from '../actions/types';
import createReducer from '../../../../modules/createReducer';

import { pagingOption } from '../../../../reducers/pagingReducer';

export const selectedSiteUrl = createReducer(null, {
    [SET_SELECTED_SITE_URL](prevState, action) {
        return action.data;
    }
});

export const param = createReducer({}, {
    [SET_PARAM](prevState, action) {
        return { ...action.data };
    }
});

export default combineReducers({
    pagingOption,
    selectedSiteUrl,
    param
});