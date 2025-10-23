export const convertCheckedPolicies = (checkedPolicies, selectedId, isAccountPolicy, isGetByIdList) => {
    if (isGetByIdList) {
        const isList = selectedId.split(',');
        return isList.reduce((accumulator, id) => {
            return accumulator = accumulator + getStringConvertCheckedPolicies(checkedPolicies, id, isAccountPolicy);
        }, '');
    }

    return getStringConvertCheckedPolicies(checkedPolicies, selectedId, isAccountPolicy);
}

const getStringConvertCheckedPolicies = (checkedPolicies, selectedId, isAccountPolicy) => {
    return Object.keys(checkedPolicies).reduce((accumulator, key) => {
        const policy = `${selectedId},${key}`;
        const item = checkedPolicies[key];
        const permission = isAccountPolicy ? item.individualPermission : item.groupPermission;

        if (permission.HasHost && permission.HasRead) {
            return accumulator = accumulator + policy + ',3;';
        }
        if (permission.HasHost) {
            return accumulator = accumulator + policy + ',2;';
        }
        if (permission.HasRead) {
            return accumulator = accumulator + policy + ',1;';
        }

        return accumulator = accumulator + policy + ',0;';
    }, '');
}

export const validateUserName = (userName) => {
    const regexCheckSpecialChar = new RegExp("^[a-zA-Z0-9]{1,20}$");

    return regexCheckSpecialChar.test(userName);
}