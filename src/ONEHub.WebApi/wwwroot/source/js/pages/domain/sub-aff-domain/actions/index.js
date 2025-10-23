import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import { SHOULD_RESET_SCROLL_POSITION, SET_SELECTED_SUB_AFF_DOMAIN, SET_GRID_DATA } from './types';

export { toggleLoader };

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

export const setSelectedSubAffDomain = (data) => {
    return {
        type: SET_SELECTED_SUB_AFF_DOMAIN,
        data
    }
}

export const fetchData = () => async (dispatch) => {
    dispatch(toggleLoader(true));

    const url = 'Portal/SubAffDomain/GetSubAffDomainList';
    const response = await post(url);

    const data = response && response.status === 200 ? response.data : [];

    dispatch(setGridData(data));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(toggleLoader(false));
}

export const insertSubAffDomain = (param) => async () => {
    const url = 'Portal/SubAffDomain/InsertSubAffDomain';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateSubAffDomain = (param) => async () => {
    const url = 'Portal/SubAffDomain/UpdateSubAffDomain';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const deleteSubAffDomain = (param) => async () => {
    const url = 'Portal/SubAffDomain/DeleteSubAffDomain';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}