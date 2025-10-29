import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import { setPagingOption } from '../../../../actions/pagingAction';

import {
    SET_PARAM, SET_PARAM_FROM_HOME, SET_BANNER_DETAIL_URL, SET_CHECKED_BANNERS, SET_SELECTED_BANNER_ID,
    SHOULD_RESET_SCROLL_POSITION, SET_GRID_DATA, SET_SIZE_LIST, SET_DISABLE_CURRENCY, SET_CATEGORY_LIST
} from './types';

export { toggleLoader, setPagingOption };

export const setParam = (data) => {
    return {
        type: SET_PARAM,
        data
    }
}

export const setParamFromHome = (data) => {
    return {
        type: SET_PARAM_FROM_HOME,
        data
    }
}

export const setBannerDetailUrl = (data) => {
    return {
        type: SET_BANNER_DETAIL_URL,
        data
    }
}

export const setSelectedBannerId = (data) => {
    return {
        type: SET_SELECTED_BANNER_ID,
        data
    }
}

export const setCheckedBanners = (data) => {
    return {
        type: SET_CHECKED_BANNERS,
        data
    }
}

export const setShouldResetScrollPosition = (data) => {
    return {
        type: SHOULD_RESET_SCROLL_POSITION,
        data
    }
}

export const setGridData = (data) => {
    return {
        type: SET_GRID_DATA,
        data
    }
}

export const setSizeList = (data) => {
    return {
        type: SET_SIZE_LIST,
        data
    }
}

export const setDisableCurrency = (data) => {
    return {
        type: SET_DISABLE_CURRENCY,
        data
    }
}

export const setCategoryList = (data) => {
    return {
        type: SET_CATEGORY_LIST,
        data
    }
}

export const getCategories = (userType) => async () => {
    const url = 'Portal/MediaGallery/GetCategoryList';
    const response = await post(url, { userType });

    const data = response && response.status === 200 ? response.data : [];

    return data.map(item => {
        return {
            categoryName: item.CategoryName,
            key: item.CategoryName,
            name: item.CategoryName,
            checked: false
        };
    });
}

export const getCategoryList = (userType) => async (dispatch) => {
    const url = 'Portal/MediaGallery/GetCategoryList';
    const response = await post(url, { userType });

    const data = response && response.status === 200 ? response.data : [];

    dispatch(setCategoryList(data));
}

export const getSizeList = (param) => async (dispatch) => {
    const url = 'Portal/MediaGallery/GetSizeList';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data.map(item => {
        return {
            key: item.Id,
            name: item.Name,
            checked: false
        };
    }) : null;

    dispatch(setSizeList(data));
}

export const fetchData = (param) => async (dispatch) => {
    dispatch(toggleLoader(true));

    const url = 'Portal/MediaGallery/GetBannerList';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;
    const checkedBanners = data ? _convertCheckedBanners(data.MainData) : {};

    dispatch(setGridData(data ? data.MainData : []));
    dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.PageIndex, PageSize: param.PageSize }));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(setCheckedBanners(checkedBanners));
    dispatch(toggleLoader(false));
}

function _convertCheckedBanners(dataList) {
    const checkedBanners = {};
    for (let item of dataList) {
        const itemId = item.BannerId;
        checkedBanners[itemId] = false;
    }

    return checkedBanners;
}

export const getBannerDetail = (selectedBannerId, userType) => async () => {
    const url = 'Portal/MediaGallery/GetBannerDetail';
    const response = await post(url, { selectedBannerId, userType });

    return response && response.status === 200 ? response.data : null;
}

export const insertBanner = (param) => () => {
    const url = 'Portal/MediaGallery/insertBanner';

    return handleExcute(url, param);
}

export const updateBanner = (param) => () => {
    const url = 'Portal/MediaGallery/UpdateBanner';

    return handleExcute(url, param);
}

const handleExcute = async (url, param) => {
    const formData = new FormData();
    for (let key in param) {
        key !== 'files' && formData.append(key, param[key]);
    }

    const files = param['files'];

    if (files) {
        for (let file of files) {
            formData.append('files', file);
        }
    }

    const response = await post(url, formData);

    return response && response.status === 200 ? response.data : null;
}

export const deleteBanners = (param) => async () => {
    const url = 'Portal/MediaGallery/DeleteBanners';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}