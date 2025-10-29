import { SET_MONTHDATE } from './types';
import { post } from '../../../../modules/ajaxRequest';

export const setMonthDate = (data) => {
    return {
        type: SET_MONTHDATE,
        data
    }
}

export const fetchData = (param) => async () => {
    const url = 'customerstatistics/statistics';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}