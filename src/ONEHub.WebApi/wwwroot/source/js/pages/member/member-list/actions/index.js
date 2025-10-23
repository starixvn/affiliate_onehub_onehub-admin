import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import { setPagingOption } from '../../../../actions/pagingAction';
import * as types from './types';

export { toggleLoader, setPagingOption };

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setSelectedMemberId = (data) => {
    return {
        type: types.SET_SELECTED_MEMBER_ID,
        data
    }
}

export const setIsFromOtherPages = (data) => {
    return {
        type: types.SET_IS_FROM_OTHER_PAGES,
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

    const url = 'Portal/Player/GetMemberList';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;

    dispatch(setGridData(data ? data.MainData : []));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.PageIndex, PageSize: param.PageSize }));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(toggleLoader(false));
}

export const getMemberDetail = (memberId) => async () => {
    const url = 'Portal/Player/GetMemberDetail';
    const response = await post(url, { memberId });

    return response && response.status === 200 ? response.data : null;
}

export const updateMember = (param) => async () => {
    const url = 'Portal/Player/UpdateMember';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const deleteMember = (memberId) => async () => {
    const url = 'Portal/Player/DeleteMember';
    const response = await post(url, { memberId });

    return response && response.status === 200 ? response.data : null;
}