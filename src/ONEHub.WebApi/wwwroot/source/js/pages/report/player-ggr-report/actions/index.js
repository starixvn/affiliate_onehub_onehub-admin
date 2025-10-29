import * as types from './types';
import { post } from '../../../../modules/ajaxRequest';
import { setPagingOption } from '../../../../actions/pagingAction';

export { setPagingOption };

export const setReportTitle = (data) => {
    return {
        type: types.SET_REPORT_TITLE,
        data
    }
}

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setProductList = (data) => {
    return {
        type: types.SET_PRODUCT_LIST,
        data
    }
}

export const fetchData = (param) => async () => {
    const url = 'Portal/PlayerGgrReport/GetPlayerGgrReportData';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}