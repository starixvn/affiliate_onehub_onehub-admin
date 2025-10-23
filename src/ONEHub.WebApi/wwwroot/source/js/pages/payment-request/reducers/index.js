import { combineReducers } from 'redux';

import createReducer from '../../../modules/createReducer';
import { SET_PARAM, SET_TRANSACTION_ID } from '../actions/types';

import { pagingOption } from '../../../reducers/pagingReducer';
import { isShowLoader } from '../../../reducers/loaderReducer';

export const today = createReducer(null, {});
export const licenseeName = createReducer('', {});

export const param = createReducer(null, {
    [SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const transactionId = createReducer(null, {
    [SET_TRANSACTION_ID](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    pagingOption,
    isShowLoader,
    today,
    param,
    transactionId,
    licenseeName
});