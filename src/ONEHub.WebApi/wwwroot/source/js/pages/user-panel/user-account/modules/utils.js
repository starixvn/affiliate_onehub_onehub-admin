import { contactAppTypes, contactAppRegex, contactAppPlaceholders } from './constants';

const DEFAULT_REGEX_VALUE = '^.*$';

export const getRegexByApp = (contactAppName) => {
    if (!contactAppName) {
        return DEFAULT_REGEX_VALUE;
    }
    return getValueDicByAppName(contactAppRegex, contactAppName);
};

export const getPlaceHolderByApp = (contactAppName) => {
    if (!contactAppName) {
        return '';
    }
    return getValueDicByAppName(contactAppPlaceholders, contactAppName);
};

const getValueDicByAppName = (dictionary, contactAppName, defaultValue = '') => {
    return dictionary[contactAppName] || defaultValue;
}; 