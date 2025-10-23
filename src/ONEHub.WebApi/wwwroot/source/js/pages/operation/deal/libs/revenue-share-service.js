import { deductionNameList, messages, money, INFINITY_QM, regExp, regexValidNegativeAmount, revenueTierSettingDefault } from './revenue-share-constants';

const emptyRevenueShare = {
    QmTurnover: 100,
    IsActivePlayerSum: true,
    RevenueTierSetting: [{ ...revenueTierSettingDefault }],
    PlatformFeeSetting: [],
    DepositFeeSetting: {},
    WithdrawalFeeSetting: {}
}

export const buildDefaultRevenueShare = (deductionList, productList) => {
    const deductionSetting = getDeductionSetting(deductionList);
    const { platformFeeSetting } = deductionSetting;
    const platformFeeList = buildProductGroupsDeductionFeeList(productList, platformFeeSetting);

    const depositFee = createDefaultDepositSetting(deductionSetting.depositFeeSetting);
    const withdrawalFee = createDefaultWithdrawalSetting(deductionSetting.withdrawalFeeSetting);

    return Object.assign({}, emptyRevenueShare, {
        PlatformFeeSetting: platformFeeList,
        DepositFeeSetting: depositFee,
        WithdrawalFeeSetting: withdrawalFee
    });
}

export const getDeductionSetting = (deductionList) => {
    const deductionObj = convertDeductionList(deductionList);
    const platformFeeSetting = deductionObj[deductionNameList.platformFee];
    const depositFeeSetting = deductionObj[deductionNameList.depositFee];
    const withdrawalFeeSetting = deductionObj[deductionNameList.withdrawalFee];

    return {
        platformFeeSetting,
        depositFeeSetting,
        withdrawalFeeSetting
    }
}

export const createDefaultDepositSetting = (depositFeeSetting) => {
    return {
        DeductionId: depositFeeSetting.DeductionId,
        ProductIds: 0,
        DeductedPercentage: depositFeeSetting.DeductedPercentage,
        DeductedAmount: depositFeeSetting.DeductedAmount,
        IsDeductedPercent: depositFeeSetting.IsDeductedPercent
    }
}

export const createDefaultWithdrawalSetting = (withdrawalFeeSetting) => {
    return {
        DeductionId: withdrawalFeeSetting.DeductionId,
        ProductIds: 0,
        DeductedPercentage: withdrawalFeeSetting.DeductedPercentage,
        DeductedAmount: withdrawalFeeSetting.DeductedAmount,
        IsDeductedPercent: withdrawalFeeSetting.IsDeductedPercent
    }
}

export const buildProductGroupsDeductionFeeList = (platformFeeProductList, feeSetting) => {
    const products = convertProductList(platformFeeProductList);
    return [{
        GroupProductId: 1,
        DeductionId: feeSetting.DeductionId,
        ProductIds: products.map(p => p.ProductId).join(','),
        DeductedPercentage: feeSetting.DeductedPercentage,
        DeductedAmount: feeSetting.DeductedAmount,
        IsDeductedPercent: feeSetting.IsDeductedPercent
    }];
}

export const createDefaultProductGroupsDeductionFee = (productList, feeSetting) => {
    return {
        deductionId: feeSetting.DeductionId,
        productList: convertProductList(productList),
        deductedPercentage: feeSetting.DeductedPercentage
    };
}

export const convertDeductionList = (deductionList) => {
    const deductions = {};
    for (let item of deductionList) {
        deductions[item.DeductionName] = item;
    }

    return deductions;
}

export const convertProductList = (productList, productIds = '') => {
    const idList = productIds.split(',').filter(p => !!p);
    const isCheckAll = idList.length === productList.length;

    return productList.map(item => {
        return {
            ProductId: item.ProductId,
            ProductName: item.ProductName,
            Checked: isCheckAll || idList.filter(i => Number(i) === item.ProductId).length > 0
        }
    })
}

export const convertStringToArrayNumber = (stringIds) => {
    return stringIds.split(',').filter(id => !!id).map(i => Number(i));
}

export const validateRevenueShareInfo = (dealInfo) => {
    const { RevenueTierSetting, PlatformFeeSetting, DepositFeeSetting, WithdrawalFeeSetting } = dealInfo;

    const tierSettingValidation = validateTierSettingList(RevenueTierSetting);
    const selectedProductValidation = validateItemMustHaveAProduct(PlatformFeeSetting);
    const depositFeeValidation = validateDeductedFees(DepositFeeSetting, messages.requireDepositAmount, messages.invalidDepositAmount);
    const withdrawalFeeValidation = validateDeductedFees(WithdrawalFeeSetting, messages.requireWithdrawalAmount, messages.invalidWithdrawalAmount);

    const isValid = tierSettingValidation.isValid && selectedProductValidation.isValid
        && depositFeeValidation.isValid && withdrawalFeeValidation.isValid;
    const messageList = [...tierSettingValidation.messageList, ...selectedProductValidation.messageList,
    ...depositFeeValidation.messageList, ...withdrawalFeeValidation.messageList
    ];

    return { isValid, messageList };
}

