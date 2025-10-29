import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import { setPagingOption } from '../../../../actions/pagingAction';
import { v4 as uuidv4 } from 'uuid';

import * as types from './types';

export { toggleLoader, setPagingOption };

export const setModuleList = (data) => {
    return {
        type: types.SET_MODULE_LIST,
        data
    }
}

export const setTargetCountryList = (data) => {
    return {
        type: types.SET_TARGET_COUNTRY_LIST,
        data
    }
}

export const setLanguageList = (data) => {
    return {
        type: types.SET_LANGUAGE_LIST,
        data
    }
}

export const setStatusList = (data) => {
    return {
        type: types.SET_STATUS_LIST,
        data
    }
}

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setAssetDetailUrl = (data) => {
    return {
        type: types.SET_ASSET_DETAIL_URL,
        data
    }
}

export const setSelectedMediaId = (data) => {
    return {
        type: types.SET_SELECTED_MEDIA_ID,
        data
    }
}

export const setCheckedAssets = (data) => {
    return {
        type: types.SET_CHECKED_ASSETS,
        data
    }
}

export const setShouldResetScrollPosition = (data) => {
    return {
        type: types.SHOULD_RESET_SCROLL_POSITION,
        data
    }
}

export const setNotification = (data) => {
    return {
        type: types.SET_NOTIFICATION,
        data
    }
}

export const setGridData = (data) => {
    return {
        type: types.SET_GRID_DATA,
        data
    }
}

export const fetchData = (param) => async (dispatch) => {
    dispatch(toggleLoader(true));

    const paramWithId = {
        ...param,
        RequestId: uuidv4()
    };
    const url = 'Portal/AssetUploader/GetAssetList';
    const response = await post(url, paramWithId);

    const data = response && response.status === 200 ? response.data : null;
    const checkedAssets = data ? _convertCheckedAssets(data.MainData || []) : {};

    dispatch(setGridData(data ? data.MainData : []));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.PageIndex, PageSize: param.PageSize }));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(setCheckedAssets(checkedAssets));
    dispatch(toggleLoader(false));
}

function _convertCheckedAssets(dataList) {
    const checkedAssets = {};
    for (let item of dataList) {
        const itemId = item.MediaId;

        checkedAssets[itemId] = {
            isChecked: false,
            isCanDelete: !item.IsMediaIdInUse
        };
    }

    return checkedAssets;
}

export const getAssetDetail = (param) => async () => {
    const paramWithId = {
        ...param,
        RequestId: uuidv4()
    };
    const url = 'Portal/AssetUploader/GetAssetDetail';
    const response = await post(url, paramWithId);

    return response && response.status === 200 ? response.data : null;
}

export const uploadAssets = (param) => () => {
    const url = 'Portal/AssetUploader/UploadAssets';

    return handleExcute(url, param);
}

export const updateAsset = (param) => () => {
    const url = 'Portal/AssetUploader/UpdateAsset';

    return handleExcute(url, param);
}

const handleExcute = async (url, param) => {
    const formData = new FormData();
    for (let key in param) {
        key !== 'files' && formData.append(key, param[key]);
    }
    
    // Add RequestId for tracking
    formData.append('RequestId', uuidv4());

    const files = param['files'];

    if (files) {
        for (let file of files) {
            formData.append('files', file);
        }
    }

    const response = await post(url, formData);

    return response && response.status === 200 ? response.data : null;
}

export const deleteAssets = (mediaIds) => async () => {
    const url = 'Portal/AssetUploader/DeleteAssets';
    const response = await post(url, { 
        mediaIds,
        RequestId: uuidv4()
    });

    return response && response.status === 200 ? response.data : null;
}

export const toggleAssetStatus = (param) => async () => {
    const paramWithId = {
        ...param,
        RequestId: uuidv4()
    };
    const url = 'Portal/AssetUploader/ToggleAssetStatus';
    const response = await post(url, paramWithId);

    return response && response.status === 200 ? response.data : null;
}