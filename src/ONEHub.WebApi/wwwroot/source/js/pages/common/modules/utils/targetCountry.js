import { targetCountryStatus } from '../../../../modules/constants';

export const getBlockTargetCountryList = (targetCountryList) => {
    return targetCountryList.filter(m => m.Status === targetCountryStatus.Blocked).map(m => m.TargetCountryCode);
}

export const checkBlockAllTargetCountries = (targetCountryList, blockTargetCountryList) => {
    return blockTargetCountryList.length !== 0 && blockTargetCountryList.length === targetCountryList.length;
}

export const _handleInitialTargetCountryList = (targetCountryList, selectedTargetCountries = '') => {
    const selectedTargetCountriesArray = selectedTargetCountries.split(',').filter(p => !!p);

    return targetCountryList && targetCountryList.map(item => {
        return {
            key: item.TargetCountryCode,
            name: item.TargetCountryName,
            checked: selectedTargetCountriesArray.includes(item.TargetCountryCode.toString())
        }
    })
}