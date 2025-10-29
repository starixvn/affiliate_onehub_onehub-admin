import { post, get } from '../../../modules/ajaxRequest';
import { toggleLoader } from '../../../actions/loaderAction';
import { setPagingOption } from '../../../actions/pagingAction';
import { defaultGeneralInfo } from '../libs/constants';
import { SET_ONLINE_LIST, SET_GENERAL_INFO } from './types';

export { setPagingOption };

export const setOnlineList = (data) => {
    return {
        type: SET_ONLINE_LIST,
        data
    }
}

export const setGeneralInfo = (data) => {
    return {
        type: SET_GENERAL_INFO,
        data
    }
}

export const getGeneralInfo = () => async (dispatch) => {
    dispatch(toggleLoader(true));
    const url = 'home/general-info';
    const response = await get(url);

    const data = response && response.status === 200 ? response.data : defaultGeneralInfo;

    dispatch(setGeneralInfo(data));
    dispatch(toggleLoader(false));
}

export const getOnlineList = (param) => async (dispatch) => {
    //dispatch(toggleLoader(true));

    const url = 'home/online-list';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;

    dispatch(setOnlineList(data ? data.MainData : []));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.pageIndex, PageSize: param.pageSize }));
    //dispatch(toggleLoader(false));
}