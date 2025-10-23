import createReducer from '../modules/createReducer';
import { TOGGLE_LOADER } from '../actions/actionTypes';

export const isShowLoader = createReducer(false, {
    [TOGGLE_LOADER](prevState, action) {
        return action.data;
    }
})