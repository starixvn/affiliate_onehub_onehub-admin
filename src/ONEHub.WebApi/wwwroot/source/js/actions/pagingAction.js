import { SET_PAGING_OPTION } from './actionTypes';

export const setPagingOption = (data) => {
    return {
        type: SET_PAGING_OPTION,
        data
    }
}