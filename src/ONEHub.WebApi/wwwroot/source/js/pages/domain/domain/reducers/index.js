import { combineReducers } from 'redux';

import createReducer from '../../../../modules/createReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';
import * as types from '../actions/types';

const isAffDomain = createReducer(true, {});
const licenseeName = createReducer("", {});
const targetCountryList = createReducer(null, {});

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

export const selectedDomainId = createReducer(null, {
    [types.SET_SELECTED_DOMAIN_ID](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    gridData,
    isAffDomain,
    isShowLoader,
    selectedDomainId,
    targetCountryList,
    shouldResetScrollPosition,
    licenseeName
});