import { post } from '../../../../modules/ajaxRequest';
import { setPagingOption } from '../../../../actions/pagingAction';
import { getPageList as pageList } from '../../../customer/user-panel/modules/service';
import { setSelectedUserPanel } from '../../../customer/user-panel/actions';
import { toggleLoaderUserPanel } from '../../../customer/user-panel/actions';
import { SET_SELECTED_PAGE, SET_PARAM } from '../actions/types';

export { setPagingOption, toggleLoaderUserPanel, setSelectedUserPanel };

export const setSelectedPage = (data) => {
    return {
        type: SET_SELECTED_PAGE,
        data
    }
}

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}

export const getPageList = () => pageList;

export const fetchData = (param) => async () => {
    const url = 'Portal/UserPanel/LandingPageStatistics/GetLandingPageStatisticsList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const fetchDetailData = (param) => async () => {
    const url = 'Portal/UserPanel/LandingPageStatistics/GetLandingPageStatisticsDetailList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}