import React, { PureComponent } from 'react';
import { Col, Button, Form, FormGroup, Label, Input, FormFeedback, Alert } from 'reactstrap';
import { regExp, messages, initialState } from '../libs/constants';
import { post } from '../../../modules/ajaxRequest';

export default class AppContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { ...initialState }
    }

    _handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    _handleSubmit = async (isValid) => {
        this.setState({ isClickedSubmit: true });

        if (isValid) {
            const { oldPassword, newPassword, confirmPassword } = this.state;
            const param = { oldPassword, newPassword, confirmPassword };
            const response = await post('Portal/ChangeAdminPassword/ChangePassword', param);

            if (response) {
                const { data } = response;

                this._handleShowAlert(data.IsSuccessful, data.IsSuccessful ? messages.ChangePasswordSuccess : data.Message);
            } else {
                this._handleShowAlert(false, messages.ChangePasswordFailed);
            }
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

        isSuccess && this._handleReset();
    }

    _handlePressEnter = (isValid, event) => {
        if (event.charCode === 13) {
            event.preventDefault()
            this._handleSubmit(isValid);
        }
    }

    _handleReset = () => {
        this.setState({ ...initialState });
    }

    _validateNewPassword(newPassword) {
        const result = {
            isValid: false,
            message: messages.RequiredNewPassword
        }

        if (newPassword) {
            const regexCheckPassword = new RegExp(regExp.CheckPassword);
            const isValid = regexCheckPassword.test(newPassword);

            result.isValid = isValid;
            result.message = isValid ? "" : messages.PasswordIncorrect;
        }

        return result;
    }

    _validateConfirmPassword(newPassword, confirmPassword) {
        const result = {
            isValid: false,
            message: messages.RequiredConfirmPassword
        }

        if (confirmPassword) {
            const isValid = confirmPassword === newPassword;

            result.isValid = isValid;
            result.message = isValid ? "" : messages.ConfirmPasswordIncorrect;
        }

        return result;
    }

    render() {
        const { isClickedSubmit, oldPassword, newPassword, confirmPassword, isShowMessage, isSuccess, message } = this.state;

        const newPasswordValidation = this._validateNewPassword(newPassword);
        const confirmPasswordValidation = this._validateConfirmPassword(newPassword, confirmPassword);
        const isValidOldPassword = !!oldPassword;
        const isValid = isValidOldPassword && newPasswordValidation.isValid && confirmPasswordValidation.isValid;

        return (
            <div className="change-admin-password-container">
                <fieldset>
                    <legend><h6 className="font-weight-bold">Change Password</h6></legend>
                    <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                        <div dangerouslySetInnerHTML={{ __html: message }}></div>
                    </Alert>
                    <Form tag="form" className="my-2" autoComplete="off">
                        <FormGroup row className="mb-2">
                            <Label htmlFor="oldPassword" sm={4} className="required text-right">Old Password</Label>
                            <Col sm={8}>
                                <Input type="password" className="input-required mt-1" name="oldPassword" id="oldPassword" autoComplete="false"
                                    value={oldPassword} onKeyPress={(e) => this._handlePressEnter(isValid, e)} onChange={this._handleChange} invalid={isClickedSubmit && !isValidOldPassword} />
                                {!isValidOldPassword &&
                                    <FormFeedback><div dangerouslySetInnerHTML={{ __html: messages.RequiredOldPassword }} /></FormFeedback>}
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-2">
                            <Label htmlFor="newPassword" sm={4} className="required text-right">New Password</Label>
                            <Col sm={8}>
                                <Input type="password" className="input-required mt-1" name="newPassword" id="newPassword" autoComplete="false"
                                    value={newPassword} onKeyPress={(e) => this._handlePressEnter(isValid, e)} onChange={this._handleChange} invalid={isClickedSubmit && !newPasswordValidation.isValid} />
                                {newPasswordValidation.message &&
                                    <FormFeedback><div dangerouslySetInnerHTML={{ __html: newPasswordValidation.message }} /></FormFeedback>}
                            </Col>
                        </FormGroup>

                        <FormGroup row className="mb-2">
                            <Label htmlFor="confirmPassword" sm={4} className="required text-right">Confirm Password</Label>
                            <Col sm={8}>
                                <Input type="password" className="input-required mt-1" name="confirmPassword" id="confirmPassword" autoComplete="false"
                                    value={confirmPassword} onKeyPress={(e) => this._handlePressEnter(isValid, e)} onChange={this._handleChange} invalid={isClickedSubmit && !confirmPasswordValidation.isValid} />
                                {confirmPasswordValidation.message &&
                                    <FormFeedback><div dangerouslySetInnerHTML={{ __html: confirmPasswordValidation.message }} /></FormFeedback>}
                            </Col>
                        </FormGroup>
                    </Form>
                </fieldset>

                <Button type="button" color="success" className="mr-2" disabled={isClickedSubmit ? !isValid : false} onClick={() => this._handleSubmit(isValid)}>Submit</Button>
                <Button type="button" color="info" onClick={this._handleReset}>Reset</Button>
            </div>
        )
    }
}