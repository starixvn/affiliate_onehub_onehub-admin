import { setSelectedUserPanel } from '../../../customer/user-panel/actions';
import { setPagingOption } from './../../../../actions/pagingAction';
import { toggleLoaderUserPanel } from './../../../customer/user-panel/actions/index';
import { post } from '../../../../modules/ajaxRequest';
import * as types from './types';

export { setPagingOption, toggleLoaderUserPanel, setSelectedUserPanel };

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const fetchData = (param) => async () => {
    const url = 'Portal/UserPanel/MarketingStatistics/GetMarketingStatisticsList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
} 