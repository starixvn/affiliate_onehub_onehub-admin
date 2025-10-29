import createReducer from '../modules/createReducer';
import { SET_PAGING_OPTION } from '../actions/actionTypes';
import { defaultPagingOption } from '../modules/constants';

export const pagingOption = createReducer(Object.assign({}, defaultPagingOption), {
    [SET_PAGING_OPTION](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})