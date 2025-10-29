import React from 'react';

import { Claim, claimResource } from '../../../modules/claim';
import { menuKey, relativePaths } from './constants';

const deal = React.lazy(() => import(/* webpackChunkName: 'deal' */ '../deal/index'));

export const menus = [
    {
        key: menuKey.operation,
        label: 'Deal',
        href: relativePaths[menuKey.operation],
        component: deal,
        renderClaim: new Claim(claimResource.Deal)
    }
]