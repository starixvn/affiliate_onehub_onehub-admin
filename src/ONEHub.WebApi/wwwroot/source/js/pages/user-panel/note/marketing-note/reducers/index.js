import { combineReducers } from 'redux';
import * as types from '../actions/types';
import createReducer from '../../../../../modules/createReducer';
import { pagingOption } from '../../../../../reducers/pagingReducer';

import { defaultNote } from '../../libs/constants';

export const marketingNoteList = createReducer(null, {
    [types.SET_MARKETING_NOTE_LIST](prevState, action) {
        return [...action.data];
    }
})

export const isShowPopup = createReducer(false, {
    [types.SET_SHOW_POPUP](prevState, action) {
        return action.data;
    }
})

export const marketingNoteInfo = createReducer({ ...defaultNote }, {
    [types.SET_MARKETING_NOTE_INFO](prevState, action) {
        return { ...action.data };
    }
})

export default combineReducers({
    marketingNoteList,
    marketingNoteInfo,
    isShowPopup,
    pagingOption
})