import { combineReducers } from 'redux';

import createReducer from '../../../../modules/createReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';
import { SHOULD_RESET_SCROLL_POSITION, SET_SELECTED_SUB_AFF_DOMAIN, SET_GRID_DATA } from '../actions/types';

const licenseeName = createReducer("", {});

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

export const selectedSubAffDomain = createReducer(null, {
    [SET_SELECTED_SUB_AFF_DOMAIN](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    gridData,
    isShowLoader,
    selectedSubAffDomain,
    shouldResetScrollPosition,
    licenseeName
});