import { combineReducers } from 'redux';
import { SET_PARAM, TRANSACTION_ID, SET_EXPAND_MONTH_DATE_LIST } from '../actions/types';
import createReducer from '../../../../modules/createReducer';

import { pagingOption } from '../../../../reducers/pagingReducer';

export const param = createReducer(null, {
    [SET_PARAM](prevState, action) {
        return { ...action.data };
    }
});

export const transactionId = createReducer(null, {
    [TRANSACTION_ID](prevState, action) {
        return action.data;
    }
});

export const expandMonthDateList = createReducer({}, {
    [SET_EXPAND_MONTH_DATE_LIST](prevState, action) {
        return action.data;
    }
});

export default combineReducers({
    pagingOption,
    param,
    transactionId,
    expandMonthDateList
});