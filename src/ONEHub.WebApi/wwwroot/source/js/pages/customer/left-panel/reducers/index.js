import { combineReducers } from 'redux';
import createReducer from '../../../../modules/createReducer';

import { SET_AFF_NAME, SET_IS_VALID_USERNAME, TOGGLE_LOADER_LEFT_PANEL } from '../actions/types';
import { LEFTPANEL_RECEIVE_AFFINFO } from '../../mainpage/actions/types';

const affTypeList = createReducer(null, {});

export const affName = createReducer('', {
    [SET_AFF_NAME](prevState, action) {
        return action.data;
    }
});

export const affiliateInfo = createReducer(null, {
    [LEFTPANEL_RECEIVE_AFFINFO](prevState, action) {
        return action.data && Object.assign({}, prevState, action.data);
    }
});

export const isValidUserName = createReducer(true, {
    [SET_IS_VALID_USERNAME](prevState, action) {
        return action.data;
    }
});

export const isShowLoader = createReducer(false, {
    [TOGGLE_LOADER_LEFT_PANEL](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    affName,
    affiliateInfo,
    isValidUserName,
    isShowLoader,
    affTypeList
});