import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import * as types from './types';
import { getDomainList, getTargetCountryListByDomain } from '../../domain/actions/index';

export { toggleLoader, getTargetCountryListByDomain as getTargetCountryListByDomains };

export const setSelectedDomainId = (data) => {
    return {
        type: types.SET_SELECTED_DOMAIN_ID,
        data
    }
}

export const setSelectedTargetCountry = (data) => {
    return {
        type: types.SET_SELECTED_TARGET_COUNTRY,
        data
    }
}

export const setShouldResetScrollPosition = (data) => {
    return {
        type: types.SHOULD_RESET_SCROLL_POSITION,
        data
    }
}

export const setGridData = (data) => {
    return {
        type: types.SET_GRID_DATA,
        data
    }
}

export const setAffSubDomainList = (data) => {
    return {
        type: types.SET_AFF_SUB_DOMAIN_LIST,
        data
    }
}

export const fetchData = (targetCountryCode, affSubDomainList, shouldUpdateAffSubDomain) => async (dispatch) => {
    dispatch(toggleLoader(true));
    const selectedAffSubDomains = affSubDomainList.filter(a => a.checked);
    const isGetAll = selectedAffSubDomains.length == affSubDomainList.length;
    const subDomainRegex = selectedAffSubDomains.map(s => s.columnName).join('|');

    const url = 'Portal/DomainControl/GetDomainControlList';
    const response = await post(url, { targetCountryCode, isGetAll, subDomainRegex });

    const data = response && response.status === 200 ? response.data : [];

    dispatch(setGridData(data));
    dispatch(setShouldResetScrollPosition(true));

    if (shouldUpdateAffSubDomain) {
        await HandleUpdateAffSubDomainControlList(isGetAll, affSubDomainList, dispatch);
    }

    dispatch(toggleLoader(false));
}

export const getDomainControlById = (domainControlId) => async () => {
    const url = 'Portal/DomainControl/GetDomainControlById';
    const response = await post(url, { domainControlId });

    return response && response.status === 200 ? response.data : null;
}

export const fetchDomain = (targetCountryCode) => async () => {
    const affDomainList = await getDomainList(true);
    const redirectDomainList = await getDomainList(false);

    const availableAffDomainList = await getAvailableDomain(targetCountryCode, affDomainList);
    const availableRedirectDomainList = await getAvailableDomain(targetCountryCode, redirectDomainList);

    return { affDomainList: availableAffDomainList, redirectDomainList: availableRedirectDomainList };
}

const getAvailableDomain = async (targetCountryCode, domainList) => {
    if(!domainList?.length) return [];

    return domainList.filter(domain => !domain.BlockTargetCountryCode || !domain.BlockTargetCountryCode.includes(targetCountryCode));
}

export const insertDomain = (param) => async () => {
    const url = 'Portal/DomainControl/InsertDomainControl';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateDomain = (param) => async () => {
    const url = 'Portal/DomainControl/UpdateDomainControl';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const deleteDomain = (param) => async () => {
    const url = 'Portal/DomainControl/DeleteDomainControl';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

const HandleUpdateAffSubDomainControlList = async (isGetAll, affSubDomainList, dispatch) => {
    const url = 'Portal/DomainControl/GetSubAffDomainControlList';
    const response = await post(url);

    const data = response && response.status === 200 ? response.data : [];
    let shouldDispatch = false;

    const subDomainList = data.map(item => {
        var subDomain = affSubDomainList.find(a => a.columnKey == item);

        if (!subDomain) {
            shouldDispatch = true;

            return {
                columnKey: item,
                columnName: item,
                checked: isGetAll
            }
        }

        return subDomain;
    });

    shouldDispatch && dispatch(setAffSubDomainList(subDomainList));
}
