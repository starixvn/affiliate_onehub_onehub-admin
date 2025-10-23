import { resolveClientUrl } from "../../../modules/utils"

export const menuKey = {
    affiliateDomain: 'Affiliate Domain',
    memberDomains: '12Bet Domains',
    domainControl: 'Domain Control',
    subAffDomain: 'Sub Affiliate Domain',
    specificDomainControl: 'Specific Domain Control'
}

export const relativePath = {
    affiliateDomain: resolveClientUrl('Portal/Domain'),
    memberDomains: resolveClientUrl('Portal/MemberDomain'),
    domainControl: resolveClientUrl('Portal/DomainControl'),
    subAffDomain: resolveClientUrl('Portal/SubAffDomain'),
    specificDomainControl: resolveClientUrl('Portal/SpecificDomainControl')
}