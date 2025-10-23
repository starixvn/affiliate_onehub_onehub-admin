import * as types from '../actions/types';

import createReducer from '@/modules/createReducer';

export const rootFolder = createReducer(null, {
    [types.SET_ROOT_FOLDER]: (state, action) => action.data,
});

export const subPath = createReducer('', {
    [types.SET_SUB_PATH]: (state, action) => action.data,
});

export const assetName = createReducer('', {
    [types.SET_ASSET_NAME]: (state, action) => action.data,
});

export const isShowAssetModificationPopup = createReducer(false, {
    [types.IS_SHOW_ASSET_MODIFICATION_POPUP]: (state, action) => action.data,
});