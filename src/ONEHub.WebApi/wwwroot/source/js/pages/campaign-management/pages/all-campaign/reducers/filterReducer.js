import * as types from '../actions/types';

import createReducer from '@/modules/createReducer';

export const selectedStatus = createReducer(null, {
    [types.SET_SELECTED_STATUS]: (state, action) => action.data,
});

export const searchCampaign = createReducer('', {
    [types.SET_SEARCH_CAMPAIGN]: (state, action) => action.data,
});

export const searchDescription = createReducer('', {
    [types.SET_SEARCH_DESCRIPTION]: (state, action) => action.data,
});

export const statusList = createReducer([], {
    [types.SET_STATUS_LIST]: (state, action) => action.data,
});

export const param = createReducer(null, {
    [types.SET_PARAM]: (state, action) => action.data,
});