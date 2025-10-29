import { combineReducers } from 'redux';

import createReducer from '../../../../modules/createReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';
import * as types from '../actions/types';

const dealList = createReducer(null, {});

export const selectedLandingPageId = createReducer(null, {
    [types.SET_SELECTED_LANDING_PAGE_ID](prevState, action) {
        return action.data;
    }
})

export const checkedLandingPages = createReducer({}, {
    [types.SET_CHECKED_LANDING_PAGES](prevState, action) {
        return action.data;
    }
})

export const shouldResetScrollPosition = createReducer(true, {
    [types.SHOULD_RESET_SCROLL_POSITION](prevState, action) {
        return action.data;
    }
})

export const gridData = createReducer(null, {
    [types.SET_GRID_DATA](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    gridData,
    isShowLoader,
    checkedLandingPages,
    selectedLandingPageId,
    shouldResetScrollPosition,
    dealList
});