import { combineReducers } from 'redux';

import createReducer from '../../../../modules/createReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';
import { SHOULD_RESET_SCROLL_POSITION, SET_GRID_DATA, SET_PARAM } from '../actions/types';

export const param = createReducer(null, {
    [SET_PARAM](prevState, action) {
        return action.data;
    }
})

export const shouldResetScrollPosition = createReducer(true, {
    [SHOULD_RESET_SCROLL_POSITION](prevState, action) {
        return action.data;
    }
})

export const gridData = createReducer(null, {
    [SET_GRID_DATA](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    param,
    gridData,
    isShowLoader,
    shouldResetScrollPosition
});