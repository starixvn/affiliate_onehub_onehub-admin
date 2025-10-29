import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import { SET_CHECKED_LANDING_PAGES, SET_SELECTED_LANDING_PAGE_ID, SHOULD_RESET_SCROLL_POSITION, SET_GRID_DATA } from './types';

export { toggleLoader };

export const setSelectedLandingPageId = (data) => {
    return {
        type: SET_SELECTED_LANDING_PAGE_ID,
        data
    }
}

export const setCheckedLandingPages = (data) => {
    return {
        type: SET_CHECKED_LANDING_PAGES,
        data
    }
}

export const setShouldResetScrollPosition = (data) => {
    return {
        type: SHOULD_RESET_SCROLL_POSITION,
        data
    }
}

export const setGridData = (data) => {
    return {
        type: SET_GRID_DATA,
        data
    }
}

export const fetchData = () => async (dispatch) => {
    dispatch(toggleLoader(true));

    const url = 'Portal/LandingPageList/GetLandingPageList';
    const response = await post(url);

    const data = response && response.status === 200 ? response.data : null;
    const checkedLandingPages = data ? _convertCheckedLandingPages(data) : {};

    dispatch(setGridData(data ? data : []));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(setCheckedLandingPages(checkedLandingPages));
    dispatch(toggleLoader(false));
}

function _convertCheckedLandingPages(dataList) {
    const checkedLandingPages = {};
    for (let item of dataList) {
        if (!item.IsDefault && item.CanEdit) {
            const itemId = item.PageId;
            checkedLandingPages[itemId] = false;
        }
    }

    return checkedLandingPages;
}

export const getLandingPageDetail = (selectedLandingPageId) => async () => {
    const url = 'Portal/LandingPageList/GetLandingPageItem';
    const response = await post(url, { pageId: selectedLandingPageId });

    return response && response.status === 200 ? response.data : null;
}

export const getTargetCountryListByLandingPage = (param) => async () => {
    const url = 'Portal/LandingPageList/GetTargetCountryListByLandingPage';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const insertLandingPage = (param) => async () => {
    const url = 'Portal/LandingPageList/InsertLandingPage';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateLandingPage = (param) => async () => {
    const url = 'Portal/LandingPageList/UpdateLandingPage';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const deleteLandingPages = (landingPageIds) => async () => {
    const url = 'Portal/LandingPageList/DeleteLandingPage';
    const response = await post(url, { pageIds: landingPageIds });

    return response && response.status === 200 ? response.data : null;
}