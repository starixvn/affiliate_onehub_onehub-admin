import { combineReducers } from 'redux';

import createReducer from '../../../../modules/createReducer';
import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';
import { fileUpload } from '../../libs/constants';
import * as types from '../actions/types';

export const statusList = createReducer(null, {
    [types.SET_STATUS_LIST](prevState, action) {
        return action.data;
    }
});
export const allLanguagesInSystem = createReducer(null, {});
export const maxFileSize = createReducer(fileUpload.MaxFileSize, {});
export const maximumFiles = createReducer(fileUpload.MaximumFiles, {});
export const bannerRootUrl = createReducer(null, {});
export const allowedExtensions = createReducer(fileUpload.AllowedImageExtensions, {});
export const isModifyInFormUploader = createReducer(false, {});

export const moduleList = createReducer(null, {
    [types.SET_MODULE_LIST](prevState, action) {
        return action.data;
    }
});
export const targetCountryList = createReducer(null, {
    [types.SET_TARGET_COUNTRY_LIST](prevState, action) {
        return action.data;
    }
});
export const languageList = createReducer(null, {
    [types.SET_LANGUAGE_LIST](prevState, action) {
        return action.data;
    }
});
export const notification = createReducer({ message: '', isConfirmPopup: false, onConfirm: null }, {
    [types.SET_NOTIFICATION](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
});

export const param = createReducer(null, {
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const formDetailUrl = createReducer(null, {
    [types.SET_FORM_DETAIL_URL](prevState, action) {
        return Object.assign({}, { ...action.data });
    }
})

export const selectedMediaId = createReducer(null, {
    [types.SET_SELECTED_MEDIA_ID](prevState, action) {
        return action.data;
    }
})

export const checkedForms = createReducer({}, {
    [types.SET_CHECKED_FORMS](prevState, action) {
        return action.data;
    }
})

export const shouldResetScrollPosition = createReducer(true, {
    [types.SHOULD_RESET_SCROLL_POSITION](prevState, action) {
        return action.data;
    }
})

export const gridData = createReducer(null, {
    [types.SET_GRID_DATA](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    moduleList,
    targetCountryList,
    languageList,
    statusList,
    allLanguagesInSystem,
    maxFileSize,
    maximumFiles,
    allowedExtensions,
    bannerRootUrl,
    param,
    gridData,
    pagingOption,
    isShowLoader,
    checkedForms,
    shouldResetScrollPosition,
    formDetailUrl,
    selectedMediaId,
    notification,
    isModifyInFormUploader
});