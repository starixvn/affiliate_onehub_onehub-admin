import { combineReducers } from 'redux';

import createReducer from '../../../modules/createReducer';
import { pagingOption } from '../../../reducers/pagingReducer';
import { isShowLoader } from '../../../reducers/loaderReducer';
import { defaultGeneralInfo } from '../libs/constants';
import { SET_ONLINE_LIST, SET_GENERAL_INFO } from '../actions/types';

export const onlineList = createReducer([], {
    [SET_ONLINE_LIST](prevState, action) {
        return action.data;
    }
});

export const generalInfo = createReducer(defaultGeneralInfo, {
    [SET_GENERAL_INFO](prevState, action) {
        return action.data;
    }
});

export default combineReducers({
    onlineList,
    generalInfo,
    pagingOption,
    isShowLoader
});