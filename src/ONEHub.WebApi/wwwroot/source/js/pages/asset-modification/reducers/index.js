import { combineReducers } from 'redux';
import { isShowLoader } from '@/reducers/loaderReducer';
import * as types from '../actions/types';
import createReducer from '@/modules/createReducer';
export const isShowAssetModificationPopup = createReducer(false, {
    [types.IS_SHOW_ASSET_MODIFICATION_POPUP]: (state, action) => action.data,
});

export default combineReducers(
    Object.assign({}, {
        isShowAssetModificationPopup,
        isShowLoader,
    }));    