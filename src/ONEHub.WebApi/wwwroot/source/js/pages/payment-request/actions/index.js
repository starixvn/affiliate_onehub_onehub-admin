import { SET_PARAM, SET_TRANSACTION_ID } from './types';
import { toggleLoader } from '../../../actions/loaderAction';
import { setPagingOption } from '../../../actions/pagingAction';
import { post } from '../../../modules/ajaxRequest';

export { toggleLoader, setPagingOption };

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}

export const setTransactionId = (data) => {
    return {
        type: SET_TRANSACTION_ID,
        data
    }
}

export const fetchData = (param) => async () => {
    const url = 'Portal/PaymentRequest/GetPaymentRequestList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}