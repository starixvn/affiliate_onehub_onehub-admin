import createReducer from '../../../modules/createReducer';
import { SET_SHOW_POPUP_PASSWORD } from '../actions/types';

export const showPopupPassword = createReducer(false, {
    [SET_SHOW_POPUP_PASSWORD](prevState, action) {
        return action.data;
    }
})