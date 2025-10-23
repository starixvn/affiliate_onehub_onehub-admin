import { globalResource } from '../../../../modules/globalResource';

export { globalResource };

export const headerText = {
    Index: '#',
    CampaignCode: 'Campaign Code',
    CampaignName: 'Campaign Name',
    PageName: 'Page Name',
    PageCode: 'Page Code',
    TargetCountry: 'Target Country',
    Language: 'Language',
    Deal: 'Deal',
    CreatedDate: 'Created Date',
    CreatedBy: 'Created By',
    LastModifiedDate: 'Last Modified Date',
    LastModifiedBy: 'Last Modified By',
    Status: 'Status',
    Action: 'Action'
}

export const defaultState = {
    isBlockAllTargetCountries: false,
    selectedLandingPage: { pageName: '', pageCode: '', blockTargetCountry: '' },
    targetCountryList: null,
    isClickedSubmit: false,
    isInsert: true,
    isShowMessage: false,
    isSuccess: true,
    message: ''
}