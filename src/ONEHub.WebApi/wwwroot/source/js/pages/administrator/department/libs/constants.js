import { globalResource } from '../../../../modules/globalResource';

export { globalResource };

export const headerText = {
    Index: '#',
    Department: 'Department',
    NoOfUser: 'No of User',
    Description: 'Description',
    RolePolicy: 'Role Policy',
    Edit: globalResource.Edit,
    Delete: globalResource.Delete
}

export const defaultState = {
    departmentName: '',
    description: '',
    isInsert: true,
    isShowMessage: false,
    isSuccess: true,
    message: ''
}

export const charCodes = {
    KeyEnter: 13,
    KeyDoubleQuotationMark: 34,
    KeySingleQuotationMark: 39
}