import { combineReducers } from 'redux';
import createReducer from '../../../../modules/createReducer';
import * as types from '../actions/types';
import { menuKey } from '../libs/constants';

import affNoteReducer from '../aff-note/reducers';
import marketingReducer from '../marketing-note/reducers';

export const selectedSubNote = createReducer(null, {
    [types.SET_SELECTED_SUB_NOTE](prevState, action) {
        return action.data;
    }
});

const allReducers = combineReducers({
    selectedSubNote,
    [menuKey.affNote]: affNoteReducer,
    [menuKey.marketingNote]: marketingReducer,
});

export const noteReducer = (state, action) => {
    if (action.type === types.RESET_SUB_NOTE) {
        const newState = { ...state };

        const subNoteName = action.data;
        newState[subNoteName] = {};

        return allReducers(newState, action);
    }

    return allReducers(state, action);
};

export default noteReducer;