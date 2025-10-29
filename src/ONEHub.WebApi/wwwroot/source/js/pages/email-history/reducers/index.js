import { combineReducers } from 'redux';

import createReducer from '../../../modules/createReducer';
import { pagingOption } from '../../../reducers/pagingReducer';
import { isShowLoader } from '../../../reducers/loaderReducer';
import { claimsPrincipal } from '../../../reducers/claimReducer';
import * as types from '../actions/types';

export const today = createReducer(null, {});

export const param = createReducer(null, {
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const selectedEmailId = createReducer(null, {
    [types.SET_SELECTED_EMAIL_ID](prevState, action) {
        return action.data;
    }
})

export const checkedEmails = createReducer({}, {
    [types.SET_CHECKED_EMAILS](prevState, action) {
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
    pagingOption,
    isShowLoader,
    selectedEmailId,
    checkedEmails,
    shouldResetScrollPosition,
    gridData,
    today,
    param,
    claimsPrincipal
});