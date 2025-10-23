import { post } from '../../../../modules/ajaxRequest';
import { submitFail } from "../../../../modules/constants";
import { getAffiliateInfo } from '../../mainpage/actions/loadingDataAction';
import { SET_AFF_NAME, SET_IS_VALID_USERNAME, TOGGLE_LOADER_LEFT_PANEL } from './types';

export { getAffiliateInfo };

export const setAffName = (data) => {
    return {
        type: SET_AFF_NAME,
        data
    }
}

export const setIsValidUserName = (data) => {
    return {
        type: SET_IS_VALID_USERNAME,
        data
    }
}

export const toggleLoaderLeftPanel = (data) => {
    return {
        type: TOGGLE_LOADER_LEFT_PANEL,
        data
    }
}

export const getOnLineList = (affName) => async (dispatch) => {
    const url = 'customerleftpanel/online-list';
    const param = { affUsername: affName };
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateLanguage = (param) => async () => {
    const url = 'customerleftpanel/update-language';

    return await handleRequestUpdate(url, param);
}

export const updateAffType = (param) => async () => {
    const url = 'customerleftpanel/update-afftype';

    return await handleRequestUpdate(url, param);
}

export const updateStatus = (param) => async () => {
    const url = 'customerleftpanel/update-status';

    return await handleRequestUpdate(url, param);
}

export const getTransferLimitSetting = (affId) => async () => {
    const url = 'customerleftpanel/transfer-limit-setting';
    const response = await post(url, { affId });

    return response && response.status === 200 ? response.data : null;
}

export const updateTransferLimitSetting = (param) => async () => {
    const url = 'customerleftpanel/update-transfer-limit';

    return await handleRequestUpdate(url, param);
}

export const handleRequestUpdate = async (url, param) => {
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : submitFail;
}