import { postWithoutAlert } from '@/modules/ajaxRequest';
import { toggleLoader } from '@/actions/loaderAction';
import { apiUrl } from '../constants/api';
import { showSuccessToast, showErrorToast } from '@/pages/common/components/Toast';

export const uploadAssets = (param, callback) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await postWithoutAlert(apiUrl.uploadAssets, param);
        const isSuccess = response && response.status === 200 && response.data && response.data.Code === 0;
        if (isSuccess) {
            showSuccessToast("Upload Success!", `Assets has been uploaded successfully.`);
        }
        else {
            const errorMessage = response?.data?.Message || `Failed to upload assets. Please try again.`;
            showErrorToast("Upload Failed!", errorMessage);
        }
    }
    catch (error) {
        console.error(error);
        showErrorToast("Upload Failed!", `An error occurred while uploading assets.`);
    } finally {
        dispatch(toggleLoader(false));
        callback && callback();
    }
}

export const deleteAsset = (param, callback) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await postWithoutAlert(apiUrl.deleteAsset, param);
        const isSuccess = response && response.status === 200 && response.data && response.data.Code === 0;
        if (isSuccess) {
            showSuccessToast("Delete Success!", `Asset has been deleted successfully.`);
            return { IsSuccessful: true, Message: "Asset deleted successfully" };
        }
        else {
            const errorMessage = response?.data?.Message || `Failed to delete asset. Please try again.`;
            showErrorToast("Delete Failed!", errorMessage);
        }
    }
    catch (error) {
        console.error(error);
        showErrorToast("Delete Failed!", `An error occurred while delete asset.`);
    } finally {
        dispatch(toggleLoader(false));
        callback && callback();
    }
}