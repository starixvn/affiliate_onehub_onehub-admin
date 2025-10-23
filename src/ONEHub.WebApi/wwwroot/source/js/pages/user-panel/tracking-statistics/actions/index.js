import { post } from '../../../../modules/ajaxRequest';
import { toggleLoaderUserPanel } from '../../../customer/user-panel/actions';
import { getTrackingCodeList as trackingCodeList } from '../../../customer/user-panel/modules/service';
import { SET_PARAM, SET_SELECTED_MONTH } from './types';

export { toggleLoaderUserPanel }

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}

export const setSelectedMonth = (data) => {
    return {
        type: SET_SELECTED_MONTH,
        data
    }
}

export const getTrackingCodeList = (affId) => () => {
    return trackingCodeList(affId);
}

export const fetchData = (param) => async () => {
    const url = 'Portal/UserPanel/TrackingStatistics/GetTrackingStatisticsList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const fetchDetailData = (param) => async () => {
    const url = 'Portal/UserPanel/TrackingStatistics/GetTrackingStatisticsDetailList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}