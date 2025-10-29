import { globalResource } from '../../../../modules/globalResource';

export { globalResource };

export const filterDealMode = {
    'Exclude': 1,
    'Include': 0
}

export const headerText = {
    Index: '#',
    TargetCountry: 'Target Country',
    AffDomain: 'Aff Domain',
    AffSubDomain: 'Aff Sub-domain',
    RedirectDomain: 'Redirect Domain',
    MobileOnly: 'Mobile Only',
    Deal: 'Deal',
    Creator: 'Creator',
    CreatedDate: 'Created Date',
    Status: 'Active',
    Edit: globalResource.Edit,
    Delete: globalResource.Delete
}

export const defaultState = {
    isInsert: true,
    isShowMessage: false,
    isSuccess: true,
    message: '',
    selectedDomain: {
        domainControlId: 0,
        affDomainId: 0,
        redirectDomainId: 0,
        targetCountryCode: '',
        isUsed: true,
        isExcluded: 0,
        dealIds: '',
        isMobile: false
    },
    isClickedSubmit: false,
    affDomainList: [],
    redirectDomainList: [],
    dealListMultipleSelected: [],
}