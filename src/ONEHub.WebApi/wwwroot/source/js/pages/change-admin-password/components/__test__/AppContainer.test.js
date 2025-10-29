import React from 'react';
import AppContainer from '../AppContainer';
import { shallow } from 'enzyme';

import * as ajaxRequest from '../../../../modules/ajaxRequest';

describe('change admin password - components - AppContainer', () => {
    it('render correctly with empty password', () => {
        const result = shallow(<AppContainer />);

        expect(result).toMatchSnapshot();
    });


    it('render correctly with correct password', () => {
        const result = shallow(<AppContainer />);
        result.setState({ oldPassword: '123', newPassword: '123abc', confirmPassword: '123abc', isSuccess: false, isClickedSubmit: true });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with incorrect password', () => {
        const result = shallow(<AppContainer />);
        result.setState({ oldPassword: '123', newPassword: '123', confirmPassword: '123abc' });

        expect(result).toMatchSnapshot();
    });

    it('handleChange - should call setState when change old password input', () => {
        const event = {
            target: {
                name: 'oldPassword',
                value: 'abc'
            }
        }
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="password"][name="oldPassword"][id="oldPassword"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ oldPassword: 'abc' });
    });

    it('handleChange - should call setState when change new password input', () => {
        const event = {
            target: {
                name: 'newPassword',
                value: '123'
            }
        }
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="password"][name="newPassword"][id="newPassword"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ newPassword: '123' });
    });

    it('handleChange - should call setState when change confirm password input', () => {
        const event = {
            target: {
                name: 'confirmPassword',
                value: '123'
            }
        }
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="password"][name="confirmPassword"][id="confirmPassword"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ confirmPassword: '123' });
    });

    it('handlePressEnter - should call handleSubmit when press Enter in old password input', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const wrapper = shallow(<AppContainer />);
        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        wrapper.find('Input[type="password"][name="oldPassword"][id="oldPassword"]').simulate('keyPress', event);

        expect(instance._handleSubmit).toHaveBeenCalled();
    });

    it('handlePressEnter - should call handleSubmit when press Enter in new password input', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const wrapper = shallow(<AppContainer />);
        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        wrapper.find('Input[type="password"][name="newPassword"][id="newPassword"]').simulate('keyPress', event);

        expect(instance._handleSubmit).toHaveBeenCalled();
    });

    it('handlePressEnter - should call handleSubmit when press Enter in confirm password input', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const wrapper = shallow(<AppContainer />);
        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        wrapper.find('Input[type="password"][name="confirmPassword"][id="confirmPassword"]').simulate('keyPress', event);

        expect(instance._handleSubmit).toHaveBeenCalled();
    });

    it('handlePressEnter - should not call handleSubmit when press other keyboards', () => {
        const event = { charCode: 123 };
        const wrapper = shallow(<AppContainer />);
        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        wrapper.find('Input[type="password"][name="oldPassword"][id="oldPassword"]').simulate('keyPress', event);

        expect(instance._handleSubmit).not.toHaveBeenCalled();
    });

    it('_handleShowAlert - should call setState, setTimeout and _handleReset', () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance._handleShowAlert(false, 'Old password is incorrect!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Old password is incorrect!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState', async () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.instance()._hideMessage(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
    });

    it('_hideMessage - should call setState and _handleReset', async () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();
        wrapper.instance()._handleReset = jest.fn();

        wrapper.instance()._hideMessage(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(wrapper.instance()._handleReset).toHaveBeenCalled();
    });

    it('_handleReset - should call setState', async () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleReset();

        expect(wrapper.setState).toHaveBeenCalledWith({
            isClickedSubmit: false,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            isShowMessage: false,
            isSuccess: true,
            message: ''
        });
    });

    it('_handleSubmit - should only call setState', () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        wrapper.find('Button[type="button"]').at(0).simulate('click');

        expect(wrapper.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
    });

    it('_handleSubmit - should call setState and _handleShowAlert with success', async () => {
        const expectedResult = { data: { IsSuccessful: true, Message: "" } };
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        const instance = wrapper.instance();
        instance._handleShowAlert = jest.fn();
        ajaxRequest.post = jest.fn(() => expectedResult);

        await instance._handleSubmit(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/ChangeAdminPassword/ChangePassword', { oldPassword: "", newPassword: "", confirmPassword: "" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Change password is successful!");
    });

    it('_handleSubmit - should call setState and _handleShowAlert with failed', async () => {
        const expectedResult = { data: { IsSuccessful: false, Message: 'Old password is incorrect!' } };
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        const instance = wrapper.instance();
        instance._handleShowAlert = jest.fn();
        ajaxRequest.post = jest.fn(() => expectedResult);

        await instance._handleSubmit(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/ChangeAdminPassword/ChangePassword', { oldPassword: "", newPassword: "", confirmPassword: "" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, 'Old password is incorrect!');
    });

    it('_handleSubmit - should call setState and _handleShowAlert with failed', async () => {
        const wrapper = shallow(<AppContainer />);
        wrapper.setState = jest.fn();

        const instance = wrapper.instance();
        instance._handleShowAlert = jest.fn();
        ajaxRequest.post = jest.fn(() => null);

        await instance._handleSubmit(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/ChangeAdminPassword/ChangePassword', { oldPassword: "", newPassword: "", confirmPassword: "" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, 'Change password is failed!');
    });
});