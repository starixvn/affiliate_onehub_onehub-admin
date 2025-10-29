import {
    messageList,
    regexEmail,
    countriesList,
    requiredFieldList,
    requiredBankTranferList,
    playerMethod,
    moneybookersMethod,
    wireMethod,
    contactAppTypes
} from './constants'
import { getRegexByApp } from './utils'

const getMessage = (fieldName, value) => {
    return value === '' ? messageList[fieldName] + "<br />" : '';
}

const getMessageIfEmpty = (fieldName, value) => {
    return !value ? messageList[fieldName] + "<br />" : '';
}

export const validateUserAccount = (userAccountInfo, moreSiteUrlsList, licenseeName) => {
    let message = '';
    const selectedField = userAccountInfo.HasWebSite ? 'SiteUrl' : `NoSiteDesc`;
    message += validateEmail(userAccountInfo);
    message += validateGender(userAccountInfo);
    message += validateCountry(userAccountInfo);
    message += validateRequiredField(userAccountInfo, licenseeName);
    message += validateWebsite(userAccountInfo, selectedField, licenseeName);

    if (userAccountInfo.HasWebSite) {
        message += validateEmptyUrl(moreSiteUrlsList);
    }

    message += validateAppContactList(userAccountInfo.ContactAppList, userAccountInfo.IsMarketingAccount);
    message += validatePaymentMethods(userAccountInfo);

    return {
        message: message,
        isValid: message === ''
    };
}

const validateEmail = (userAccountInfo) => {
    const checkEmail = new RegExp(regexEmail);
    const isValidEmail = !userAccountInfo.HasHostAffPersonalInfoPermission || checkEmail.test(userAccountInfo.Email);
    return isValidEmail ? "" : messageList.Email + "<br />";
}

const validateGender = (userAccountInfo) => {
    const isValidGender = userAccountInfo.Gender != null;
    return isValidGender ? "" : messageList.Gender + "<br />";
}

const validateCountry = (userAccountInfo) => {
    const country = countriesList[userAccountInfo.Country] === undefined ? "" : userAccountInfo.Country;
    return getMessage('Country', country);
}

const validateRequiredField = (userAccountInfo) => {
    if(userAccountInfo.IsMarketingAccount) {
        return ""
    }

    return requiredFieldList.reduce((accumulator, field) => { 
        return accumulator + getMessageIfEmpty(field, userAccountInfo[field])
     }, '');
}

const validateWebsite = (userAccountInfo, selectedField, licenseeName) => {
    if(userAccountInfo.IsMarketingAccount) {
        return ""
    }
    
    if(!userAccountInfo[selectedField]){
        return getMessageIfEmpty(userAccountInfo.HasWebSite ? selectedField : selectedField + licenseeName, userAccountInfo[selectedField])
    }

    return ""
}

const validatePaymentMethods = (userAccountInfo) => {
    let message = '';

    if(userAccountInfo.IsMarketingAccount) {
        return ""
    }

    switch (userAccountInfo.PreferredPayment) {
        case playerMethod:
            message = getMessageIfEmpty('PlayerUsername', userAccountInfo.PlayerUsername);
            break;
        case moneybookersMethod:
            message = getMessageIfEmpty('MoneybookersEmail', userAccountInfo.MoneybookersEmail);
            break;
        case wireMethod:
            message = requiredBankTranferList.reduce((accumulator, field) => accumulator + getMessageIfEmpty(field, userAccountInfo[field]), '');
            break;
    }

    return message;
}

const validateEmptyUrl = (moreSiteUrlsList) => {
    const isExistEmptyUrl = moreSiteUrlsList.some(siteUrl => siteUrl.trim() === '');
    const emptySiteUrlIndex = moreSiteUrlsList.indexOf('');

    return isExistEmptyUrl ? `Website URL ${emptySiteUrlIndex + 2} is required<br />` : '';
}

const getAppMessage = (appName, suffixMsg) => {
    const name = appName == contactAppTypes.Skype ? contactAppTypes.Teams : appName;

    return `${name} ${suffixMsg}`;
}


const validateContactValue = (contactApp) => {
    const MAX_LENGTH = 50;
    let message = '';
    let isValid = true;

    if (contactApp.Value.length > MAX_LENGTH) {
        message = getAppMessage(contactApp.Name, "no more than 50 characters<br />");
        isValid = false;
    }

    if ((contactApp.Name === contactAppTypes.Telegram || 
         contactApp.Name === contactAppTypes.Line || 
         contactApp.Name === contactAppTypes.WhatsApp) && 
        !new RegExp(getRegexByApp(contactApp.Name)).test(contactApp.Value)) {
        message = getAppMessage(contactApp.Name, "is invalid<br />");
        isValid = false;
    }

    return {
        message,
        isValid
    };
}

export const validateAppContactList = (contactAppList, isMarketingAccount) => {
    let message = '';

    if(isMarketingAccount) {
        return ""
    }

    if (!contactAppList || contactAppList.length === 0) {
        message = 'At least one IM account is required<br />';
    }

    const firstItem = contactAppList[0];
    if (!firstItem.Value) {
        message = getAppMessage(firstItem.Name, "is required<br />");
    } else {
        const firstItemValidation = validateContactValue(firstItem);
        if (!firstItemValidation.isValid) {
            message += firstItemValidation.message;
        }
    }

    for (let i = 1; i < contactAppList.length; i++) {
        const contactApp = contactAppList[i];
        if (contactApp.Value) {
            const validationResult = validateContactValue(contactApp);
            if (!validationResult.isValid) {
                message += validationResult.message;
            }
        }
    }

    return message
}
