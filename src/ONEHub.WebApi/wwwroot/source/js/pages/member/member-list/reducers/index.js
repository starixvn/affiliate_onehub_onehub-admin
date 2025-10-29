import { combineReducers } from 'redux';

import createReducer from '../../../../modules/createReducer';
import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';
import * as types from '../actions/types';

const today = createReducer(null, {})
const affName = createReducer(null, {})
const latestBillingDate = createReducer(null, {})
const isModifiable = createReducer(false, {})

export const param = createReducer(null, {
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const selectedMemberId = createReducer(null, {
    [types.SET_SELECTED_MEMBER_ID](prevState, action) {
        return action.data;
    }
})

export const isFromOtherPages = createReducer(false, {
    [types.SET_IS_FROM_OTHER_PAGES](prevState, action) {
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
    today,
    param,
    affName,
    latestBillingDate,
    selectedMemberId,
    gridData,
    pagingOption,
    isModifiable,
    isShowLoader,
    isFromOtherPages,
    shouldResetScrollPosition
});