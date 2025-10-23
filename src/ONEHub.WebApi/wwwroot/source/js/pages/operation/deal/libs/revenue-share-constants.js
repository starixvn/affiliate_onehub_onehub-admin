import { formatDecimal, format } from "../../../../modules/numberFormat";
import { globalResource } from '../../../../modules/globalResource';
import { money } from '../../../../modules/constants';

export { globalResource, formatDecimal, format, money };

export const INFINITY_AM = money.AllowedMaxValue;
export const INFINITY_QM = 1000000000;
export const NEGATIVE_INFINITY_SYMBOL = '-∞';
export const FIRST_ITEM_INDEX = 0;
export const ONLY_ONE_ITEM = 1;
export const MAX_PERCENTAGE = 1;

function generateCommissionValues(maxValue = 100) {
    let min = 0, max = maxValue;

    const commissionList = { 0.0: '0.0%' };

    while (min < max) {
        min = (min * 100 + 0.1 * 100) / 100;
        commissionList[format(min / 100, 3)] = format(min, 1) + "%";
    }

    return commissionList;
}

const _commValueList = generateCommissionValues();

export const commissionValueList = _commValueList;

export const firstMinNetWinValueList = {
    "0": "0",
    [NEGATIVE_INFINITY_SYMBOL]: NEGATIVE_INFINITY_SYMBOL
}

export const GGR = '| Gross Game Revenue |';

export const MinNetWin = 'Min Net Win';

export const messages = {
    requireGroupName: 'Group Name cannot be empty. Please check!',
    requireOperationalAmount: 'Operational Fee cannot be empty. Please check!',
    invalidOperationalAmount: 'Operational Fee is invalid.',
    requireDepositAmount: 'Deposit Fee cannot be empty. Please check!',
    invalidDepositAmount: 'Deposit Fee is invalid.',
    requireWithdrawalAmount: 'Withdrawal Fee cannot be empty. Please check!',
    invalidWithdrawalAmount: 'Withdrawal Fee is invalid.',
    requireTier: 'Tier Setting must have at least 1 tier',
    minNetWinFirstMustBeZero: 'The first Tier of the Min Net Win column must be = 0 or -∞',
    minNetWinMustStartFromOne: 'The next Tier after a negative Tier must start from 1 in the Min Net Win column.',
    minNetWinMustIncreaseSequentially: 'The values in the Min Net Win column must increase sequentially.',
    minNetWinGreaterThanNegativeInfinity: 'Min Net Win must be greater than or equal to -100,000,000,000',
    minNetWinLesserThanInfinity: 'Min Net Win must be lesser than or equal to 100,000,000,000',
    requireInfinity: 'Last Tier Setting must have maximum value=∞',
    qmConstrain: 'Min Qualified Player must be lesser than or equal to 1,000,000,000',
    requireSelectedProduct: 'At least 1 product must be selected per group',
    confirmChangeGroup: 'Are you sure you want to change the Revenue Group for affiliate: {0}',
    choseAnotherGroup: 'Please choose another group (not old group)!',
    assignGroupSuccessfully: 'Assign affiliate to Revenue Group successfully',
    addGroupSuccessfully: 'Add Revenue Group Successfully',
    updateGroupSuccessfully: 'Update Revenue Group Successfully',
    note: "Note: Change will take effect on current month (GMT-4)."
}

const _deductionNameList = {
    platformFee: 'Platform Fee',
    depositFee: 'Deposit Fee',
    withdrawalFee: 'Withdrawal Fee'
}
export const deductionNameList = _deductionNameList;

export const regExp = {
    checkAmount: "^(\\d+\\.?\\d*)?$",
    shouldFormatAmount: "^\\d+$",
    validAmount: "^\\d+(\\.\\d{1,})?$",
    acceptNegativeAmountFormat: "^\\-?\\d*$",
    validNegativeAmount: "^\\-?\\d+$"
}

export const regexAcceptNegativeAmountFormat = new RegExp(regExp.acceptNegativeAmountFormat);
export const regexValidNegativeAmount = new RegExp(regExp.validNegativeAmount);

export const revenueTierSettingDefault = {
    TierId: 1,
    GroupProductId: 1,
    MinAmount: 0,
    MinQm: 5,
    Commission: 0,
}