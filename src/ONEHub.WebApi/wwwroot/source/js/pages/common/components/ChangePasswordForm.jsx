import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Col, Button, Form, FormGroup, Label, Input, FormFeedback, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { resource, regExp, messages } from '../modules/constants/changePassword';
import { updateChangeAffPasswword, updateChangeAdminPasswword } from '../actions/changePassword';

export class ChangePasswordForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isClickedSubmit: false,
            password: '',
            confirmPassword: '',
            isShowMessage: false,
            isSuccess: true,
            message: ''
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = (isValid) => {
        this.setState({ isClickedSubmit: true });

        if (isValid) {
            const { selectedId } = this.props;
            const { password, confirmPassword } = this.state;

            const param = this.props.isAdmin ? {
                AccountId: selectedId,
                Password: password,
                ConfirmPassword: confirmPassword
            } : {
                    AffId: selectedId,
                    Password: password,
                    ConfirmPassword: confirmPassword
                };

            this.saveChangePassword(param);
        }
    }

    handleClosePopup = () => {
        this.props.setShowPopupPassword(false);
        this.setState({ password: '', confirmPassword: '', isClickedSubmit: false });
    }

    async saveChangePassword(param) {
        const result = this.props.isAdmin ? await this.props.updateChangeAdminPasswword(param) : await this.props.updateChangeAffPasswword(param);

        if (result) {
            if (result.IsSuccessful) {
                window.setTimeout(this.handleClosePopup, 3000);
            }

            this.setState({
                isSuccess: result.IsSuccessful,
                isShowMessage: true,
                message: result.IsSuccessful ? messages.ChangePasswordSuccess : result.Message
            }, () => window.setTimeout(this.hideMessage, 3000));
        } else {
            this.setState({
                isSuccess: false,
                isShowMessage: true,
                message: messages.ChangePasswordFailed
            }, () => window.setTimeout(this.hideMessage, 3000));
        }
    }

    hideMessage = () => {
        this.setState({
            isShowMessage: false
        });
    }

    _validatePassword(password) {
        const result = {
            isValid: false,
            message: messages.RequiredPassword
        }

        if (password) {
            const regexCheckPassword = new RegExp(regExp.CheckPassword);
            const isValid = regexCheckPassword.test(password);

            result.isValid = isValid;
            result.message = isValid ? "" : messages.PasswordErrorMessage;
        }

        return result;
    }

    _validateConfirmPassword(password, confirmPassword) {
        const result = {
            isValid: false,
            message: messages.RequiredConfirmPassword
        }

        if (confirmPassword) {
            const isValid = confirmPassword === password;

            result.isValid = isValid;
            result.message = isValid ? "" : messages.ConfirmPasswordErrorMessage;
        }

        return result;
    }

    _handlePressEnter = (isValid, event) => {
        if (event.charCode === 13) {
            event.preventDefault()
            this.handleSubmit(isValid);
        }
    }

    render() {
        const { showPopupPassword } = this.props;
        const { password, confirmPassword, isShowMessage, isSuccess, message, isClickedSubmit } = this.state;

        const passwordValidation = this._validatePassword(password);
        const confirmPasswordValidation = this._validateConfirmPassword(password, confirmPassword);
        const isValid = passwordValidation.isValid && confirmPasswordValidation.isValid;

        return (
            <Modal isOpen={showPopupPassword} toggle={this.handleClosePopup} backdrop='static'>
                <ModalHeader toggle={this.handleClosePopup}><span className="iconpopup"></span>{resource.ChangePassword}</ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="change-password-form-container">
                            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <Form tag="form" className="mb-5" autoComplete="off">
                                <FormGroup row className="mb-2">
                                    <Label htmlFor="Password" sm={4} className="required">{resource.Password}:</Label>
                                    <Col sm={8}>
                                        <Input type="password" className="input-required" name="password" id="Password" autoComplete="false"
                                            value={password} onKeyPress={(e) => this._handlePressEnter(isValid, e)} onChange={this.handleChange} invalid={isClickedSubmit && !passwordValidation.isValid} />
                                        {passwordValidation.message &&
                                            <FormFeedback><div dangerouslySetInnerHTML={{ __html: passwordValidation.message }} /></FormFeedback>}
                                    </Col>
                                </FormGroup>

                                <FormGroup row className="mb-2">
                                    <Label htmlFor="ConfirmPassword" sm={4} className="required">{resource.ConfirmPassword}:</Label>
                                    <Col sm={8}>
                                        <Input type="password" className="input-required" name="confirmPassword" id="ConfirmPassword" autoComplete="false"
                                            value={confirmPassword} onKeyPress={(e) => this._handlePressEnter(isValid, e)} onChange={this.handleChange} invalid={isClickedSubmit && !confirmPasswordValidation.isValid} />
                                        {confirmPasswordValidation.message &&
                                            <FormFeedback><div dangerouslySetInnerHTML={{ __html: confirmPasswordValidation.message }} /></FormFeedback>}
                                    </Col>
                                </FormGroup>
                            </Form>

                            <Button type="button" color="success" className="mr-3" disabled={isClickedSubmit ? !isValid : false} onClick={() => this.handleSubmit(isValid)}>{resource.Submit}</Button>
                            <Button type="button" color="info" onClick={this.handleClosePopup}>{resource.Cancel}</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateChangeAffPasswword, updateChangeAdminPasswword }, dispatch);
}

export default connect(null, mapDispatchToProps)(ChangePasswordForm);