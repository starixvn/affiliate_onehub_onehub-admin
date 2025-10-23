import { combineReducers } from 'redux';
import { SET_PARAM } from '../actions/types';
import createReducer from '../../../../modules/createReducer';

export const param = createReducer({}, {
    [SET_PARAM](prevState, action) {
        return { ...action.data };
    }
});


export default combineReducers({
    param
});