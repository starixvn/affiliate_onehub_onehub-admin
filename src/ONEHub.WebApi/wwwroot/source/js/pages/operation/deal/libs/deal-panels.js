import React from 'react';

export const DEAL_REVENUE_SHARE = 1;
export const DEAL_CPA = 3;
export const DEAL_HYBRID = 4;

export const dealPanelKey = {
    cpa: 'cpa',
    revenueShare: 'revenueShare',
}

const DealCPA = React.lazy(() =>
    import( /* webpackChunkName: "dealCpa" */ '../components/shared/deal-cpa/CPAInfo'));
const DealRevenueShare = React.lazy(() =>
    import( /* webpackChunkName: "dealRevenueShare" */ '../components/shared/deal-revenue-share/RevenueShareInfo'));

export const dealPanelList = [
    { key: dealPanelKey.cpa, name: 'CPA', component: DealCPA, supportedDeals: [DEAL_CPA, DEAL_HYBRID] },
    { key: dealPanelKey.revenueShare, name: 'Revenue Share', component: DealRevenueShare, supportedDeals: [DEAL_REVENUE_SHARE, DEAL_HYBRID] }
]