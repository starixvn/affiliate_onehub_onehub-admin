import { combineReducers } from 'redux';
import { SET_PARAM, SET_SORTING_COLUMN } from '../actions/types';
import createReducer from '../../../../modules/createReducer';

import { pagingOption } from '../../../../reducers/pagingReducer';
import { SortingColumnDefault } from '../modules/constants';

export const param = createReducer({}, {
    [SET_PARAM]: (prevState, action) => {
        return { ...action.data };
    }
})

export const sortingColumn = createReducer(SortingColumnDefault, {
    [SET_SORTING_COLUMN]: (prevState, action) => {
        return Object.assign({}, prevState, action.data);
    }
})

export default combineReducers({
    param,
    pagingOption,
    sortingColumn
})