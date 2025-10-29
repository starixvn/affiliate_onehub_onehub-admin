import { combineReducers } from 'redux';
import { SET_PARAM, SET_SELECTED_MONTH } from '../actions/types';
import createReducer from '../../../../modules/createReducer';

export const param = createReducer({}, {
    [SET_PARAM](prevState, action) {
        return { ...action.data };
    }
});

export const selectedMonth = createReducer(null, {
    [SET_SELECTED_MONTH](prevState, action) {
        return action.data;
    }
});

export default combineReducers({
    param,
    selectedMonth
});