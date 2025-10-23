import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TierSettingItem from './TierSettingItem';

import { setDealInfo } from '../../../../actions';
import { convertProductList } from '../../../../libs/service';
import { FIRST_ITEM_INDEX } from '../../../../libs/constants';

export const TierSetting = (props) => {
    const { dealInfo, productList } = props;
    const { ProductGroup, CPATierSetting } = dealInfo;

    const _handleTierSetting = () => {
        const tierSettingList = ProductGroup.map(p => {

            const checkedProducts = _getCheckedProducts();
            const productGroup = convertProductList(productList, p.ProductIds, checkedProducts);
            const tierSetting = CPATierSetting.filter(t => t.GroupProductId === p.GroupProductId);

            return {
                ProductGroup: productGroup,
                TierSetting: tierSetting,
                GroupProductId: p.GroupProductId
            };
        });

        return tierSettingList;
    }

    const _getCheckedProducts = () => {
        const checkedProducts = [];
        ProductGroup.forEach(p => {
            checkedProducts.push(...p.ProductIds.split(',').filter(p => !!p));
        });

        return checkedProducts;
    }

    const tierSettingList = _handleTierSetting();

    return (
        <fieldset className="tier-setting-group">
            <legend><h6 className="font-weight-bold">Tier Setting</h6></legend>
            <p className="font-weight-bold mr-5">Product Groups</p>
            {tierSettingList && tierSettingList.map((tierSetting, index) => {
                const isFirstItem = index === FIRST_ITEM_INDEX;

                return (
                    <TierSettingItem
                        key={tierSetting.GroupProductId}
                        tierSetting={tierSetting}
                        isFirstItem={isFirstItem}
                        index={index} />
                );
            })}
        </fieldset>
    );
};

const mapStateToProps = ({ dealInfo, productList }) => {
    return {
        dealInfo,
        productList
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setDealInfo
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(TierSetting));
