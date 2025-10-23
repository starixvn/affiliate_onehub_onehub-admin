import { combineReducers } from 'redux';

import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';

import createReducer from '../../../../modules/createReducer';
import * as types from '../actions/types';

const baseCurrencyList = createReducer([], {});

const now = new Date();
const defaultToday = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;
const today = createReducer(defaultToday, {});
const isProduction = createReducer(false, {});

export const productList = createReducer([], {
    [types.SET_PRODUCT_LIST](prevState, action) {
        return action.data;
    }
});

export const reportTitle = createReducer('', {
    [types.SET_REPORT_TITLE](prevState, action) {
        return action.data;
    }
})

export const param = createReducer(null, {
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export default combineReducers({
    param,
    today,
    isProduction,
    reportTitle,
    isShowLoader,
    productList,
    pagingOption,
    baseCurrencyList,
});