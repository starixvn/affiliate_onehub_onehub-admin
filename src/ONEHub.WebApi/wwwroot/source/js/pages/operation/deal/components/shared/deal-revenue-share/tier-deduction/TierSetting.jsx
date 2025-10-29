import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Col, FormGroup } from 'reactstrap';
import { bindActionCreators } from 'redux';

import { setDealInfo } from '../../../../actions';

import TierSettingItem from './TierSettingItem';
import { removeTierItem } from '../../../../libs/revenue-share-service';
import { isValidNumber } from '../../../../../../../modules/utils';
import { FIRST_ITEM_INDEX, MinNetWin, regexAcceptNegativeAmountFormat, revenueTierSettingDefault, MAX_PERCENTAGE } from '../../../../libs/revenue-share-constants';

export class TierSetting extends PureComponent {
    constructor(props) {
        super(props);
    }

    handleAdd = () => {
        const { dealInfo, groupProductId } = this.props;
        let defaultMinAmount = revenueTierSettingDefault.MinAmount;
        let defaultCommission = revenueTierSettingDefault.Commission;
        let defaultTierId = 1;

        const tierSettingListByGroupProduct = dealInfo.RevenueTierSetting.filter(t => t.GroupProductId === groupProductId);
        const itemCount = dealInfo.RevenueTierSetting.filter(t => t.GroupProductId === groupProductId).length;

        if (itemCount > 0) {
            const lastItem = tierSettingListByGroupProduct[itemCount - 1];
            const minAmount = Number(lastItem.MinAmount);
            const commission = lastItem.Commission + 0.1;

            defaultMinAmount = (minAmount < 1 || Number.isNaN(minAmount)) ? 1 : minAmount + 1;
            defaultCommission = commission <= MAX_PERCENTAGE ? commission : MAX_PERCENTAGE;
            defaultTierId = lastItem.TierId + 1;
        }

        const newTierSetting = {
            TierId: defaultTierId,
            GroupProductId: this.props.groupProductId,
            MinAmount: defaultMinAmount,
            MinQm: revenueTierSettingDefault.MinQm,
            Commission: defaultCommission
        };

        this.props.setDealInfo({ RevenueTierSetting: [...dealInfo.RevenueTierSetting, newTierSetting] });
    }

    handleRemove = (tierId, groupProductId) => {
        const { RevenueTierSetting } = this.props.dealInfo;
        const tierSettingList = removeTierItem(tierId, groupProductId, RevenueTierSetting);

        this.props.setDealInfo({ RevenueTierSetting: tierSettingList });
    }

    handleChangeInput = (tierId, tierItemValue) => {
        const { MinAmount, MinQm } = tierItemValue;

        if ((!MinAmount || regexAcceptNegativeAmountFormat.test(MinAmount)) &&
            (!MinQm || isValidNumber(MinQm))) {
            const { dealInfo, groupProductId } = this.props;

            const tierSettingList = dealInfo.RevenueTierSetting.map(item => {
                if (item.TierId === tierId && item.GroupProductId === groupProductId) {
                    return {
                        ...item,
                        ...tierItemValue
                    };
                }

                return item;
            });

            this.props.setDealInfo({ RevenueTierSetting: tierSettingList });
        }
    }

    render() {
        const { dealInfo, groupProductId, isDisableAddButton, handleClick, btnText } = this.props;
        const tierSettings = dealInfo.RevenueTierSetting.filter(t => t.GroupProductId === groupProductId)

        return (
            <div className='my-2'>
                <FormGroup row>
                    <Col sm={11}>
                        <table className="table table-bordered tier-setting-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 40 }}>Tier</th>
                                    <th>{MinNetWin}</th>
                                    <th>Min Qualified Player</th>
                                    <th style={{ width: 100 }}>Rev. Share%</th>
                                    <th style={{ width: 60 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !!tierSettings.length &&
                                    tierSettings.map((item, i) => {
                                        const isFirst = i === FIRST_ITEM_INDEX;
                                        const handleClick = isFirst ? this.handleAdd : () => this.handleRemove(item.TierId, groupProductId);

                                        return (<TierSettingItem data={item} key={`tier-${item.TierId}`}
                                            index={i + 1}
                                            handleClick={handleClick}
                                            btnText={isFirst ? '+' : '-'}
                                            isFirst={isFirst}
                                            onChange={this.handleChangeInput} />);
                                    })
                                }
                            </tbody>
                        </table>
                    </Col>
                    <Col sm={1} className="pl-0">
                        <button
                            type="button"
                            className="btn btn-action"
                            disabled={isDisableAddButton}
                            onClick={handleClick}>
                            {btnText}
                        </button>
                    </Col>
                </FormGroup>
            </div>
        )
    }
}

function mapStateToProp({ dealInfo }, { groupProductId }) {
    return { dealInfo, groupProductId };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setDealInfo }, dispatch);
}

export default connect(mapStateToProp, mapDispatchToProps)(TierSetting);