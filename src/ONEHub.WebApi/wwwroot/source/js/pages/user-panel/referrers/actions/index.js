import { post } from '../../../../modules/ajaxRequest';
import { setPagingOption } from '../../../../actions/pagingAction';
import { setSelectedUserPanel, toggleLoaderUserPanel } from '../../../customer/user-panel/actions';
import { SET_SELECTED_SITE_URL, SET_PARAM } from '../actions/types';

export { setPagingOption, toggleLoaderUserPanel, setSelectedUserPanel };

export const setSelectedSiteUrl = (data) => {
    return {
        type: SET_SELECTED_SITE_URL,
        data
    }
}

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}

export const fetchData = (param) => async () => {
    const url = 'Portal/UserPanel/Referrers/GetReferrersList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const fetchDetailData = (param) => async () => {
    const url = 'Portal/UserPanel/Referrers/GetReferrersDetailList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}