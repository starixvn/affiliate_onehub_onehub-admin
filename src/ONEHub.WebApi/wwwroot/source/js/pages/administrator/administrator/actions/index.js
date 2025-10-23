import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import { SHOULD_RESET_SCROLL_POSITION, SET_GRID_DATA, SET_PARAM } from './types';

export const setParam = (data) => {
    return {
        type: SET_PARAM,
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

    const url = 'Portal/Administrator/GetUserList';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : [];

    dispatch(setGridData(data));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(toggleLoader(false));
}

export const changeStatus = (param) => async () => {
    const url = 'Portal/Administrator/ChangeStatus';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}