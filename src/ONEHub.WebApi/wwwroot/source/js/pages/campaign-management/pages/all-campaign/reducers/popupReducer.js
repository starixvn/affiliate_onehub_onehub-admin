import * as types from '../actions/types';
import createReducer from '@/modules/createReducer';

const initialPopupState = {
    isOpen: false,
    isAdd: true,
    selectedItem: null
};

export const popupState = createReducer(initialPopupState, {
    [types.OPEN_CAMPAIGN_POPUP]: (state, action) => action.data,
    [types.CLOSE_CAMPAIGN_POPUP]: (state, action) => action.data,
});
