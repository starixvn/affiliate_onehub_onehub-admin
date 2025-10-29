import { globalResource } from '../../../../modules/globalResource';
import { defaultModuleIds } from '../../libs/constants';

export { globalResource };

export const restrictedCharactersPattern = /[;\/\?:@=&"<>#%{}\|\\^~\[\]`\s+]/;

export const pageBuilderLabels = {
    campaignName: 'Campaign Name',
    targetCountry: 'Target Country',
    language: 'Language',
    deal: 'Deal',
    pageName: 'Page Name',
    pageCode: 'Page Code',
    status: 'Status',
    moduleComponents: 'Module Components',
    orderId: 'Order',
    module: 'Module',
    source: 'Source',
    preview: 'Preview',
    create: 'Create',
    update: 'Update',
    reset: 'Reset',
    copyLink: 'Copy Link',
    add: 'Add +',
    remove: 'Remove'
};

export const pageBuilderDefaultState = {
    formData: {
        pageId: 0,
        campaignId: null,
        targetCountryCode: '',
        languageCode: '',
        dealIds: [],
        pageName: '',
        pageCode: '',
        status: 0
    },
    moduleComponentsSetting: [
        {
            id: 1,
            orderId: 1,
            moduleId: defaultModuleIds.Background,
            mediaId: null
        }
    ],
    validation: {
        errors: {},
        isValid: false,
        isValidating: false
    },
    ui: {
        isPreviewOpen: false,
        isCopyLinkOpen: false,
        isLoading: false,
        nextModuleOrder: 2,
        hasPreviewedOrCreated: false,
        previewUrl: null
    }
};

export const validationMessages = {
    campaignRequired: 'Campaign Name is required.',
    pageNameRequired: 'Page Name is required.',
    pageNameExists: 'Page Name already exists. Please enter a different name.',
    pageNameInvalid: 'Page name must not exceed 50 characters.',
    pageCodeRequired: 'Page Code is required.',
    pageCodeExists: 'Page Code already exists. Please enter a different code.',
    pageCodeInvalid: 'Page code must not exceed 50 characters, without spaces or special characters.',
    moduleRequired: 'Module is required.',
    sourceRequired: 'Source is required',
    atLeastOneModule: 'At least one module component is required.',
    youtubeRequired: 'YouTube URL is required.',
    contactUsRequired: 'Contact link is required.',
    loginBtnRequired: 'Login endpoint is required.',
    atLeastOneDeal: 'Please select at least a deal.'
};

export const pageCodePattern = /^[a-zA-Z0-9-_]+$/;