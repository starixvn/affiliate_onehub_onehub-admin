import { combineReducers } from 'redux';
import { SET_USER_ACCOUNT_INFO, SET_MORE_SITE_URLS_LIST } from '../actions/types';
import createReducer from '../../../../modules/createReducer';

export const userAccountInfo = createReducer(null, {
    [SET_USER_ACCOUNT_INFO](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
});

export const moreSiteUrlsList = createReducer(null, {
    [SET_MORE_SITE_URLS_LIST](prevState, action) {
        return [...action.data];
    }
});

export default combineReducers({
    userAccountInfo,
    moreSiteUrlsList
});