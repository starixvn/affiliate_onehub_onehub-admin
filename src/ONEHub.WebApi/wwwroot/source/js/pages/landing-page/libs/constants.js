import { resolveClientUrl } from "../../../modules/utils";
import { globalResource } from "../../../modules/globalResource";
import { defaultInsertId } from "../../../modules/constants";

export { globalResource, defaultInsertId };

export const menuKey = {
    pageManagement: 'pageManagement',
    pageBuilder: 'pageBuilder',
    assetUploader: 'assetUploader',
    formManagement: 'formManagement',
}

export const relativePath = {
    pageManagement: '/portal/landingpage',
    pageBuilder: '/portal/pagebuilder',
    assetUploader: '/portal/assetuploader',
    formManagement: '/portal/formmanagement',
}

export const maxWidthHeight = 501;
export const maxLength = 50;
export const regSpecialCharacters = '[\\\\\/\:\*\?\"\<\>\|\#\%\&\+]';

export const fileUpload = {
    AllowedImageExtensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    MaximumFiles: 50,
    MaxFileSize: 3
}

export const assetStatus = {
    all: -1,
    active: 1,
    inactive: 2
};

export const landingPageStatus = {
    draft: 0,
    active: 1,
    inactive: 2,
};

export const moduleTypes = {
    Image: 1,
    Contact: 2,
    Form: 3,
    Link: 4,
    Login: 5
};

export const defaultModuleIds = {
    Background: 1,
    LogoSponsorship: 2,
    LogoSponsorshipRegiser: 3,
    HeroImage: 4,
    CtaButton: 5,
    PromoList: 6,
    FavoriteGames: 7,
    Youtube: 8,
    RegistrationForm: 9,
    PaymentMethod: 10,
    Provider: 11,
    ContactUs: 12,
    LicenseAwards: 13,
    LoginBtn: 14
};

export const messageSwitchLandingPageStatus = {
    SwitchStatusSuccessfully: 'Status changed successfully',
    AreYouSureSwitchStatus: `Only Active landing pages are available for link generation, while Draft and Inactive pages are not.<br />
    Existing links with an Inactive page will redirect users to the main join page.<br />
    Are you sure you want to change status of this landing page?`,
    FailedToSwitchStatus: 'Failed to change status'
}