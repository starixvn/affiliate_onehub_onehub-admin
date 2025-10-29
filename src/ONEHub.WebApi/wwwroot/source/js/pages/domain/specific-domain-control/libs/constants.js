import { globalResource } from '../../../../modules/globalResource';

export { globalResource };

export const headerText = {
    Search: globalResource.Search,
    Index: '#',
    Affiliate: 'Affiliate',
    AffDomain: 'Aff Domain',
    RedirectDomain: 'Redirect Domain',
    Creator: 'Creator',
    CreatedDate: 'Created Date',
    SSL: 'SSL',
    Status: 'Status',
    UpdatedBy: 'Updated By',
    UpdatedDate: 'Updated Date',
    Edit: globalResource.Edit,
    Delete: globalResource.Delete,
    MobileOnly: 'Mobile Only'
}

export const defaultState = {
    isInsert: true,
    isShowMessage: false,
    isSuccess: true,
    message: '',
    selectedDomain: null,
    affUsernames: '',
}

export const affsCondition = {
    maximumNumber: 500,
    charactersPattern: /[^0-9a-zA-Z\n\s,]/,
    affsPattern: /^(12betaff\d{3,7})(,(12betaff\d{3,7}))*$/i
}