import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Form, FormGroup, Label } from 'reactstrap';

import { setDealInfo } from '../../../../actions';

import PlatformFeeItem from "./PlatformFeeItem";
import { deepClone, updateObjectInArray } from "../../../../../../../modules/dataHandler";
import { FIRST_ITEM_INDEX, ONLY_ONE_ITEM, revenueTierSettingDefault } from '../../../../libs/revenue-share-constants';
import { convertProductList, createDefaultProductGroupsDeductionFee, getDeductionSetting } from '../../../../libs/revenue-share-service';

export class PlatformFeeSetting extends PureComponent {
    constructor(props) {
        super(props);

        const { deductionList, productList } = this.props;
        const deductionSetting = getDeductionSetting(deductionList);
        const defaultPlatformSetting = createDefaultProductGroupsDeductionFee(productList, deductionSetting.platformFeeSetting);

        this.defaultPlatformItem = this.createDefaultProductGroupsDeductionFeeItem(defaultPlatformSetting);
    }

    createDefaultProductGroupsDeductionFeeItem = (settings) => {
        return {
            DeductionId: settings.deductionId,
            ProductIds: '',
            DeductedPercentage: settings.deductedPercentage
        }
    }

    handleAdd = () => {
        const { PlatformFeeSetting, RevenueTierSetting } = this.props.dealInfo;
        const lastPlatformFee = PlatformFeeSetting.slice(-1)[0];
        const groupProductId = lastPlatformFee.GroupProductId + 1;

        const platformFeeSetting = [...PlatformFeeSetting, { ...this.defaultPlatformItem, GroupProductId: groupProductId }];
        const tierSettingList = [...RevenueTierSetting, { ...revenueTierSettingDefault, GroupProductId: groupProductId }];

        this.props.setDealInfo({ PlatformFeeSetting: platformFeeSetting, RevenueTierSetting: tierSettingList });
    }

    handleRemove = (index) => {
        const { PlatformFeeSetting, RevenueTierSetting } = this.props.dealInfo;

        const platformFeeSetting = deepClone(PlatformFeeSetting);
        const tierSettingList = deepClone(RevenueTierSetting);

        const rootProductIds = platformFeeSetting[0].ProductIds.split(',').filter(p => !!p);

        const platformFeeRemoved = platformFeeSetting[index];
        const checkedProductIds = platformFeeRemoved.ProductIds.split(',').filter(p => !!p);

        for (let productId of checkedProductIds) {
            rootProductIds.push(productId);
        }

        platformFeeSetting[0].ProductIds = rootProductIds.join(',');

        platformFeeSetting.splice(index, 1);

        const groupIdRemoved = platformFeeRemoved.GroupProductId;
        this.props.setDealInfo({ PlatformFeeSetting: platformFeeSetting, RevenueTierSetting: tierSettingList.filter(t => t.GroupProductId != groupIdRemoved) });
    }

    handleSelect = (index, selectedItem) => {
        const { PlatformFeeSetting } = this.props.dealInfo;
        const isChecked = selectedItem.Checked;

        const platformFeeSetting = deepClone(PlatformFeeSetting);

        const settingCount = platformFeeSetting.length;
        if (settingCount > 1) {
            if (isChecked) {
                const currentProductIds = platformFeeSetting[index].ProductIds.split(',').filter(p => !!p);

                currentProductIds.push(selectedItem.ProductId.toString());

                platformFeeSetting[index].ProductIds = currentProductIds.join(',');

                for (let i = 0; i < settingCount; i++) {
                    if (i !== index) {
                        platformFeeSetting[i].ProductIds = platformFeeSetting[i].ProductIds.split(',')
                            .filter(p => p && p !== selectedItem.ProductId.toString())
                            .join(',');
                    }
                }
            }
            else if (index != FIRST_ITEM_INDEX) {
                platformFeeSetting[index].ProductIds = platformFeeSetting[index].ProductIds.split(',')
                    .filter(p => p && p !== selectedItem.ProductId.toString())
                    .join(',');

                const firstItemProductIds = platformFeeSetting[0].ProductIds.split(',').filter(p => !!p);
                firstItemProductIds.push(selectedItem.ProductId.toString());

                platformFeeSetting[0].ProductIds = firstItemProductIds.join(',');
            }
        }

        this.props.setDealInfo({ PlatformFeeSetting: platformFeeSetting });
    }

    handleChangeCommission = (index, value, propName) => {
        const feeListOld = this.props.dealInfo[propName];
        const newCommissionSetting = Object.assign({}, feeListOld[index], value);

        const feeListNew = updateObjectInArray(feeListOld, index, newCommissionSetting);

        this.props.setDealInfo({ [propName]: feeListNew });
    }

    handleCheck = (isActivePlayerSum) => {
        this.props.setDealInfo({ IsActivePlayerSum: isActivePlayerSum });
    }

    handleProductGroupsDeductionData(selectProducts) {
        const { PlatformFeeSetting } = this.props.dealInfo;

        const productGroupsDeductionData = PlatformFeeSetting.map((platformFee, index) => {
            return {
                productList: convertProductList(selectProducts, platformFee.ProductIds),
                royaltyFee: platformFee.DeductedPercentage,
                groupProductId: platformFee.GroupProductId
            }
        });

        return productGroupsDeductionData;
    }

    render() {
        const { productList, dealInfo } = this.props;
        const { IsActivePlayerSum } = dealInfo;

        const productGroupsDeductionData = this.handleProductGroupsDeductionData(productList);
        const isOnlyOnePlatformFeeRow = productGroupsDeductionData.length === ONLY_ONE_ITEM;

        return (
            <div className="tier-setting-group">
                <div className="d-flex">
                    <p className="font-weight-bold mr-5">Product Groups</p>
                    <Form inline>
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" name="IsActivePlayerSum" checked={IsActivePlayerSum}
                                    onChange={() => this.handleCheck(!IsActivePlayerSum)} />Count Qualified Player across all products(exclude Free Bet)
                            </Label>
                        </FormGroup>
                    </Form>
                </div>
                {
                    productGroupsDeductionData.map((item, i) => {
                        const isFirst = i === FIRST_ITEM_INDEX;
                        const handleClick = isFirst ? this.handleAdd : () => this.handleRemove(i);

                        return (
                            <PlatformFeeItem data={item} key={`platformfee-${i}`}
                                isOnlyOnePlatformFeeRow={isOnlyOnePlatformFeeRow}
                                onSelectProduct={(selectedItem) => this.handleSelect(i, selectedItem)}
                                onChangeCommission={(value, propName) => this.handleChangeCommission(i, value, propName)}
                                handleClick={handleClick}
                                isFirst={isFirst}
                                index={i + 1} />
                        )
                    })
                }
            </div>
        )
    }
}

function mapStateToProp({ deductionList, productList, dealInfo }) {
    return { deductionList, productList, dealInfo };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setDealInfo }, dispatch);
}

export default connect(mapStateToProp, mapDispatchToProps)(PlatformFeeSetting);