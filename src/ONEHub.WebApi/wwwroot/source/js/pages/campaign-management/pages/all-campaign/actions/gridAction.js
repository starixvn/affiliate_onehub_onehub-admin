import * as types from './types';
import { post, postWithoutAlert } from '@/modules/ajaxRequest';
import { toggleLoader } from '@/actions/loaderAction';
import { setPagingOption } from '@/actions/pagingAction';
import { apiUrl } from '../constants/api';
import { showSuccessToast, showErrorToast } from '@/pages/common/components/Toast';
import exportExcel from '../libs/exportExcel';

export const setGridData = (item) => {
    return {
        type: types.SET_GRID_DATA,
        data: item,
    };
};

export const setShouldResetScrollPosition = (data) => {
    return {
        type: types.SHOULD_RESET_SCROLL_POSITION,
        data
    }
}

export const fetchData = (param) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await post(apiUrl.getCampaignList, param);

        const data = response && response.status === 200 ? response.data : null;

        dispatch(setGridData(data ? data.MainData : []));
        dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.PageIndex, PageSize: param.PageSize }));
        dispatch(setShouldResetScrollPosition(true));
    } catch (error) {
        console.error(error);
    } finally {
        dispatch(toggleLoader(false));
    }
}

export const fetchDataForExportExcel = (param, title) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await post(apiUrl.getCampaignList, { ...param, IsExportExcel: true });
        const data = response && response.status === 200 ? response.data : null;
        data ? data.MainData : [];
        exportExcel(data, title);
    }
    catch (error) {
        console.error(error);
    } finally {
        dispatch(toggleLoader(false));
    }
}

export const updateCampaign = (param, callback) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await postWithoutAlert(apiUrl.updateCampaign, param);
        const isSuccess = response && response.status === 200 && response.data && response.data.Code === 0;
        if (isSuccess) {
            showSuccessToast("Update Success!", `Campaign "${param.campaignName}" has been updated successfully.`);
        }
        else {
            const errorMessage = response?.data?.Message || `Failed to update campaign "${param.campaignName}". Please try again.`;
            showErrorToast("Update Failed!", errorMessage);
        }
    }
    catch (error) {
        console.error(error);
        showErrorToast("Update Failed!", `An error occurred while updating campaign "${param.campaignName}".`);
    } finally {
        dispatch(toggleLoader(false));
        callback && callback();
    }
}

export const insertCampaign = (param, callback) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await postWithoutAlert(apiUrl.insertCampaign, param);
        const isSuccess = response && response.status === 200 && response.data && response.data.Code === 0;
        if (isSuccess) {
            showSuccessToast("Insert Success!", `Campaign "${param.campaignName}" has been created successfully.`);
            return { IsSuccessful: true, Message: "Campaign created successfully" };
        }
        else {
            const errorMessage = response?.data?.Message || `Failed to create campaign "${param.campaignName}". Please try again.`;
            showErrorToast("Insert Failed!", errorMessage);
        }
    }
    catch (error) {
        console.error(error);
        showErrorToast("Insert Failed!", `An error occurred while create campaign "${param.campaignName}".`);
    } finally {
        dispatch(toggleLoader(false));
        callback && callback();
    }
}