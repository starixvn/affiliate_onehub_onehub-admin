import * as types from './types';
import { setPagingOption } from '../../../../actions/pagingAction';

export { setPagingOption };

export const setParams = (data) => {
    return {
        type: types.SET_PARAMS,
        data
    }
}

export const toggleSubmit = (data) => {
    return {
        type: types.TOGGLE_SUBMIT,
        data
    }
}