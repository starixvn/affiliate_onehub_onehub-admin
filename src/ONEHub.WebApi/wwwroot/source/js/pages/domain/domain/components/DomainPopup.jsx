import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationPopup from '../../../common/components/NotificationPopup';

import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { insertDomain, updateDomain, toggleLoader, fetchData, setSelectedDomainId, getDomainById, getTargetCountryListByDomain } from '../actions/index';
import { defaultState } from '../libs/constants';
import { getBlockTargetCountryList, _handleInitialTargetCountryList } from '../../../common/modules/utils/targetCountry';
import { targetCountryStatus } from '../../../../modules/constants';
import { handleChangeMultipleSelected } from '../../../../modules/utils';
import MultipleSelect from '../../../../components/multiple-select';

export class DomainPopup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = defaultState;
    }

    componentDidUpdate(prevProps) {
        const { selectedDomainId, isAffDomain } = this.props;
        if (selectedDomainId !== null && prevProps.selectedDomainId !== selectedDomainId) {
            this._handleUpdateState(selectedDomainId, isAffDomain);
        }
    }

    _handleUpdateState = async (selectedDomainId, isAffDomain) => {
        if (selectedDomainId === 0) {
            const initialTargetCountryList = await this.props.getTargetCountryListByDomain({ affDomainId: 0, redirectDomainId: 0 });
            const convertTargetCountryList = _handleInitialTargetCountryList(initialTargetCountryList, '');

            this.setState({ isInsert: true, selectedDomain: { domainId: selectedDomainId, domainName: '', blockTargetCountry: '', isSSL: true }, targetCountryList: convertTargetCountryList, initialTargetCountryList });
        } else {
            this.props.toggleLoader(true);
            const domain = await this.props.getDomainById(selectedDomainId, isAffDomain);

            if (domain) {
                const { DomainName, IsSSL } = domain;
                const domainIdParam = isAffDomain ? "affDomainId" : "redirectDomainId";
                const initialTargetCountryList = await this.props.getTargetCountryListByDomain({ [domainIdParam]: selectedDomainId });
                if (initialTargetCountryList && initialTargetCountryList.length) {
                    const blockTargetCountryList = getBlockTargetCountryList(initialTargetCountryList);
                    const blockTargetCountry = blockTargetCountryList.join(',');

                    const targetCountryList = _handleInitialTargetCountryList(initialTargetCountryList, blockTargetCountry);

                    this.setState({ isInsert: false, selectedDomain: { domainId: selectedDomainId, domainName: DomainName, blockTargetCountry, isSSL: IsSSL }, targetCountryList, initialTargetCountryList });
                } else {
                    this.setState({ isInsert: false, selectedDomain: { domainId: selectedDomainId, domainName: DomainName, blockTargetCountry: '', isSSL: IsSSL } });
                }
            }
            this.props.toggleLoader(false);
        }
    }

    _handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        const { selectedDomain } = this.state;
        const newDomain = Object.assign({}, selectedDomain, { [target.name]: value });

        this.setState({ selectedDomain: newDomain });
    }

    handleChangeTargetCountry = (item, selectedTargetCountry) => {
        const { selectedDomain, targetCountryList } = this.state;
        const newDomain = Object.assign({}, selectedDomain, { blockTargetCountry: selectedTargetCountry });
        const newTargetCountryList = handleChangeMultipleSelected(targetCountryList, selectedTargetCountry);

        this.setState({ selectedDomain: newDomain, targetCountryList: newTargetCountryList });
    }

    _handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ messageConfirm: '' });

        const { selectedDomain, isConfirmPopup } = this.state;
        if ((confirmResult || !isConfirmPopup) && selectedDomain.domainName) {
            this._submitData(selectedDomain);
        }
    }

    _handleSubmit = async () => {
        const { selectedDomain, isInsert, initialTargetCountryList } = this.state;

        if (!selectedDomain.domainName) {
            this._handleShowAlert(false, "Please input domain name!");
            return;
        }

        const initialUsedCountryOnControlDomains = initialTargetCountryList?.filter(targetCountry =>
            targetCountry.IsUsedDomainControl
        ).map(t => t.TargetCountryCode).join(',');

        if (isInsert || !initialUsedCountryOnControlDomains) {
            this._submitData(selectedDomain);
            return;
        }

        const selectedBlockedCodes = selectedDomain.blockTargetCountry;

        const initialBlockedControlDomains = initialTargetCountryList.filter(targetCountry =>
            targetCountry.Status === targetCountryStatus.Blocked
        ).map(t => t.TargetCountryCode);

        const blockedControlDomains = initialTargetCountryList.filter(targetCountry =>
            targetCountry.IsUsedDomainControl &&
            selectedBlockedCodes.includes(targetCountry.TargetCountryCode) &&
            !initialBlockedControlDomains.includes(targetCountry.TargetCountryCode)
        );

        if (!!blockedControlDomains.length) {
            const message = `The mapping domain control will be disabled if you block this target country. Are you sure you want to proceed with this?`;

            this.setState({ messageConfirm: message, isConfirmPopup: true });
            return;
        }

        const unblockedControlDomains = initialTargetCountryList.filter(targetCountry =>
            targetCountry.IsUsedDomainControl &&
            !selectedBlockedCodes.includes(targetCountry.TargetCountryCode) &&
            initialBlockedControlDomains.includes(targetCountry.TargetCountryCode)
        );

        if (!!unblockedControlDomains.length) {
            const message = `Please check the mapping domain control for this domain after you unblock the target country!`;

            this.setState({ messageConfirm: message, isConfirmPopup: false });
            return;
        }

        this._submitData(selectedDomain);
    }

    _submitData = async (selectedDomain) => {
        try {
            this.props.toggleLoader(true);

            const { isAffDomain } = this.props;
            const { isInsert } = this.state;

            const domainInfo = {
                ...selectedDomain,
                isAffDomain
            };

            const result = isInsert
                ? await this.props.insertDomain(domainInfo)
                : await this.props.updateDomain(domainInfo);

            const successMessage = isInsert ? "Add Successfully!" : "Update Successfully!";
            const errorMessage = isInsert ? "Add Domain failed!" : "Update Domain failed!";

            if (result) {
                this._handleShowAlert(
                    result.IsSuccessful,
                    result.IsSuccessful ? successMessage : result.Message
                );
            } else {
                this._handleShowAlert(false, errorMessage);
            }
        } catch (error) {
            this._handleShowAlert(false, 'An unexpected error occurred');
        } finally {
            this.props.toggleLoader(false);
        }
    }

    _handleKeyPress = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();
            this._handleSubmit();
        }
    }

    _handleShowAlert = (isSuccess, message) => {
        this.setState({
            message,
            isSuccess,
            isShowMessage: true,
        }, () => window.setTimeout(() => this._hideMessage(isSuccess), 3000));
    }

    _hideMessage = (isSuccess) => {
        this.setState({
            isShowMessage: false
        });

        if (isSuccess) {
            this.props.fetchData(this.props.isAffDomain);
            this._handleClosePopup();
        }
    }

    _handleClosePopup = () => {
        this.props.setSelectedDomainId(null);
        this.setState(defaultState);
    }

    render() {
        const { isInsert, isSuccess, isShowMessage, message, isConfirmPopup, messageConfirm, selectedDomain, targetCountryList } = this.state;
        const isShowPopup = selectedDomain !== null;
        const title = isInsert ? "Add Domain" : "Edit Domain";
        const buttonLabel = isInsert ? "Add" : "Submit";

        return selectedDomain && (
            <>
                <Modal isOpen={isShowPopup} toggle={this._handleClosePopup} backdrop="static" style={{ maxWidth: 500 }}>
                    <ModalHeader toggle={this._handleClosePopup}><span className="iconpopup"></span>{title}</ModalHeader>
                    <ModalBody>
                        <div className="modal-body-wrapper">
                            <div className="domain-form-container">
                                <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                    <div dangerouslySetInnerHTML={{ __html: message }}></div>
                                </Alert>
                                <Form tag="form" className="mb-2" autoComplete="off">
                                    <FormGroup row className="align-items-center mb-2">
                                        <Label for="domainName" sm={4} className="required">Domain</Label>
                                        <Col sm={8}>
                                            <Input type="text" className="input-required mt-2" name="domainName"
                                                value={selectedDomain.domainName} onChange={this._handleChange} onKeyPress={this._handleKeyPress} />
                                        </Col>
                                    </FormGroup>
                                    {
                                        targetCountryList && <FormGroup row className="align-items-center mb-2">
                                            <Label sm={4}>Block Target Country</Label>
                                            <Col sm={8}>
                                                <MultipleSelect
                                                    dataSource={targetCountryList}
                                                    keyField="key"
                                                    valueField="name"
                                                    statusField="checked"
                                                    noneSelectedLabel="None"
                                                    selectedAllLabel="All Target Countries"
                                                    hasInputOption={false}
                                                    onChange={this.handleChangeTargetCountry} />
                                            </Col>
                                        </FormGroup>
                                    }
                                    <FormGroup row className="align-items-center mb-2">
                                        <Label for="isSSL" sm={4}>SSL</Label>
                                        <Col sm={8}>
                                            <input type="checkbox" name="isSSL" id="isSSL" checked={selectedDomain.isSSL} onChange={this._handleChange} />
                                        </Col>
                                    </FormGroup>
                                </Form>

                                <Button type="button" color="success" className="mr-3" onClick={this._handleSubmit}>{buttonLabel}</Button>
                                <Button type="button" color="info" onClick={this._handleClosePopup}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                {
                    !!messageConfirm && <NotificationPopup
                        message={messageConfirm}
                        isConfirmPopup={isConfirmPopup}
                        onClose={this._handleCloseNotificationPopup}
                    />
                }
            </>
        );
    }
}

function mapStateToProps({ selectedDomainId, isAffDomain }) {
    return Object.assign({}, { selectedDomainId, isAffDomain });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ insertDomain, updateDomain, toggleLoader, fetchData, setSelectedDomainId, getDomainById, getTargetCountryListByDomain }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DomainPopup);