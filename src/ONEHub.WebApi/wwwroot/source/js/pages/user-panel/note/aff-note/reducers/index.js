import { combineReducers } from 'redux';
import * as types from '../actions/types';
import createReducer from '../../../../../modules/createReducer';
import { pagingOption } from '../../../../../reducers/pagingReducer';

import { defaultNote } from '../../libs/constants';

export const affNoteList = createReducer(null, {
    [types.SET_AFF_NOTE_LIST](prevState, action) {
        return [...action.data];
    }
});

export const isShowPopup = createReducer(false, {
    [types.SET_SHOW_POPUP](prevState, action) {
        return action.data;
    }
});

export const affNoteInfo = createReducer({ ...defaultNote }, {
    [types.SET_AFF_NOTE_INFO](prevState, action) {
        return { ...action.data };
    }
});

export default combineReducers({
    pagingOption,
    isShowPopup,
    affNoteList,
    affNoteInfo
});