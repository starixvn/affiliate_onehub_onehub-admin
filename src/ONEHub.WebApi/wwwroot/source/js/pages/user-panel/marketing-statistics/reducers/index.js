import { combineReducers } from 'redux';
import createReducer from '../../../../modules/createReducer';
import { pagingOption } from '../../../../reducers/pagingReducer';

import * as types from '../actions/types';

export const param = createReducer(null, {
    [types.SET_PARAM]: (prevState, action) => {
        return Object.assign({}, prevState, action.data);
    }
});

export default combineReducers({
    pagingOption,
    param
}); 