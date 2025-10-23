import { post } from '../../../modules/ajaxRequest';
import { toggleLoader } from '../../../actions/loaderAction';
import { setPagingOption } from '../../../actions/pagingAction';
import { SET_PARAM, SET_CHECKED_MESSAGES, SET_SELECTED_Message_id, SHOULD_RESET_SCROLL_POSITION, SET_GRID_DATA } from './types';

export { toggleLoader, setPagingOption };

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}

export const setSelectedMessageId = (data) => {
    return {
        type: SET_SELECTED_Message_id,
        data
    }
}

export const setCheckedMessages = (data) => {
    return {
        type: SET_CHECKED_MESSAGES,
        data
    }
}

export const setShouldResetScrollPosition = (data) => {
    return {
        type: SHOULD_RESET_SCROLL_POSITION,
        data
    }
}

export const setGridData = (data) => {
    return {
        type: SET_GRID_DATA,
        data
    }
}

export const fetchData = (param) => async (dispatch) => {
    dispatch(toggleLoader(true));

    const url = 'Portal/Message/GetMessageList';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;
    const checkedMessages = data ? _convertCheckedMessages(data.MainData) : {};

    dispatch(setGridData(data ? data.MainData : []));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.PageIndex, PageSize: param.PageSize }));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(setCheckedMessages(checkedMessages));
    dispatch(toggleLoader(false));
}

function _convertCheckedMessages(dataList) {
    const checkedMessages = {};
    for (let item of dataList) {
        const itemId = item.MessageId;
        checkedMessages[itemId] = false;
    }

    return checkedMessages;
}

export const getMessageDetail = (selectedMessageId) => async () => {
    const url = 'Portal/Message/GetMessageDetail';
    const response = await post(url, { selectedMessageId });

    return response && response.status === 200 ? response.data : null;
}

export const insertMessage = (param) => async () => {
    const url = 'Portal/Message/insertMessage';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateMessage = (param) => async () => {
    const url = 'Portal/Message/UpdateMessage';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const deleteMessages = (messageIdList) => async () => {
    const url = 'Portal/Message/DeleteMessages';
    const response = await post(url, { messageIdList });

    return response && response.status === 200 ? response.data : null;
}