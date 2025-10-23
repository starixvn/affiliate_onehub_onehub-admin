import { combineReducers } from 'redux';
import { pagingOption } from '../../../../reducers/pagingReducer';
import { SET_PARAM } from '../actions/types';
import createReducer from '../../../../modules/createReducer';

export const param = createReducer(null, {
    [SET_PARAM](prevState, action) {
        return { ...action.data };
    }
})

export default combineReducers({
    pagingOption,
    param
});