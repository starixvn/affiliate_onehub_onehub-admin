import { post } from '../../../../modules/ajaxRequest';
import { setPagingOption } from '../../../../actions/pagingAction';
import { toggleLoaderUserPanel } from '../../../customer/user-panel/actions';
import { SET_PARAM, SET_SHOW_ID_LIST } from '../actions/types';

export { setPagingOption, toggleLoaderUserPanel };

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}

export const setShowIdList = (data) => {
    return {
        type: SET_SHOW_ID_LIST,
        data
    }
}

export const getLogTypeList = () => async () => {
    const url = 'Portal/UserPanel/ViewLog/GetLogTypeList';
    const response = await post(url);

    return response && response.status === 200 ? response.data : null;
}

export const fetchData = (param) => async () => {
    const url = 'Portal/UserPanel/ViewLog/GetViewLogList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}