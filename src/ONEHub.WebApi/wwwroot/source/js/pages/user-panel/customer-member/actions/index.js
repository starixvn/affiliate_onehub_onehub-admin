import { post } from '../../../../modules/ajaxRequest';
import { setPagingOption } from '../../../../actions/pagingAction';
import { toggleLoaderUserPanel } from '../../../customer/user-panel/actions';
import { SET_PARAM } from './types';

export { setPagingOption, toggleLoaderUserPanel };

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}

export const fetchData = (param) => async () => {
    const url = 'Portal/UserPanel/CustomerMember/GetCustomerMember';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}