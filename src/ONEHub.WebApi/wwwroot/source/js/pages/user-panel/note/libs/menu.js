import React from 'react'
import { menuKey } from '../libs/constants';
import { Claim, claimResource } from '../../../../modules/claim';

const AffNote = React.lazy(() => import( /* webpackChunkName: "affNote" */ '../aff-note/components/AppContainer'));
const MarketingNote = React.lazy(() => import(/* webpackChunkName: "marketingNote" */ '../marketing-note/components/AppContainer'));

export const menuList = [
    { key: menuKey.affNote, label: 'Note', component: AffNote, renderClaim: new Claim(claimResource.Note) },
    { key: menuKey.marketingNote, label: 'Marketing Team Note', component: MarketingNote, renderClaim: new Claim(claimResource.MarketingTeamNote) }
]