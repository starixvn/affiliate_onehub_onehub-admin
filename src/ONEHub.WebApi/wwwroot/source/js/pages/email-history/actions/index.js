import { post } from '../../../modules/ajaxRequest';
import { toggleLoader } from '../../../actions/loaderAction';
import { setPagingOption } from '../../../actions/pagingAction';
import * as types from './types';

export { toggleLoader, setPagingOption };

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setSelectedEmailId = (data) => {
    return {
        type: types.SET_SELECTED_EMAIL_ID,
        data
    }
}

export const setCheckedEmails = (data) => {
    return {
        type: types.SET_CHECKED_EMAILS,
        data
    }
}

export const setShouldResetScrollPosition = (data) => {
    return {
        type: types.SHOULD_RESET_SCROLL_POSITION,
        data
    }
}

export const setGridData = (data) => {
    return {
        type: types.SET_GRID_DATA,
        data
    }
}

export const fetchData = (param) => async (dispatch) => {
    dispatch(toggleLoader(true));

    const url = 'Portal/EmailHistory/GetEmailHistoryList';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;
    const checkedEmails = data ? _convertCheckedEmails(data.MainData) : {};

    dispatch(setGridData(data ? data.MainData : null));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.PageIndex, PageSize: param.PageSize }));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(setCheckedEmails(checkedEmails));
    dispatch(toggleLoader(false));
}

function _convertCheckedEmails(dataList) {
    const checkedEmails = {};
    for (let item of dataList) {
        checkedEmails[item.EmailId] = false;
    }

    return checkedEmails;
}

export const getEmailHistoryDetail = (selectedEmailId) => async () => {
    const url = 'Portal/EmailHistory/GetEmailHistoryDetail';
    const response = await post(url, { selectedEmailId });

    return response && response.status === 200 ? response.data : null;
}

export const deleteEmailHistory = (param) => async () => {
    const url = 'Portal/EmailHistory/DeleteEmailHistory';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}