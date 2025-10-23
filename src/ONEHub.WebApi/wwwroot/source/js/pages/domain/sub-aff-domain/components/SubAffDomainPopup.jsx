import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { insertSubAffDomain, updateSubAffDomain, toggleLoader, fetchData, setSelectedSubAffDomain } from '../actions/index';

export class SubAffDomainPopup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isInsert: true,
            isShowMessage: false,
            isSuccess: true,
            message: ''
        }
    }

    componentDidUpdate(prevProps) {
        const { selectedSubAffDomain } = this.props;
        if (selectedSubAffDomain && prevProps.selectedSubAffDomain !== selectedSubAffDomain) {
            this.setState({ isInsert: selectedSubAffDomain.domainId === 0 });
        }
    }

    _handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        const { selectedSubAffDomain } = this.props;
        const newDomain = Object.assign({}, selectedSubAffDomain, { [target.name]: value });

        this.props.setSelectedSubAffDomain(newDomain);
    }

    _handleSubmit = async () => {
        this.props.toggleLoader(true);

        const { selectedSubAffDomain } = this.props;

        if (selectedSubAffDomain.domainName) {
            const { isInsert } = this.state;
            const message = isInsert ? "Add Sub-Affiliate Domain is successful!" : "Update Sub-Affiliate Domain is successful!";

            const result = isInsert ? await this.props.insertSubAffDomain(selectedSubAffDomain) : await this.props.updateSubAffDomain(selectedSubAffDomain);

            if (result) {
                this._handleShowAlert(result.IsSuccessful, result.IsSuccessful ? message : result.Message);
            } else {
                this._handleShowAlert(false, isInsert ? "Add Sub-Affiliate Domain is failed!" : "Update Sub-Affiliate Domain is failed!");
            }

        } else {
            this._handleShowAlert(false, "Please input Sub-Affiliate Domain's name!")
        }

        this.props.toggleLoader(false);
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
            this.props.fetchData();
            this.props.setSelectedSubAffDomain(null);
        }
    }

    _handleClosePopup = () => {
        this.props.setSelectedSubAffDomain(null)
    }

    render() {
        const { selectedSubAffDomain } = this.props;
        const { isInsert, isSuccess, isShowMessage, message } = this.state;
        const isShowPopup = selectedSubAffDomain !== null;
        const title = isInsert ? "Add Sub-Affiliate Domain" : "Edit Sub-Affiliate Domain";
        const buttonLabel = isInsert ? "Add" : "Submit";

        return selectedSubAffDomain && (
            <Modal isOpen={isShowPopup} toggle={this._handleClosePopup} backdrop='static' style={{ maxWidth: 400 }}>
                <ModalHeader toggle={this._handleClosePopup}><span className="iconpopup"></span>{title}</ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="domain-form-container">
                            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <Form tag="form" className="mb-4" autoComplete="off">
                                <FormGroup row className="align-items-center mb-2">
                                    <Label htmlFor="domainName" sm={3} className="required">Domain</Label>
                                    <Col sm={9}>
                                        <Input type="text" className="input-required mt-2" name="domainName"
                                            value={selectedSubAffDomain.domainName} onChange={this._handleChange} onKeyPress={this._handleKeyPress} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="align-items-center mb-2">
                                    <Label sm={3}>SSL</Label>
                                    <Col sm={9}>
                                        <input type="checkbox" className="mt-2" name="isSSL" checked={selectedSubAffDomain.isSSL} onChange={this._handleChange} />
                                    </Col>
                                </FormGroup>
                            </Form>

                            <Button type="button" color="success" className="mr-3" onClick={this._handleSubmit}>{buttonLabel}</Button>
                            <Button type="button" color="info" onClick={this._handleClosePopup}>Cancel</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

function mapStateToProps({ selectedSubAffDomain }) {
    return Object.assign({}, { selectedSubAffDomain });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ insertSubAffDomain, updateSubAffDomain, toggleLoader, fetchData, setSelectedSubAffDomain }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubAffDomainPopup);