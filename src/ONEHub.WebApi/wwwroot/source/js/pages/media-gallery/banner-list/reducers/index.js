import { combineReducers } from 'redux';

import createReducer from '../../../../modules/createReducer';
import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';
import {
    SET_PARAM, SET_PARAM_FROM_HOME, SET_BANNER_DETAIL_URL, SET_CHECKED_BANNERS, SET_SELECTED_BANNER_ID,
    SHOULD_RESET_SCROLL_POSITION, SET_GRID_DATA, SET_SIZE_LIST, SET_DISABLE_CURRENCY, SET_CATEGORY_LIST
} from '../actions/types';

export const categoryList = createReducer(null, {
    [SET_CATEGORY_LIST](prevState, action) {
        return action.data;
    }
});
export const playerCategoryList = createReducer(null, {});
export const subAffiliateCategoryList = createReducer(null, {});
export const subCategoryList = createReducer(null, {});
export const bannerRootUrl = createReducer(null, {});
export const subCategoryCasinoList = createReducer(null, {});
export const subCategorySportsbookList = createReducer(null, {});
export const languageList = createReducer(null, {});
export const currencyList = createReducer(null, {});
export const affTypeList = createReducer(null, {});
export const defaultLanguage = createReducer(null, {});
export const deviceTypeList = createReducer([
    { key: 0, name: "PC / Laptop", checked: true },
    { key: 1, name: "Mobile", checked: true }
], {});

export const sizeList = createReducer(null, {
    [SET_SIZE_LIST](prevState, action) {
        return action.data;
    }
});

export const param = createReducer(null, {
    [SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const paramFromHome = createReducer(null, {
    [SET_PARAM_FROM_HOME](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const bannerDetailUrl = createReducer(null, {
    [SET_BANNER_DETAIL_URL](prevState, action) {
        return Object.assign({}, { ...action.data });
    }
})

export const selectedBannerId = createReducer(null, {
    [SET_SELECTED_BANNER_ID](prevState, action) {
        return action.data;
    }
})

export const checkedBanners = createReducer({}, {
    [SET_CHECKED_BANNERS](prevState, action) {
        return action.data;
    }
})

export const shouldResetScrollPosition = createReducer(true, {
    [SHOULD_RESET_SCROLL_POSITION](prevState, action) {
        return action.data;
    }
})

export const gridData = createReducer(null, {
    [SET_GRID_DATA](prevState, action) {
        return action.data;
    }
})

export const isDisableCurrency = createReducer(false, {
    [SET_DISABLE_CURRENCY](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    categoryList,
    subCategoryList,
    subCategoryCasinoList,
    subCategorySportsbookList,
    languageList,
    currencyList,
    sizeList,
    affTypeList,
    deviceTypeList,
    bannerRootUrl,
    param,
    paramFromHome,
    gridData,
    pagingOption,
    isShowLoader,
    checkedBanners,
    bannerDetailUrl,
    selectedBannerId,
    shouldResetScrollPosition,
    isDisableCurrency,
    playerCategoryList,
    subAffiliateCategoryList,
    defaultLanguage
});