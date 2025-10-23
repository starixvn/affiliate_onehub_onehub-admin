import { post } from '../../../../modules/ajaxRequest';
import { toggleLoader } from '../../../../actions/loaderAction';
import { SET_SELECTED_DEPARTMENT_ID, SET_OPEN_INSERT_UPDATE_POPUP, SHOULD_RESET_SCROLL_POSITION, SET_GRID_DATA } from './types';

export { toggleLoader };

export const setSelectedDepartmentId = (data) => {
    return {
        type: SET_SELECTED_DEPARTMENT_ID,
        data
    }
}

export const setOpenInsertUpdatePopup = (data) => {
    return {
        type: SET_OPEN_INSERT_UPDATE_POPUP,
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

export const getDepartmentList = () => async () => {
    const url = 'Portal/Department/GetDepartmentList';
    const response = await post(url);

    return response && response.status === 200 ? response.data : [];
}

export const fetchData = () => async (dispatch) => {
    dispatch(toggleLoader(true));

    const data = await getDepartmentList()();

    dispatch(setGridData(data));
    dispatch(setShouldResetScrollPosition(true));
    dispatch(toggleLoader(false));
}

export const getDepartmentDetail = (selectedDepartmentId) => async () => {
    const url = 'Portal/Department/GetDepartmentDetail';
    const response = await post(url, { selectedDepartmentId });

    return response && response.status === 200 ? response.data : null;
}

export const insertDepartment = (param) => async () => {
    const url = 'Portal/Department/InsertDepartment';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateDepartment = (param) => async () => {
    const url = 'Portal/Department/UpdateDepartment';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const deleteDepartment = (param) => async () => {
    const url = 'Portal/Department/DeleteDepartment';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}