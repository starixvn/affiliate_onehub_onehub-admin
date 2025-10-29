import React from 'react'
import { Claim, claimResource } from '../../../modules/claim';
import { menuKey, relativePath } from './constants';

const Domain = React.lazy(() => import(/* webpackChunkName: "domain" */ '../domain/index'));
const DomainControl = React.lazy(() => import(/* webpackChunkName: "domainControl" */ '../domain-control/index'));
const SubAffDomain = React.lazy(() => import(/* webpackChunkName: "subAffiliateDomain" */ '../sub-aff-domain/index'));
const SpecificDomainControl = React.lazy(() => import(/* webpackChunkName: "specificDomainControl" */ '../specific-domain-control/index'));


export const menus = [
    { key: menuKey.affiliateDomain, label: 'Affiliate Domain', href: relativePath.affiliateDomain, component: Domain, renderClaim: new Claim(claimResource.Domain) },
    { key: menuKey.memberDomains, label: '12Bet Domains', href: relativePath.memberDomains, component: Domain, renderClaim: new Claim(claimResource.Domain) },
    { key: menuKey.domainControl, label: 'Domain Control', href: relativePath.domainControl, component: DomainControl, renderClaim: new Claim(claimResource.Domain) },
    { key: menuKey.subAffDomain, label: 'Sub-Affiliate Domain', href: relativePath.subAffDomain, component: SubAffDomain, renderClaim: new Claim(claimResource.Domain) },
    { key: menuKey.specificDomainControl, label: 'Specific Domain Control', href: relativePath.specificDomainControl, component: SpecificDomainControl, renderClaim: new Claim(claimResource.Domain) }
]
