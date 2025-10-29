import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { insertSpecificDomain, updateSpecificDomain, toggleLoader, fetchData, setSelectedDomainId, getSpecificDomainById } from '../actions/index';
import { defaultState, headerText, affsCondition } from '../libs/constants';

export class SpecificDomainControlPopup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = defaultState;
    }

    componentDidUpdate(prevProps) {
        const { selectedDomainId } = this.props;
        if (selectedDomainId !== null && prevProps.selectedDomainId !== selectedDomainId) {
            this._handleUpdateState(selectedDomainId);
        }
    }

    _handleUpdateState = async (selectedDomainId) => {
        if (selectedDomainId === 0) {
            this.setState({
                isInsert: true,
                selectedDomain: {
                    specificDomainControlId: selectedDomainId,
                    affDomain: '',
                    redirectDomain: '',
                    affDomainIsSSL: true,
                    redirectDomainIsSSL: true,
                    status: true,
                    isMobile: false
                }
            });
        } else {
            this.props.toggleLoader(true);
            const domain = await this.props.getSpecificDomainById(selectedDomainId);

            if (domain) {
                const { AffUsername, AffDomain, RedirectDomain, AffDomainIsSSL, RedirectDomainIsSSL, Status, IsMobile } = domain;

                this.setState({
                    isInsert: false, selectedDomain: {
                        specificDomainControlId: selectedDomainId,
                        affUsername: AffUsername,
                        affDomain: AffDomain,
                        affDomainIsSSL: AffDomainIsSSL,
                        redirectDomain: RedirectDomain,
                        redirectDomainIsSSL: RedirectDomainIsSSL,
                        status: Status,
                        isMobile: IsMobile
                    }
                });
            } else {
                this.props.setSelectedDomainId(null);
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

    _handleChangeAffUsernames = (event) => {
        event.preventDefault();
        const value = event.target.value;

        if (affsCondition.charactersPattern.test(value)) {
            return;
        }

        this.setState({ affUsernames: value });
    }

    _handleBlurAffUsernames = () => {
        this.setState(({ affUsernames }) => {
            const newAffUsernames = affUsernames.replace(/\n+|\s+/g, ',').replace(/,+/g, ',').replace(/(^,)|(,$)/g, '');

            return { affUsernames: newAffUsernames };
        });
    }

    _validateDomains = (selectedDomain) => {
        if (!selectedDomain.affDomain || !selectedDomain.redirectDomain) {
            this._handleShowAlert(false, "Please input Aff or Redirect Domain name!");
            return false;
        }

        return true;
    }

    _validateAffUsernames = (affUsernames) => {
        if (!affUsernames) {
            this._handleShowAlert(false, "Please enter Affiliate(s)!");
            return false;
        }

        const affiliates = affUsernames.split(',');

        if (affiliates.length > affsCondition.maximumNumber) {
            this._handleShowAlert(false, 'The function can only create assignment for up to 500 affiliates per request!');
            return false;
        }

        if (!affsCondition.affsPattern.test(affUsernames)) {
            this._handleShowAlert(false, "Affiliate(s) is an invalid format or affiliate!");
            return false;
        }

        return true;
    }

    _handleSubmit = async () => {
        const { isInsert } = this.state;

        this.props.toggleLoader(true);

        isInsert ? await this._handleInsertSpecificDomain() : await this._handleUpdateSpecificDomain();

        this.props.toggleLoader(false);
    }

    _handleInsertSpecificDomain = async () => {
        try {
            const { selectedDomain, affUsernames } = this.state;

            if (!this._validateAffUsernames(affUsernames) || !this._validateDomains(selectedDomain)) {
                return;
            }

            const result = await this.props.insertSpecificDomain({
                ...selectedDomain,
                affUsername: affUsernames
            });

            if (!result) {
                throw new Error("Failed to add specific domain");
            }

            const message = result.IsSuccessful
                ? "Add Specific Domain Successfully!"
                : result.Message;

            this._handleShowAlert(result.IsSuccessful, message);

        } catch (error) {
            this._handleShowAlert(false, "Add Specific Domain failed!");
        }
    }

    _handleUpdateSpecificDomain = async () => {
        try {
            const { selectedDomain } = this.state;

            if (!this._validateDomains(selectedDomain)) {
                return;
            }

            const result = await this.props.updateSpecificDomain(selectedDomain);

            if (!result) {
                throw new Error("Failed to update specific domain");
            }

            const message = result.IsSuccessful
                ? "Update Specific Domain Successfully!"
                : result.Message;

            this._handleShowAlert(result.IsSuccessful, message);

        } catch (error) {
            this._handleShowAlert(false, "Update Specific Domain failed!");
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
            this.props.fetchData(this.props.param);
            this._handleClosePopup();
        }
    }

    _handleClosePopup = () => {
        this.props.setSelectedDomainId(null);
        this.setState(defaultState);
    }

    render() {
        const { selectedDomainId } = this.props;
        const { isInsert, isSuccess, isShowMessage, message, selectedDomain, affUsernames } = this.state;
        const isShowPopup = selectedDomainId !== null;
        const title = isInsert ? "Add New Specific Domain Control" : "Edit Specific Domain Control";
        const buttonLabel = isInsert ? "Add" : "Submit";

        if (!selectedDomain) {
            return null;
        }

        return (
            <Modal
                isOpen={isShowPopup}
                toggle={this._handleClosePopup}
                backdrop='static'
                style={{ maxWidth: isInsert ? 550 : 500 }}
            >
                <ModalHeader toggle={this._handleClosePopup}>
                    <span className="iconpopup"></span>
                    {title}
                </ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="domain-form-container">
                            <Alert
                                color={isSuccess ? 'success' : 'danger'}
                                isOpen={isShowMessage}
                            >
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <Form tag="form" className="mb-4" autoComplete="off">
                                <FormGroup row className="align-items-center">
                                    <Label htmlFor="affUsernames" className="required" sm={3}>
                                        {headerText.Affiliate}
                                    </Label>
                                    <Col sm={9}>
                                        {isInsert ? (
                                            <>
                                                <Input
                                                    type="textarea"
                                                    rows="6"
                                                    id="affUsernames"
                                                    name="affUsernames"
                                                    className="input-required"
                                                    value={affUsernames}
                                                    onChange={this._handleChangeAffUsernames}
                                                    onBlur={this._handleBlurAffUsernames}
                                                />
                                                <div>
                                                    <Label>Enter up to 500 affiliates, separated by commas, tabs or new lines.</Label>
                                                </div>
                                            </>
                                        ) : (
                                            <Input
                                                type="text"
                                                disabled
                                                className="input-required"
                                                id="affUsernames"
                                                name="affUsernames"
                                                value={selectedDomain.affUsername}
                                            />
                                        )}
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="align-items-center">
                                    <Label htmlFor="affDomain" className="required" sm={3}>
                                        {headerText.AffDomain}
                                    </Label>
                                    <Col sm={7}>
                                        <Input
                                            type="text"
                                            className="input-required"
                                            id="affDomain"
                                            name="affDomain"
                                            value={selectedDomain.affDomain}
                                            onChange={this._handleChange}
                                            onKeyPress={this._handleKeyPress}
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <FormGroup check>
                                            <Label check>
                                                <Input
                                                    type="checkbox"
                                                    checked={selectedDomain.affDomainIsSSL}
                                                    name="affDomainIsSSL"
                                                    onChange={this._handleChange}
                                                />
                                                {headerText.SSL}
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="align-items-center">
                                    <Label htmlFor="redirectDomain" className="required" sm={3}>
                                        {headerText.RedirectDomain}
                                    </Label>
                                    <Col sm={7}>
                                        <Input
                                            type="text"
                                            className="input-required"
                                            id="redirectDomain"
                                            name="redirectDomain"
                                            value={selectedDomain.redirectDomain}
                                            onChange={this._handleChange}
                                            onKeyPress={this._handleKeyPress}
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <FormGroup check>
                                            <Label check>
                                                <Input
                                                    type="checkbox"
                                                    checked={selectedDomain.redirectDomainIsSSL}
                                                    name="redirectDomainIsSSL"
                                                    onChange={this._handleChange}
                                                />
                                                {headerText.SSL}
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="align-items-center">
                                    <Col sm={3}></Col>
                                    <Label sm={3} className="d-flex mt-1">
                                        <input type="checkbox" name="status" checked={selectedDomain.status} onChange={this._handleChange} />
                                        <span className='ml-2'>Is Active</span>
                                    </Label>
                                    <Label sm={4} className="d-flex mt-1">
                                        <input type="checkbox" name="isMobile" checked={selectedDomain.isMobile} onChange={this._handleChange} />
                                        <span className='ml-2'>Is Mobile Only</span>
                                    </Label>
                                </FormGroup>
                            </Form>

                            <Button
                                type="button"
                                color="success"
                                className="mr-3"
                                onClick={this._handleSubmit}
                            >
                                {buttonLabel}
                            </Button>
                            <Button
                                type="button"
                                color="info"
                                onClick={this._handleClosePopup}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

function mapStateToProps({ selectedDomainId, param }) {
    return Object.assign({}, { selectedDomainId, param });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ insertSpecificDomain, updateSpecificDomain, toggleLoader, fetchData, setSelectedDomainId, getSpecificDomainById }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SpecificDomainControlPopup);