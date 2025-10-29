
import { post } from '../../../../modules/ajaxRequest';
import { setSelectedUserPanel, toggleLoaderUserPanel, redirectToDailyEarningDetail, redirectToStatementHistory } from '../../../customer/user-panel/actions';
import { SET_PARAM } from './types';

export { toggleLoaderUserPanel, redirectToDailyEarningDetail, setSelectedUserPanel, redirectToStatementHistory };

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}

export const fetchData = (param) => async () => {
    const url = 'Portal/UserPanel/StatementHistory/GetDailyEarning';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}