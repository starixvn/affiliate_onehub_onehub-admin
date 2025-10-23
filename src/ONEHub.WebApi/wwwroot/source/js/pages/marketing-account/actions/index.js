import * as types from './types';
import { setPagingOption } from '../../../actions/pagingAction';
import { post, get } from './../../../modules/ajaxRequest';
import { getPaymentMethod } from './../../user-panel/user-account/actions/index';
import { defaultAdditionalInfo, defaultGeneralInfo, defaultPaymentInfo, defaultPersonalInfo, defaultWebsiteInfo } from '../libs/constants';

export { setPagingOption, getPaymentMethod };

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setIsShowAddAffMktAccountPopup = (data) => {
    return {
        type: types.SET_IS_SHOW_ADD_AF_MKT_ACCOUNT_POPUP,
        data
    }
}

export const setAff = (data) => {
    return {
        type: types.SET_AFF,
        data
    }
}

export const setReportTitle = (data) => {
    return {
        type: types.SET_REPORT_TITLE,
        data
    }
}

export const fetchMarketingAccounts = (param) => async () => {
    const response = await post('affiliates/list', param);

    return response && response.status === 200 ? response.data : null;
}

const getInfos = (original, data) => {
    if (!data) {
        return original;
    }

    for (var attrname in original) {
        original[attrname] = data[attrname];
    }

    return original;
}

export const getMarketingAccountInfo = async (affId) => {
    const url = 'marketingaccount/user-account-info';

    const response = await post(url, { affId });

    const data = response && response.status === 200 ? response.data : null;

    return {
        personalInfo: getInfos(defaultPersonalInfo, data),
        additionalInfo: getInfos(defaultAdditionalInfo, data),
        paymentInfo: getInfos(defaultPaymentInfo, data),
        websiteInfo: getInfos(defaultWebsiteInfo, data),
        generalInfo: getInfos(defaultGeneralInfo, data)
    }
}   

export const createMarketingAccount = async (data) => {
    const url = 'marketingaccount/create';

    const response = await post(url, data);

    return response && response.status === 200 ? response.data : null;
}   
