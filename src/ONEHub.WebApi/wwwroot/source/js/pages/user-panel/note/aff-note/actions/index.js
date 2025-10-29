import { post } from '../../../../../modules/ajaxRequest';
import { setPagingOption } from '../../../../../actions/pagingAction';
import { setSelectedUserPanel, toggleLoaderUserPanel } from '../../../../customer/user-panel/actions';
import * as types from './types';

export { setSelectedUserPanel, toggleLoaderUserPanel };

export const setAffNoteList = (data) => {
    return {
        type: types.SET_AFF_NOTE_LIST,
        data
    }
}

export const setShowPopup = (data) => {
    return {
        type: types.SET_SHOW_POPUP,
        data
    }
}

export const setAffNoteInfo = (data) => {
    return {
        type: types.SET_AFF_NOTE_INFO,
        data
    }
}

export const getAffNoteList = (param) => async (dispatch) => {
    dispatch(toggleLoaderUserPanel(true));

    const url = 'Portal/UserPanel/AffNote/GetAffNoteList';
    const response = await post(url, param);
    const data = response && response.status === 200 ? response.data : null;

    dispatch(setAffNoteList(data ? data.MainData || [] : []));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.pageIndex, PageSize: param.pageSize }));
    dispatch(toggleLoaderUserPanel(false));
}

export const getAffNoteContentById = (param) => async () => {
    const url = 'Portal/UserPanel/AffNote/GetAffNoteContentById';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const insertAffNote = (param) => async () => {
    const url = 'Portal/UserPanel/AffNote/InsertAffNote';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateAffNote = (param) => async () => {
    const url = 'Portal/UserPanel/AffNote/UpdateAffNote';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}