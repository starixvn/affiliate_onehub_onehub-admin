import * as types from './types';
import { toggleLoaderUserPanel } from '../../../customer/user-panel/actions';
export { toggleLoaderUserPanel };

export const setSelectedSubNote = (data) => {
    return {
        type: types.SET_SELECTED_SUB_NOTE,
        data
    };
}

export const resetSubNote = (data) => {
    return {
        type: types.RESET_SUB_NOTE,
        data
    }
}