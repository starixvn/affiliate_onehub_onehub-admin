import { globalResource } from '../../../../modules/globalResource';

export { globalResource };

export const headerText = {
    Index: '#',
    Domain: 'Domain',
    SSL: 'SSL',
    Creator: 'Creator',
    CreatedDate: 'Created Date',
    BlockTargetCountry: 'Block Target Country',
    Edit: globalResource.Edit,
    Delete: globalResource.Delete
}

export const defaultState = {
    isInsert: true,
    isShowMessage: false,
    isSuccess: true,
    message: '',
    isConfirmPopup: true,
    messageConfirm: '',
    isBlockAllTargetCountries: false,
    selectedDomain: null,
    targetCountryList: null,
    initialTargetCountryList: null,
}