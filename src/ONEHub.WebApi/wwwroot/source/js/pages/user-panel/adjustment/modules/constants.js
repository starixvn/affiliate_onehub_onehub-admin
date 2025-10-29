import { money } from '../../../../modules/constants';
import { userPanelMenuKey } from '../../../customer/common/modules/constants';

export { userPanelMenuKey, money }

export const resource = {
    BalanceBf: 'Balance Brought Forward',
    Amount: 'Amount',
    Description: 'Description',
    Submit: 'Submit',
}

export const message = {
    Required: 'The amount is required',
    Invalid: 'The amount is invalid',
    Success: 'Updated successfully!'
}

export const regExp = {
    checkAmount: "^\\-?(\\d+\\.?\\d*)?$",
    shouldFormatAmount: "^\\-?\\d+$",
    validAmount: "^\\-?\\d+(\\.\\d{1,})?$"
}