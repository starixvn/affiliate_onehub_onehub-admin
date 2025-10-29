import { globalResource } from '../../../modules/globalResource';

export { globalResource };

export const allStatuses = 'Approved, Suspended';
export const statusList = {
    [allStatuses]: 'All Statuses',
    Approved: 'Approved',
    Suspended: 'Suspended'
}

export const regExp = {
    CheckAffCode: "(^[1-9])(\\d*)$"
}

export const headerText = {
    Index: globalResource.Index,
    UserName: 'Username',
    AffCode: 'Affiliate Code',
    Status: 'Status',
    FirstName: 'First Name',
    LastName: 'Last Name',
    Phone: 'Mobile Phone',
    TargetCountryCode: 'Target Country',
    Language: 'Language',
    CommissionGroup: 'Deal Name',
    RegistrationDateText: 'Registration Date',
    ApprovedByText: 'Created By',
    Action: 'Action'
}

export const defaultGeneralInfo = {
    affType: 0,
    groupId: '',
    preferredLanguage: '',
    targetCountryName: '',
    targetCountryCode: '',
    affId: 0,
    affParentName: '',
    affCode: '',
    userName: '',
    mailOption: false
}

export const defaultPersonalInfo = {
    firstName: '',
    lastName: '',
    gender: false,
    email: '',
    phone: '',
    contactApps: ''
}

export const defaultAdditionalInfo = {
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    question: '',
    questionId: 0, 
    answer: ''
}

export const defaultWebsiteInfo = {
    siteUrl: '',
    moreSiteUrls: '',
    noSiteDesc: "",
    hasWebSite: false
}

export const defaultPaymentInfo = {
    preferredPayment: '',
    playerCustId: -1,
    playerUsername: '',
    playerCurrency: '',
    playerCurrencyId: 0
}

export const resource = {
    Search: globalResource.Search,
    Space: ' - ',
    ReportName: 'MARKETING ACCOUNT REPORT',
    AllStatuses: 'All Statuses',
    AllTargetCountry: 'All TARGET COUNTRIES',
    AllLanguages: 'All Languages',
    UsernameContains: 'USERNAME CONTAINS ',
    Apostrophe: "'",
    NA: 'N/A'
}

export const defaultFilterParams = {
    "ParentAffName": "",
    "Status": "",
    "IsFromHome": false,
    "GroupIds": "all",
    "TargetCountryCode": "",
    "Language": "",
    "UserName": "",
    "Email": "",
    "SortBy": 2,
    "SortDirectionType": false,
    "AffCode": "",
    "AffPlayer": "",
    "PageIndex": 1,
    "PageSize": 20,
    "AffCategoryIds": "2"
}