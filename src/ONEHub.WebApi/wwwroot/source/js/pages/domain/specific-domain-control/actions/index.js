import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import { setPagingOption } from '../../../../actions/pagingAction';
import * as types from './types';

export { toggleLoader, setPagingOption };

export const setSelectedDomainId = (data) => {
    return {
        type: types.SET_SELECTED_SPECIFIC_DOMAIN_ID,
        data
    }
}

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
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

    const url = 'Portal/SpecificDomainControl/GetSpecificDomainControlList';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;

    dispatch(setGridData(data ? data.MainData : []));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.PageIndex, PageSize: param.PageSize }));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(toggleLoader(false));
}

export const getSpecificDomainById = (specificDomainControlId) => async () => {
    const url = 'Portal/SpecificDomainControl/GetSpecificDomainControlById';
    const response = await post(url, { specificDomainControlId });

    return response && response.status === 200 ? response.data : null;
}

export const insertSpecificDomain = (param) => async () => {
    const url = 'Portal/SpecificDomainControl/InsertSpecificDomainControl';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateSpecificDomain = (param) => async () => {
    const url = 'Portal/SpecificDomainControl/UpdateSpecificDomainControl';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const deleteSpecificDomain = (param) => async () => {
    const url = 'Portal/SpecificDomainControl/DeleteSpecificDomainControl';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}
