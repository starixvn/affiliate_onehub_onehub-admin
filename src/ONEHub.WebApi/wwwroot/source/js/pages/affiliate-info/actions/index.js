import * as types from './types';
import { setPagingOption } from '../../../actions/pagingAction';
import { setShowPopupPassword } from '../../common/actions/changePassword';

export { setPagingOption, setShowPopupPassword };

export const setReportTitle = (data) => {
    return {
        type: types.SET_REPORT_TITLE,
        data
    }
}

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setShowPopupCommGroup = (data) => {
    return {
        type: types.SET_SHOW_POPUP_COMMGROUP,
        data
    }
}

export const setAffId = (data) => {
    return {
        type: types.SET_AFFID,
        data
    }
}

export const setParentAffName = (data) => {
    return {
        type: types.SET_PARENT_AFF_NAME,
        data
    }
}

export const setCommGroup = (data) => {
    return {
        type: types.SET_COMM_GROUP,
        data
    }
}

export const setCommGroupList = (data) => {
    return {
        type: types.SET_COMM_GROUP_LIST,
        data
    }
}

export const setSelectedColumn = (data) => {
    return {
        type: types.SET_SELECTED_COLUMN,
        data
    }
}