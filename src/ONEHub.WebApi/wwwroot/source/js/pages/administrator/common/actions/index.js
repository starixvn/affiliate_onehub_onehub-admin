import { post } from '../../../../modules/ajaxRequest';

export const getUserDetail = (selectedUserId) => async () => {
    const url = 'Portal/Administrator/GetUserDetail';
    const response = await post(url, { selectedUserId });

    return response && response.status === 200 ? response.data : null;
}

export const insertUser = (param) => async () => {
    const url = 'Portal/Administrator/InsertUser';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const insertExistedUser = (param) => async () => {
    const url = 'Portal/Administrator/InsertExistedUser';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateUser = (param) => async () => {
    const url = 'Portal/Administrator/UpdateUser';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateAccountPolicy = (param) => async () => {
    const url = 'Portal/Administrator/UpdateAccountPolicy';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const updateRolePolicy = (param) => async () => {
    const url = 'Portal/Department/UpdateRolePolicy';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}

export const getAccountPolicyList = (param) => async () => {
    const url = 'Portal/Administrator/GetAccountPolicyList';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;
    const checkedPolicies = data ? _convertCheckedAccountPolicy(data) : {};

    return { data: data ? data : [], checkedPolicies };
}

export const getRolePolicy = (param) => async () => {
    const url = 'Portal/Department/GetRolePolicy';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;
    const checkedPolicies = data ? _convertCheckedRolePolicy(data) : {};

    return { data: data ? data : [], checkedPolicies };
}

export const getPolicyListByAccountIds = (param) => async () => {
    const url = 'Portal/Administrator/GetPolicyListByAccountIds';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;
    const checkedPolicies = data ? _convertCheckedAccountPolicy(data) : {};

    return { data: data ? data : [], checkedPolicies };
}

export const fetchData = (param) => async () => {
    const url = 'Portal/Administrator/GetUserList';
    const response = await post(url, param);

    const data = response && response.status === 200 ? response.data : null;
    const checkedUsers = data ? _convertCheckedUsers(data) : {};

    return { data: data ? data : [], checkedUsers };
}

function _convertCheckedUsers(dataList) {
    const checkedUsers = {};
    for (let item of dataList) {
        const userId = `${item.UserId}`;
        checkedUsers[userId] = false;
    }

    return checkedUsers;
}

function _convertCheckedAccountPolicy(dataList) {
    const checkedPolicies = {};
    for (let item of dataList) {
        const itemId = item.FuncId;
        checkedPolicies[itemId] = {
            individualPermission: {
                HasRead: !!item.Policy,
                HasHost: item.Policy === 3
            },
            groupPermission: {
                HasRead: !!item.GPolicy,
                HasHost: item.GPolicy === 3
            }
        };
    }

    return checkedPolicies;
}

function _convertCheckedRolePolicy(dataList) {
    const checkedPolicies = {};
    for (let item of dataList) {
        const itemId = item.FuncId;
        checkedPolicies[itemId] = {
            individualPermission: {},
            groupPermission: {
                HasRead: !!item.Policy,
                HasHost: item.Policy === 3
            }
        };
    }

    return checkedPolicies;
}