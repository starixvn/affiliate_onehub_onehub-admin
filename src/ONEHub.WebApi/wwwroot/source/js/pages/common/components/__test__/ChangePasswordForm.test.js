import React from 'react';
import { ChangePasswordForm } from '../ChangePasswordForm';
import { shallow } from 'enzyme';

describe('common - components - ChangePasswordForm', () => {
    const defaultProps = { showPopupPassword: true, selectedId: 1271808 };

    it('render correctly', () => {
        const result = shallow(<ChangePasswordForm {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with correct Password', () => {
        const result = shallow(<ChangePasswordForm {...defaultProps} />);
        result.setState({ password: '123abc', confirmPassword: '123abc', isClickedSubmit: true, isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('_handlePressEnter - should be called when press Enter in Password input', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const result = shallow(<ChangePasswordForm {...defaultProps} />);
        result.instance()._handlePressEnter = jest.fn();

        result.find('Input[type="password"][id="Password"]').simulate('keyPress', event);

        expect(result.instance()._handlePressEnter).toHaveBeenCalledWith(false, event);
    });

    it('_handlePressEnter - should be called when press Enter in Confirm Password input', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const result = shallow(<ChangePasswordForm {...defaultProps} />);
        result.instance()._handlePressEnter = jest.fn();

        result.find('Input[type="password"][id="ConfirmPassword"]').simulate('keyPress', event);

        expect(result.instance()._handlePressEnter).toHaveBeenCalledWith(false, event);
    });

    it('_handlePressEnter - should call preventDefault and handleSubmit', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const result = shallow(<ChangePasswordForm {...defaultProps} />);
        const instance = result.instance();
        instance.handleSubmit = jest.fn();

        instance._handlePressEnter(false, event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(instance.handleSubmit).toHaveBeenCalledWith(false);
    });

    it('_handlePressEnter - should not call preventDefault and handleSubmit', () => {
        const event = { charCode: 12, preventDefault: jest.fn() };
        const result = shallow(<ChangePasswordForm {...defaultProps} />);
        const instance = result.instance();
        instance.handleSubmit = jest.fn();

        instance._handlePressEnter(false, event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(instance.handleSubmit).not.toHaveBeenCalled();
    });

    it('handleChange - should setState', () => {
        const event = { target: { name: "password", value: '123abc' } };
        const result = shallow(<ChangePasswordForm {...defaultProps} />);
        result.setState = jest.fn();

        result.instance().handleChange(event);

        expect(result.setState).toHaveBeenCalledWith({ password: '123abc' });
    });

    it('handleClosePopup - should call props.setShowPopupPassword and setState', () => {
        const props = Object.assign({}, { setShowPopupPassword: jest.fn() });
        const result = shallow(<ChangePasswordForm {...props} />);
        result.setState = jest.fn();

        result.instance().handleClosePopup();

        expect(props.setShowPopupPassword).toHaveBeenCalledWith(false);
        expect(result.setState).toHaveBeenCalledWith({ password: '', confirmPassword: '', isClickedSubmit: false });
    });

    it('hideMessage - should call setState', () => {
        const result = shallow(<ChangePasswordForm />);
        result.setState = jest.fn();

        result.instance().hideMessage();

        expect(result.setState).toHaveBeenCalledWith({ isShowMessage: false });
    });

    it('handleSubmit - should be called when click Submit button', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const result = shallow(<ChangePasswordForm {...defaultProps} />);
        result.setState({ password: '123', confirmPassword: 'abc', isClickedSubmit: true });
        result.instance().handleSubmit = jest.fn();

        result.find('Button').at(0).simulate('click', event);

        expect(result.instance().handleSubmit).toHaveBeenCalledWith(false);
    });

    it('handleSubmit - should call setState', () => {
        const result = shallow(<ChangePasswordForm {...defaultProps} />);
        result.setState = jest.fn();

        result.instance().handleSubmit(false);

        expect(result.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
    });

    it('handleSubmit - should call setState and saveChangePassword', () => {
        const result = shallow(<ChangePasswordForm {...defaultProps} />);
        const instance = result.instance();
        instance.setState = jest.fn();
        instance.saveChangePassword = jest.fn();

        instance.handleSubmit(true);

        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(instance.saveChangePassword).toHaveBeenCalledWith({ AffId: 1271808, Password: '', ConfirmPassword: '' });
    });

    it('handleSubmit - should call setState and saveChangePassword with is Admin', () => {
        const props = Object.assign({}, defaultProps, { isAdmin: true });
        const result = shallow(<ChangePasswordForm {...props} />);
        const instance = result.instance();
        instance.setState = jest.fn();
        instance.saveChangePassword = jest.fn();

        instance.handleSubmit(true);

        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(instance.saveChangePassword).toHaveBeenCalledWith({ AccountId: 1271808, Password: '', ConfirmPassword: '' });
    });

    it('handleSubmit - should call setState and saveChangePassword with is Admin', () => {
        const props = Object.assign({}, defaultProps, { isAdmin: true });
        const result = shallow(<ChangePasswordForm {...props} />);
        const instance = result.instance();
        instance.setState = jest.fn();
        instance.saveChangePassword = jest.fn();

        instance.handleSubmit(true);

        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(instance.saveChangePassword).toHaveBeenCalledWith({ AccountId: 1271808, Password: '', ConfirmPassword: '' });
    });

    it('saveChangePassword - should call updateChangeAffPasswword successfully', async () => {
        const param = { AffId: 1271808, Password: '123abc', ConfirmPassword: '123abc' };
        const expectedResponse = { IsSuccessful: true };
        const props = Object.assign({}, defaultProps, { updateChangeAffPasswword: jest.fn(() => expectedResponse) });
        const result = shallow(<ChangePasswordForm {...props} />);
        const instance = result.instance();
        instance.handleClosePopup = jest.fn();
        instance.hideMessage = jest.fn();
        instance.setState = jest.fn((obj, fn) => fn && fn());

        await instance.saveChangePassword(param);

        expect(props.updateChangeAffPasswword).toHaveBeenCalledWith(param);
        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isShowMessage: true, isSuccess: true, message: 'Change password successfully!' });
        expect(instance.setState.mock.calls[0][1]).toEqual(expect.any(Function));
    });

    it('saveChangePassword - should call updateChangeAffPasswword failed', async () => {
        const param = { AffId: 1271808, Password: '123abc', ConfirmPassword: '123abc' };
        const expectedResponse = { IsSuccessful: false, Message: 'Failed!' };
        const props = Object.assign({}, defaultProps, { updateChangeAffPasswword: jest.fn(() => expectedResponse) });
        const result = shallow(<ChangePasswordForm {...props} />);
        const instance = result.instance();
        instance.handleClosePopup = jest.fn();
        instance.hideMessage = jest.fn();
        instance.setState = jest.fn((obj, fn) => fn && fn());

        await instance.saveChangePassword(param);

        expect(props.updateChangeAffPasswword).toHaveBeenCalledWith(param);
        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isShowMessage: true, isSuccess: false, message: 'Failed!' });
        expect(instance.setState.mock.calls[0][1]).toEqual(expect.any(Function));
    });

    it('saveChangePassword - should call updateChangeAdminPasswword error', async () => {
        const param = { AffId: 1271808, Password: '123abc', ConfirmPassword: '123abc' };
        const props = Object.assign({}, defaultProps, { updateChangeAdminPasswword: jest.fn(), isAdmin: true });
        const result = shallow(<ChangePasswordForm {...props} />);
        const instance = result.instance();
        instance.handleClosePopup = jest.fn();
        instance.hideMessage = jest.fn();
        instance.setState = jest.fn((obj, fn) => fn && fn());

        await instance.saveChangePassword(param);

        expect(props.updateChangeAdminPasswword).toHaveBeenCalledWith(param);
        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isShowMessage: true, isSuccess: false, message: 'Change password is failed!' });
        expect(instance.setState.mock.calls[0][1]).toEqual(expect.any(Function));
    });
});