export const validateDeductedFees = (deductedFee, requiredMessage, invalidMessage) => {
    let isValid = true;
    const messageList = [];

    if (!deductedFee.IsDeductedPercent) {
        let deductionAmount = deductedFee.DeductedAmount && deductedFee.DeductedAmount.replace(/,/g, '');
        if (!deductionAmount) {
            isValid = false;
            messageList.push(requiredMessage);
        } else {
            const regexValidAmount = new RegExp(regExp.validAmount);
            if (!regexValidAmount.test(deductionAmount)) {
                isValid = false;
                messageList.push(invalidMessage);
            }
        }
    }

    return { isValid, messageList };
}

export const validateGroupName = (groupName) => {
    let isValid = true;
    const messageList = [];

    if (!groupName) {
        isValid = false;
        messageList.push(messages.requireGroupName);
    }

    return { isValid, messageList };
}

export const validateTierSettingList = (tierSettingList) => {
    let isValid = true;
    const messageList = [];

    const tierSettingListByGroupProduct = handleGroupBy(tierSettingList, "GroupProductId");

    Object.values(tierSettingListByGroupProduct).forEach((tierSettings, i) => {
        const groupProductName = `Product Group ${i + 1}`;

        if (tierSettings.length === 0) {
            isValid = false;
            messageList.push(`${groupProductName} - ${messages.requireTier}`);
        } else {
            const firstMinAmount = tierSettings[0].MinAmount;

            if (!regexValidNegativeAmount.test(firstMinAmount) && Number(firstMinAmount) != 0 && Number(firstMinAmount) != money.AllowedMinValue) {
                isValid = false;
                messageList.push(`${groupProductName} - ${messages.minNetWinFirstMustBeZero}`);
            } else if (isMinNetWinNotStartFromOneAfterNegative(tierSettings)) {
                isValid = false;
                messageList.push(`${groupProductName} - ${messages.minNetWinMustStartFromOne}`);
            } else if (isMinNetWinNotIncreaseSequentially(tierSettings)) {
                isValid = false;
                messageList.push(`${groupProductName} - ${messages.minNetWinMustIncreaseSequentially}`);
            } else if (tierSettings.filter(item => item.MinAmount < money.AllowedMinValue).length > 0) {
                isValid = false;
                messageList.push(`${groupProductName} - ${messages.minNetWinGreaterThanNegativeInfinity}`);
            } else if (tierSettings.filter(item => item.MinAmount > money.AllowedMaxValue).length > 0) {
                isValid = false;
                messageList.push(`${groupProductName} - ${messages.minNetWinLesserThanInfinity}`);
            }

            if (tierSettings.filter(item => item.MinQm > INFINITY_QM).length > 0) {
                isValid = false;
                messageList.push(`${groupProductName} - ${messages.qmConstrain}`);
            }
        }
    });

    return { isValid, messageList };
}

export const validateItemMustHaveAProduct = (platformFeeList) => {
    let isValid = true;

    if (platformFeeList.length > 1 && platformFeeList.filter(item => !item.ProductIds).length > 0) {
        isValid = false;
    }

    return { isValid, messageList: isValid ? [] : [messages.requireSelectedProduct] };
}

export const removeTierItem = (tierId, groupProductId, dataList) => {
    return dataList.filter(item => !(item.TierId === tierId && item.GroupProductId === groupProductId));
}

const isMinNetWinNotIncreaseSequentially = (tierSettingList) => {
    return tierSettingList.some((tier, i) => i != 0 && Number(tier.MinAmount) <= Number(tierSettingList[i - 1].MinAmount));
}

const isMinNetWinNotStartFromOneAfterNegative = (tierSettingList) => {
    return tierSettingList.some((tier, i) => {
        const minAmount = Number(tier.MinAmount);

        return i != 0 && Number(tierSettingList[i - 1].MinAmount) < 0 && (minAmount == 0 || minAmount > 1);
    });
}

const handleGroupBy = (items, key) => {
    return items.reduce(function (result, item) {
        (result[item[key]] ??= []).push(item);
        return result;
    }, {});
};