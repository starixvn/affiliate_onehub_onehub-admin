import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Panel from '../Panel';
import { Row, Col, Button } from 'reactstrap';

import { resource, status, messages, statusForSuspend } from '../../libs/constants';
import { updateAffType, updateStatus, getAffiliateInfo, getTransferLimitSetting } from '../../actions';
import AssignDealPopup from '../../../../operation/assign-deal/AssignDealPopup';
import NotificationPopup from '../../../../common/components/NotificationPopup';
import TransferBalanceForPlayerSettingPopup from './TransferBalanceForPlayerSettingPopup';
import ClaimPrincipal, { claimResource } from '../../../../../modules/claim';
import { money } from '../../../../../modules/constants';
import { format } from '../../../../../modules/numberFormat';

export class SettingPanel extends PureComponent {
    constructor(props) {
        super(props);

        this.affTypeDropdown = React.createRef();
        this.affStatusDropdown = React.createRef();

        this.state = {
            isChangingAffType: false,
            isChangingAffStatus: false,
            isAssignCommissionGroup: false,
            selectedStatus: '',
            messageNotification: '',
            isConfirmPopup: true,
            isConfirmStatus: true,
            transferLimitSettingInfo: null,
        }

        const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
        this.canViewTransferSetting = claimsPrincipal.hasReadClaim(claimResource.TransferPlayerSetting);
        this.canEditTransferSetting = claimsPrincipal.hasWriteClaim(claimResource.TransferPlayerSetting);
    }

    _toggleChangingAffType = (isChanging) => {
        this.setState({ isChangingAffType: isChanging }, () => isChanging && this.affTypeDropdown.current.focus());
    }

    handleOpenChangingAffType = () => {
        this._toggleChangingAffType(true)
    }

    handleCloseChangingAffType = () => {
        this._toggleChangingAffType(false)
    }

    _toggleChangingAffStatus = (isChanging) => {
        this.setState({ isChangingAffStatus: isChanging }, () => isChanging && this.affStatusDropdown.current.focus());
    }

    handleOpenChangingAffStatus = () => {
        this._toggleChangingAffStatus(true)
    }

    handleCloseChangingAffStatus = () => {
        this._toggleChangingAffStatus(false)
    }

    toggleAssignCommissionPopup = (isChanging) => {
        this.setState({ isAssignCommissionGroup: isChanging })
    }

    handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ messageNotification: '' });

        const { isConfirmStatus, selectedStatus } = this.state;
        if (isConfirmStatus && confirmResult && selectedStatus) {
            this._saveStatus(selectedStatus);
        }
    }

    handleChangeStatus = (event) => {
        this.setState({ messageNotification: messages.areYouChangeStatus, isConfirmPopup: true, isConfirmStatus: true, selectedStatus: event.target.value });
    }

    _saveStatus = async (selectedStatus) => {
        const { affiliateInfo } = this.props;

        if (selectedStatus && selectedStatus.toLowerCase() === status.Approved && !affiliateInfo.AffCode) {
            this.setState({ isAssignCommissionGroup: true });
        } else {
            const param = Object.assign({}, { AffId: affiliateInfo.AffId, Status: selectedStatus });
            const result = await this.props.updateStatus(param);

            if (result.IsSuccessful) {
                this.setState({ messageNotification: messages.statusUpdatedSuccess, isConfirmPopup: false });
                this.props.getAffiliateInfo(this.props.affName);
            }
            else {
                this.setState({ messageNotification: result.Message, isConfirmPopup: false });
            }
        }
    }

    handleChangeAffType = async (event) => {
        const affType = event.target.value;
        const param = Object.assign({}, { AffId: this.props.affiliateInfo.AffId, AffType: affType });
        const result = await this.props.updateAffType(param);

        if (result.IsSuccessful) {
            this.props.getAffiliateInfo(this.props.affName);
            this._toggleChangingAffType(false);
        }
        else {
            this.setState({ messageNotification: messages.affTypeUpdatedFail, isConfirmPopup: false });
        }
    }

    toggleTransferSettingPopup = (info) => {
        this.setState({ transferLimitSettingInfo: info });
    }

    handleOpenTransferSettingPopup = async () => {
        const { affiliateInfo } = this.props;
        const transferLimitSettingInfo = await this.props.getTransferLimitSetting(affiliateInfo.AffId);

        this.toggleTransferSettingPopup(transferLimitSettingInfo)
    }

    handleCloseTransferSettingPopup = () => {
        this.toggleTransferSettingPopup(null)
    }

    render() {
        const { affiliateInfo, isApproved, affTypeList } = this.props;
        const { isChangingAffType, isChangingAffStatus, isAssignCommissionGroup, messageNotification, isConfirmPopup, transferLimitSettingInfo } = this.state;
        const affType = affTypeList && affTypeList.filter(a => a.AffTypeId == affiliateInfo.AffType);
        const transferSettingLabel = affiliateInfo.IsDisabledTransfer ? resource.Disabled : (affiliateInfo.TransferLimit === money.AllowedMaxValue ? resource.Unlimited : `${affiliateInfo.PlayerCurrency} ${format(affiliateInfo.TransferLimit)}`);

        return (
            <Panel heading={resource.Setting}>
                <Row>
                    <Col>{resource.AffiliateType}</Col>
                    <Col className="text-right text-primary">
                        <select style={{ display: isChangingAffType ? 'inline-block' : 'none' }} value={affiliateInfo.AffType}
                            onChange={this.handleChangeAffType} onBlur={this.handleCloseChangingAffType} ref={this.affTypeDropdown}>
                            {
                                affTypeList && affTypeList.map(item => {
                                    return (<option value={item.AffTypeId} key={`affinfo-type-${item.AffTypeId}`}>{item.AffTypeName}</option>)
                                })
                            }
                        </select>
                        <Button color="link" className="left-panel-btn-link" style={{ display: isChangingAffType ? 'none' : 'inline-block' }} onClick={this.handleOpenChangingAffType}>
                            {
                                affType.length ? affType[0].AffTypeName : affiliateInfo.AffType
                            }
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>{resource.Status}</Col>
                    <Col className="text-right">
                        <div className="text-primary">
                            <select style={{ display: isChangingAffStatus ? 'inline-block' : 'none' }} value={affiliateInfo.Status}
                                onChange={this.handleChangeStatus}
                                onBlur={this.handleCloseChangingAffStatus}
                                ref={this.affStatusDropdown}>
                                {
                                    Object.keys(isApproved ? statusForSuspend : status).map(key => {
                                        return (<option value={key} key={`status-${key}`}>{key}</option>)
                                    })
                                }
                            </select>
                            <Button color="link" className="left-panel-btn-link" style={{ display: isChangingAffStatus ? 'none' : 'inline-block' }}
                                onClick={this.handleOpenChangingAffStatus}>
                                {affiliateInfo.Status}
                            </Button>
                        </div>
                        <AssignDealPopup
                            showPopupAssignDeal={isAssignCommissionGroup}
                            isNewAffiliate={true}
                            affName={affiliateInfo.AffName}
                            affId={affiliateInfo.AffId}
                            setShowPopupAssignDeal={this.toggleAssignCommissionPopup}
                            getAffiliateInfo={this.props.getAffiliateInfo}
                        />
                    </Col>
                </Row>
                {
                    isApproved && this.canViewTransferSetting && (
                        <Fragment>
                            <Row>
                                <Col className="left-panel-wrap-line">{resource.TransferBalanceForPlayer}</Col>
                                <Col className="text-right">
                                    {
                                        this.canEditTransferSetting ? (
                                            <Button color="link" className="left-panel-btn-link text-primary" onClick={this.handleOpenTransferSettingPopup}>
                                                {transferSettingLabel}
                                            </Button>
                                        ) : transferSettingLabel
                                    }
                                </Col>
                            </Row>
                            {
                                transferLimitSettingInfo && (
                                    <TransferBalanceForPlayerSettingPopup
                                        affId={affiliateInfo.AffId}
                                        affName={affiliateInfo.AffName}
                                        settingInfo={transferLimitSettingInfo}
                                        onClose={this.handleCloseTransferSettingPopup} />
                                )
                            }
                        </Fragment>
                    )
                }
                {
                    !!messageNotification && <NotificationPopup
                        message={messageNotification}
                        isConfirmPopup={isConfirmPopup}
                        onClose={this.handleCloseNotificationPopup}
                    />
                }
            </Panel>
        );
    }
}

function mapStateToProps({ leftPanel }) {
    const { affiliateInfo, affName, affTypeList } = leftPanel;

    return Object.assign({}, { affiliateInfo, affName, affTypeList });
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAffiliateInfo, updateAffType, updateStatus, getTransferLimitSetting }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingPanel);