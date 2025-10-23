import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Panel from '../Panel';
import { Row, Col, Button } from 'reactstrap';

import { resource } from '../../libs/constants';
import { formatDecimalWithCurrencySymbol } from '../../../../../modules/numberFormat';
import { getAffiliateInfo } from '../../actions';
import AssignDealPopup from '../../../../operation/assign-deal/AssignDealPopup';
import { htmlDecode } from '../../../../../modules/htmlHelper';

export class CommissionPanel extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isChangingDeal: false
        }
    }

    toggleEditingCommissionPopup = (isChanging) => {
        this.setState({ isChangingDeal: isChanging })
    }

    _renderCommGroup(affiliateInfo) {
        return <Button color="link" className="left-panel-btn-link align-baseline text-right" onClick={() => this.toggleEditingCommissionPopup(true)}>
            {htmlDecode(affiliateInfo.CommGroupName)}
        </Button>
    }

    render() {
        const { isChangingDeal } = this.state;
        const { affiliateInfo } = this.props;

        return (
            <Panel heading={resource.Commission}>
                <Row>
                    <Col sm={4}>{resource.CommType}</Col>
                    <Col sm={8} className='text-right text-break pl-0'>
                        {htmlDecode(affiliateInfo.DealTypeName)}
                    </Col>
                </Row>
                <Row>
                    <Col sm={5}>{resource.CommGroup}</Col>
                    <Col sm={7} className='text-right text-break pl-0'>
                        {this._renderCommGroup(affiliateInfo)}
                        <AssignDealPopup
                            showPopupAssignDeal={isChangingDeal}
                            setShowPopupAssignDeal={this.toggleEditingCommissionPopup}
                            getAffiliateInfo={this.props.getAffiliateInfo}
                            isNewAffiliate={affiliateInfo.IsNewAffiliate}
                            affName={affiliateInfo.AffName}
                            affId={affiliateInfo.AffId}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm={7} className="pr-0">{resource.BalanceForward}</Col>
                    <Col sm={5} className="text-right text-break pl-0">{formatDecimalWithCurrencySymbol(affiliateInfo.BalanceBf)}</Col>
                </Row>
            </Panel>
        );
    }
}

function mapStateToProps({ leftPanel }) {
    const { affiliateInfo } = leftPanel;

    return Object.assign({}, { affiliateInfo });
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAffiliateInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CommissionPanel);