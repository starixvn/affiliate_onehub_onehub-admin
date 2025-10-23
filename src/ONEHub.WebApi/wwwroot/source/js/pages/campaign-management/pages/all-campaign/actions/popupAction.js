import * as types from './types';

export const openCampaignPopup = (isAdd = true, selectedItem = null) => {
    return {
        type: types.OPEN_CAMPAIGN_POPUP,
        data: {
            isOpen: true,
            isAdd,
            selectedItem
        }
    };
};

export const closeCampaignPopup = () => {
    return {
        type: types.CLOSE_CAMPAIGN_POPUP,
        data: {
            isOpen: false,
            isAdd: true,
            selectedItem: null
        }
    };
};
