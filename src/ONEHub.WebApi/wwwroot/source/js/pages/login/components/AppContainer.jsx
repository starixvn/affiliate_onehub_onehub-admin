import React, { PureComponent } from 'react';
import { Alert, Form, FormGroup, Label, Input } from 'reactstrap';
import Loader from '../../../components/Loader';

import { post } from '../../../modules/ajaxRequest';
import { resolveClientUrl } from '../../../modules/utils';

export default class AppContainer extends PureComponent {
    constructor(props) {
        super(props);

        const now = new Date();
        this.state = {
            userName: '',
            password: '',
            isShowMessage: false,
            message: '',
            year: now.getFullYear(),
            isShowLoader: false
        }
    }

    _handleShowAlert = (isSuccess, message) => {
        this.setState({
            message,
            isSuccess,
            isShowMessage: true,
        }, () => window.setTimeout(this._hideMessage, 3000));
    }

    _hideMessage = () => {
        this.setState({
            isShowMessage: false
        });
    }

    _validateAccount = (userName, password) => {
        const isValidUserName = !!userName;
        if (isValidUserName && !!password) {
            return true;
        }

        this._handleShowAlert(false, !isValidUserName ? 'User Name is empty. Please check!' : 'Password is empty. Please check!');
        return false;
    }

    _handleLogin = () => {
        !this.state.isShowLoader && this.setState({ isShowLoader: true }, this._login);
    }

    _login = async () => {
        const { userName, password } = this.state;

        const isValidAccount = this._validateAccount(userName, password);

        if (isValidAccount) {
            const param = { userName, password };
            const response = await post('auth/login', param);

            if (response) {
                const { data } = response;

                // JWT is now stored in HttpOnly cookie by the server
                // No need to store in localStorage
                if (data.IsSuccessful) {
                    window.location.href = '/portal/home';
                    return;
                } else {
                    this._handleShowAlert(false, data.Message || "Login failed");
                }
            } else {
                this._handleShowAlert(false, "An error occurred while processing your request");
            }
        }

        this.setState({ isShowLoader: false });
    }

    _handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault()
            this._handleLogin();
        }
    }

    _handleChange = (event) => {
        const target = event.target;

        this.setState({ [target.name]: target.value });
    }

    render() {
        const { userName, password, isShowMessage, message, year, isShowLoader } = this.state;
        const { licenseeName } = window.initialState;

        return (
            <div className="login-container">
                <Loader show={isShowLoader} />
                <div className="lgRp">
                    <div className="login-header">
                        <div>
                            <div>Welcome to {licenseeName}<span> Login</span></div>
                            <p>Please sign in to continue to work</p>
                        </div>
                    </div>
                    <div className="war-box">
                        <Alert color='danger' isOpen={isShowMessage}>
                            <div dangerouslySetInnerHTML={{ __html: message }}></div>
                        </Alert>
                    </div>

                    <Form tag="form" className="form-login" autoComplete="false">
                        <FormGroup>
                            <Label htmlFor="userName" className="form-login-text">User Name</Label>
                            <div>
                                <Input type="text" name="userName" id="userName" value={userName}
                                    onKeyPress={this._handlePressEnter} onChange={this._handleChange} />
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="passWord" className="form-login-text">Password</Label>
                            <div>
                                <Input type="password" name="password" id="password" autoComplete="false"
                                    value={password} onKeyPress={this._handlePressEnter} onChange={this._handleChange} />
                            </div>
                        </FormGroup>

                        <div className="bt">
                            <a href="javascript:;" className="bt-login" onClick={this._handleLogin} >Log On</a>
                        </div>
                    </Form>
                </div>

                <div className="foot">
                    <span className="foot-rp">{`© Copyright ${year} ${licenseeName}. All Rights Reserved | 21+`}</span>
                </div>
            </div>
        )
    }
}