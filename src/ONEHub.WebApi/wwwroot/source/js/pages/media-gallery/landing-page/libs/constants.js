import { globalResource } from '../../../../modules/globalResource';

export { globalResource };

export const filterDealMode = {
    'Exclude': 1,
    'Include': 0
}

export const landingPageStatus = {
    0: 'Draft',
    1: 'Active',
    2: 'Inactive',
};

export const headerText = {
    Index: '#',
    BlockTargetCountry: 'Block Target Country',
    LandingPageName: 'Landing Page Name',
    ShowInDropdown: 'Show in dropdown',
    LandingPageCode: 'Landing Page Code',
    ContainInLinks: 'Contained in links',
    Deal: 'Deal',
    MobileOnly: 'Mobile Only',
    Status: 'Status',
}

export const defaultState = {
    selectedLandingPage: {
        pageName: '',
        pageCode: '',
        blockTargetCountry: '',
        isExcluded: 0,
        isMobile: false,
        dealIds: ''
    },
    targetCountryList: [],
    dealListMultipleSelected: [],
    isClickedSubmit: false,
    isInsert: true,
    isShowMessage: false,
    isSuccess: true,
    message: ''
}

export const restrictedCharactersPattern = /[;\/\?:@=&"<>#%{}\|\\^~\[\]`\s+]/;
export const maxLength = 50;

export const messages = {
    requiredErrorMessage: 'This field is required',
    maxLengthErrorMessage: 'This field must not exceed 50 characters',
    PleaseSelect: 'Please select landing page(s) to delete',
    AreYouSureDeleteItems: 'Are you sure to delete the selected landing page(s)?',
    DeleteItemsSuccessfully: 'Delete landing page(s) Successfully'
}