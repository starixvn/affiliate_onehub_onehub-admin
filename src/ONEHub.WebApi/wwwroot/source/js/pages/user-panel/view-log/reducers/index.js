import { combineReducers } from 'redux';
import { SET_PARAM, SET_SHOW_ID_LIST } from '../actions/types';
import createReducer from '../../../../modules/createReducer';

import { pagingOption } from '../../../../reducers/pagingReducer';

export const param = createReducer({}, {
    [SET_PARAM](prevState, action) {
        return { ...action.data };
    }
});

export const showIdList = createReducer({}, {
    [SET_SHOW_ID_LIST](prevState, action) {
        return Object.assign({}, action.data);
    }
});

export default combineReducers({
    pagingOption,
    param,
    showIdList
});