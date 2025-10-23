import { combineReducers } from 'redux';

import createReducer from '../../../modules/createReducer';
import { pagingOption } from '../../../reducers/pagingReducer';
import { isShowLoader } from '../../../reducers/loaderReducer';
import { SET_PARAM, SET_CHECKED_MESSAGES, SET_SELECTED_Message_id, SHOULD_RESET_SCROLL_POSITION, SET_GRID_DATA } from '../actions/types';

export const today = createReducer(null, {});

export const defaultMessageContentList = createReducer({}, {});
export const languages = createReducer({}, {});

export const param = createReducer(null, {
    [SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const selectedMessageId = createReducer(null, {
    [SET_SELECTED_Message_id](prevState, action) {
        return action.data;
    }
})

export const checkedMessages = createReducer({}, {
    [SET_CHECKED_MESSAGES](prevState, action) {
        return action.data;
    }
})

export const shouldResetScrollPosition = createReducer(true, {
    [SHOULD_RESET_SCROLL_POSITION](prevState, action) {
        return action.data;
    }
})

export const gridData = createReducer(null, {
    [SET_GRID_DATA](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    today,
    param,
    gridData,
    pagingOption,
    isShowLoader,
    checkedMessages,
    selectedMessageId,
    shouldResetScrollPosition,
    languages,
    defaultMessageContentList
});