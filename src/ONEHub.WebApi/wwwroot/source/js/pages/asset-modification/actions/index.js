import * as popupAction from './popupAction';
import { toggleLoader } from '@/actions/loaderAction';
import * as types from './types';

export const setIsShowAssetModificationPopup = (item) => {
    return {
        type: types.IS_SHOW_ASSET_MODIFICATION_POPUP,
        data: item,
    };
};


export const ActionCreators = {
    ...popupAction,
    setIsShowAssetModificationPopup,
    toggleLoader,
};