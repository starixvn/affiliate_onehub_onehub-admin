import { playerBanner } from "../../common/libs/constants";

export const Casino = 'Casino';
export const Sportsbook = 'Sportsbook';

export const Asian = 2;
export const maxWidthHeight = 501;
export const maxLength = 50;
export const regSpecialCharacters = '[\\\\\/\:\*\?\"\<\>\|\#\%\&\+]';

export const headerText = {
    Index: '#',
    UserType: 'User Type',
    Images: 'Images',
    FileName: 'File Name',
    Category: 'Category',
    SubCategory: 'Sub Category',
    Language: 'Language',
    Currency: 'Currency',
    Size: 'Size',
    AffType: 'Affiliate Type',
    Device: 'Device'
}

export const messages = {
    PleaseSelect: 'Please select banner(s) to delete',
    AreYouSureDeleteItems: 'Are you sure to delete the selected banner(s)?',
    DeleteItemsSuccessfully: 'Delete banner(s) Successfully'
}

export const defaultState = {
    files: [],
    inputFileNames: [''],
    isInsert: true,
    isShowMessage: false,
    isSuccess: true,
    message: '',
    isDisabled: true,
    isDisableCurrency: false,
    messageNotificationPopup: '',
    userType: playerBanner
}