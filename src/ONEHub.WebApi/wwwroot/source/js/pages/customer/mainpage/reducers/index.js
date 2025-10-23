import { combineReducers } from 'redux';
import { RESET_USER_PANEL } from '../../user-panel/actions/types';

import leftPanel from '../../left-panel/reducers';
import { affCommonInfo, today, languageList, productList, currencyList, baseCurrencyList, isProduction, licenseeName } from './commonReducer';
import { userPanelReducer, selectedUserPanel, isShowLoaderUserPanel } from '../../user-panel/reducers';
import customerStatistics from '../../customer-statistics/reducers';
import { claimsPrincipal } from '../../../../reducers/claimReducer';

const allReducers = combineReducers({
    today,
    languageList,
    productList,
    currencyList,
    baseCurrencyList,
    isProduction,
    licenseeName,
    claimsPrincipal,
    selectedUserPanel,
    isShowLoaderUserPanel,
    affCommonInfo,
    leftPanel,
    customerStatistics,
    ...userPanelReducer
});

export const rootReducer = (state, action) => {
    const newState = { ...state };
    if (action.type === RESET_USER_PANEL) {
        const userPanelName = action.data;
        newState[userPanelName] = {};
    }

    return allReducers(newState, action);
};

export default rootReducer;