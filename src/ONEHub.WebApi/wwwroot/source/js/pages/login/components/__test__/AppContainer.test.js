import React from 'react';
import AppContainer from '../AppContainer';
import { shallow } from 'enzyme';

import * as ajaxRequest from '../../../../modules/ajaxRequest';
import * as utils from '../../../../modules/utils';

describe('Login - components - AppContainer', () => {
    beforeEach(() => {
        window.initialState = jest.fn();
        window.initialState.licenseeName = 'Aff';
    })

    it('render correctly', () => {
        const result = shallow(<AppContainer />);
        result.setState({ year: '2019' });

        expect(result).toMatchSnapshot();
    });

    it('handleChange - should call setState when change userName input', () => {
        const event = {
            target: {
                name: 'userName',
                value: 'abc'
            }
        }
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="text"][name="userName"][id="userName"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ userName: 'abc' });
    });

    it('handleChange - should call setState when change password input', () => {
        const event = {
            target: {
                name: 'password',
                value: '123'
            }
        }
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="password"][name="password"][id="password"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ password: '123' });
    });

    it('handlePressEnter - should call handleSubmit when press Enter in userName input', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const wrapper = shallow(<AppContainer />);
        const instance = wrapper.instance();
        instance._handleLogin = jest.fn();

        wrapper.find('Input[type="text"][name="userName"][id="userName"]').simulate('keyPress', event);

        expect(instance._handleLogin).toHaveBeenCalled();
    });

    it('handlePressEnter - should call handleSubmit when press Enter in password input', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const wrapper = shallow(<AppContainer />);
        const instance = wrapper.instance();
        instance._handleLogin = jest.fn();

        wrapper.find('Input[type="password"][name="password"][id="password"]').simulate('keyPress', event);

        expect(instance._handleLogin).toHaveBeenCalled();
    });

    it('handlePressEnter - should not call handleSubmit when press other keyboards', () => {
        const event = { charCode: 123 };
        const wrapper = shallow(<AppContainer />);
        const instance = wrapper.instance();
        instance._handleLogin = jest.fn();

        wrapper.find('Input[type="password"][name="password"][id="password"]').simulate('keyPress', event);

        expect(instance._handleLogin).not.toHaveBeenCalled();
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, val) => fn && fn());

        const instance = wrapper.instance();
        instance._hideMessage = jest.fn();

        instance._handleShowAlert(false, 'Wrong userName or password!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Wrong userName or password!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState', async () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.instance()._hideMessage();

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
    });

    it('_login - should call _validateAccount, post and _handleShowAlert', async () => {
        const expectedResult = { data: { Message: "Wrong user name or password" } };
        const wrapper = shallow(<AppContainer />);
        wrapper.setState({ userName: 'abc', password: '123' });
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, val) => fn && fn());

        const instance = wrapper.instance();
        instance._validateAccount = jest.fn(() => true);
        instance._handleShowAlert = jest.fn();
        ajaxRequest.post = jest.fn(() => expectedResult);

        await instance._login();

        expect(instance._validateAccount).toHaveBeenCalledWith('abc', '123');
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Auth/Login', { "password": "123", "userName": "abc" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Wrong user name or password");
    });

    it('_login - should call _validateAccount, post and resolveClientUrl with Portal/Home', async () => {
        const expectedResult = { data: { IsSuccessful: true, Message: "OK" } };
        const wrapper = shallow(<AppContainer />);
        wrapper.setState({ userName: 'sa', password: '1234aa' });
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, val) => fn && fn());

        const instance = wrapper.instance();
        instance._validateAccount = jest.fn(() => true);
        utils.resolveClientUrl = jest.fn();
        ajaxRequest.post = jest.fn(() => expectedResult);

        await instance._login();

        expect(instance._validateAccount).toHaveBeenCalledWith('sa', '1234aa');
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Auth/Login', { "password": "1234aa", "userName": "sa" });
        expect(utils.resolveClientUrl).toHaveBeenCalledWith("Portal/Home");
    });

    it('_login - should call _validateAccount, post and _handleShowAlert with response is error', async () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState({ userName: 'sa', password: '1234aa' });

        const instance = wrapper.instance();
        instance._validateAccount = jest.fn(() => true);
        instance._handleShowAlert = jest.fn();
        ajaxRequest.post = jest.fn(() => null);

        await instance._login();

        expect(instance._validateAccount).toHaveBeenCalledWith('sa', '1234aa');
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Auth/Login', { "password": "1234aa", "userName": "sa" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "An error occurred while processing your request");
    });

    it('_login - should only call _validateAccount', async () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState({ userName: '', password: '1234aa' });

        const instance = wrapper.instance();
        instance._validateAccount = jest.fn(() => false);

        await instance._login();

        expect(instance._validateAccount).toHaveBeenCalledWith('', '1234aa');
    });

    it('_handleLogin - should only call setState', () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleLogin();

        expect(wrapper.setState).toHaveBeenCalled();
    });

    it('_validateAccount - should return true', () => {
        const wrapper = shallow(<AppContainer />);

        const instance = wrapper.instance();

        const result = instance._validateAccount('abc', '123')

        expect(result).toEqual(true);
    });

    it('_validateAccount - should return false with empty username', () => {
        const wrapper = shallow(<AppContainer />);

        const instance = wrapper.instance();

        const result = instance._validateAccount('', '123')

        expect(result).toEqual(false);
    });

    it('_validateAccount - should return false with empty password', () => {
        const wrapper = shallow(<AppContainer />);

        const instance = wrapper.instance();

        const result = instance._validateAccount('abc', '')

        expect(result).toEqual(false);
    });
});