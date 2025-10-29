import * as types from './types'
import { setSelectedUserPanel, toggleLoaderUserPanel } from '../../../../customer/user-panel/actions';
import { post } from '../../../../../modules/ajaxRequest';
import { setPagingOption } from '../../../../../actions/pagingAction';

export { setSelectedUserPanel, toggleLoaderUserPanel };

export const setMarketingNoteList = (data) => {
    return {
        type: types.SET_MARKETING_NOTE_LIST,
        data
    }
}

export const setShowPopup = (data) => {
    return {
        type: types.SET_SHOW_POPUP,
        data
    }
}

export const setMarketingNoteInfo = (data) => {
    return {
        type: types.SET_MARKETING_NOTE_INFO,
        data
    }
}

export const getMarketingNoteList = (param) => async (dispatch) => {
    dispatch(toggleLoaderUserPanel(true));

    const url = 'Portal/UserPanel/MarketingNote/GetMarketingNoteList';
    const response = await post(url, param);
    const data = response && response.status === 200 ? response.data : null;

    dispatch(setMarketingNoteList(data ? data.MainData || [] : []));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.pageIndex, PageSize: param.pageSize }));
    dispatch(toggleLoaderUserPanel(false));
}

export const getMarketingNoteContentById = (param) => async () => {
    const url = 'Portal/UserPanel/MarketingNote/GetMarketingNoteContentById';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const insertMarketingNote = (param) => async () => {
    const url = 'Portal/UserPanel/MarketingNote/InsertMarketingNote';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateMarketingNote = (param) => async () => {
    const url = 'Portal/UserPanel/MarketingNote/UpdateMarketingNote';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}