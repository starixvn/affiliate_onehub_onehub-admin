import createReducer from '../../../../modules/createReducer';
import { SET_SELECTED_USERPANEL, TOGGLE_LOADER_USER_PANEL } from '../actions/types';
import { userPanelMenuKey as menuKey } from '../../common/modules/constants';

import statementHistoryReducer from '../../../user-panel/statement-history/reducers';
import userAccountReducer from '../../../user-panel/user-account/reducers';
import noteReducer from '../../../user-panel/note/reducers';
import adjustmentReducer from '../../../user-panel/adjustment/reducers';
import trackingStatisticsReducer from '../../../user-panel/tracking-statistics/reducers';
import memberReducer from '../../../user-panel/customer-member/reducers';
import viewLogReducer from '../../../user-panel/view-log/reducers';
import referrerStatisticsReducer from '../../../user-panel/referrers/reducers';
import landingPageStatisticsReducer from '../../../user-panel/landing-page-statistics/reducers';
import playerDetailReducer from '../../../user-panel/player-detail/reducers';
import dailyEarningReducer from '../../../user-panel/daily-earning/reducers';
import dailyEarningDetailReducer from '../../../user-panel/daily-earning-detail/reducers';
import subAffiliateReducer from '../../../user-panel/sub-affiliate/reducers';
import marketingStatisticsReducer from '../../../user-panel/marketing-statistics/reducers';

export const selectedUserPanel = createReducer(null, {
    [SET_SELECTED_USERPANEL](prevState, action) {
        return action.data;
    }
});

export const isShowLoaderUserPanel = createReducer(false, {
    [TOGGLE_LOADER_USER_PANEL](prevState, action) {
        return action.data;
    }
});

export const userPanelReducer = {
    [menuKey.statementHistory]: statementHistoryReducer,
    [menuKey.dailyEarning]: dailyEarningReducer,
    [menuKey.dailyEarningDetail]: dailyEarningDetailReducer,
    [menuKey.subAffiliate]: subAffiliateReducer,
    [menuKey.edit]: userAccountReducer,
    [menuKey.note]: noteReducer,
    [menuKey.playerDetail]: playerDetailReducer,
    [menuKey.adjustment]: adjustmentReducer,
    [menuKey.trackingStatistics]: trackingStatisticsReducer,
    [menuKey.member]: memberReducer,
    [menuKey.viewLog]: viewLogReducer,
    [menuKey.clickStatistics]: referrerStatisticsReducer,
    [menuKey.landingPageStatistics]: landingPageStatisticsReducer,
    [menuKey.marketingStatistics]: marketingStatisticsReducer
}