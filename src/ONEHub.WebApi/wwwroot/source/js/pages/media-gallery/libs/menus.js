import React from 'react'
import { Claim, claimResource } from '../../../modules/claim';
import { menuKey, relativePath } from '../libs/constants';

const BannerList = React.lazy(() => import('../banner-list/index'));
const LandingPageList = React.lazy(() => import('../landing-page/index'));

export const menus = [
    { key: menuKey.bannerList, label: 'Banner List', href: relativePath.bannerList, component: BannerList, renderClaim: new Claim(claimResource.Media) },
    { key: menuKey.landingPageList, label: 'Landing Page List', href: relativePath.landingPageList, component: LandingPageList, renderClaim: new Claim(claimResource.Media) },
]
