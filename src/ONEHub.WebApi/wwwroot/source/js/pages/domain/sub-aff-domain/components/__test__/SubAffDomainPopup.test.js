import React from 'react';
import { SubAffDomainPopup } from '../SubAffDomainPopup';
import { shallow } from 'enzyme';

describe('sub-affiliate domain - components - SubAffDomainPopup ', () => {
    const emptySubAffDomain = {
        domainId: 0,
        domainName: '',
        isSSL: false
    };

    const selectedSubAffDomain = {
        domainId: 123,
        domainName: 'abc.com',
        isSSL: true
    };

    const defaultProps = {
        selectedSubAffDomain
    };

    it('render correctly with insert', () => {
        const props = Object.assign({}, defaultProps, { selectedSubAffDomain: emptySubAffDomain });
        const result = shallow(<SubAffDomainPopup {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with update', () => {
        const result = shallow(<SubAffDomainPopup {...defaultProps} />);
        result.setState({ isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with not show popup', () => {
        const props = Object.assign({}, defaultProps, { selectedSubAffDomain: null });
        const result = shallow(<SubAffDomainPopup {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate should call setState', () => {
        const props = Object.assign({}, defaultProps, { selectedSubAffDomain: emptySubAffDomain });
        const result = shallow(<SubAffDomainPopup {...props} />);

        result.setState = jest.fn();

        result.instance().componentDidUpdate(defaultProps);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: true });
    });

    it('_handleChange should be called when change sub-affiliate domain name', () => {
        const event = {
            target: {
                type: 'text',
                name: 'domainName',
                value: '123'
            }
        };
        const props = Object.assign({}, defaultProps, { setSelectedSubAffDomain: jest.fn() })
        const result = shallow(<SubAffDomainPopup {...props} />);

        result.find('Input[type="text"][name="domainName"]').simulate('change', event);

        expect(props.setSelectedSubAffDomain).toHaveBeenCalledWith({ "domainId": 123, "domainName": "123", "isSSL": true });
    });

    it('_handleChange should be called when change checkbox', () => {
        const event = {
            target: {
                type: 'checkbox',
                name: 'isSSL',
                checked: false
            }
        };

        const props = Object.assign({}, defaultProps, { setSelectedSubAffDomain: jest.fn() })
        const result = shallow(<SubAffDomainPopup {...props} />);

        result.find('input[type="checkbox"][name="isSSL"]').simulate('change', event);

        expect(props.setSelectedSubAffDomain).toHaveBeenCalledWith({ "domainId": 123, "domainName": "abc.com", "isSSL": false });
    });

    it('_handleSubmit - should be called toggleLoader and _handleShowAlert with sub-affiliate domain is empty', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), selectedSubAffDomain: emptySubAffDomain });
        const wrapper = shallow(<SubAffDomainPopup {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Please input Sub-Affiliate Domain's name!");
    });

    it('_handleSubmit - should be called toggleLoader, insertSubAffDomain and _handleShowAlert with with insert successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { insertSubAffDomain: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<SubAffDomainPopup {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Add Sub-Affiliate Domain is successful!");
    });

    it('_handleSubmit - should be called toggleLoader, insertSubAffDomain and _handleShowAlert with with insert is failed', async () => {
        const result = { IsSuccessful: false, Message: "Adding has a error" };
        const props = Object.assign({}, defaultProps, { insertSubAffDomain: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<SubAffDomainPopup {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Adding has a error");
    });

    it('_handleSubmit - should be called toggleLoader, insertSubAffDomain and _handleShowAlert with with insert is errored', async () => {
        const props = Object.assign({}, defaultProps, { insertSubAffDomain: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<SubAffDomainPopup {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Add Sub-Affiliate Domain is failed!");
    });

    it('_handleSubmit - should be called toggleLoader, updateSubAffDomain and _handleShowAlert with with update successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { updateSubAffDomain: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<SubAffDomainPopup {...props} />);
        wrapper.setState({ isInsert: false });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Update Sub-Affiliate Domain is successful!");
    });

    it('_handleSubmit - should be called toggleLoader, updateSubAffDomain and _handleShowAlert with with update is failed', async () => {
        const result = { IsSuccessful: false, Message: "Update has a error" };
        const props = Object.assign({}, defaultProps, { updateSubAffDomain: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<SubAffDomainPopup {...props} />);
        wrapper.setState({ isInsert: false });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Update has a error");
    });

    it('_handleSubmit - should be called toggleLoader, updateSubAffDomain and _handleShowAlert with with update is errored', async () => {
        const props = Object.assign({}, defaultProps, { updateSubAffDomain: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<SubAffDomainPopup {...props} />);
        wrapper.setState({ isInsert: false });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Update Sub-Affiliate Domain is failed!");
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', async () => {
        const wrapper = shallow(<SubAffDomainPopup {...defaultProps} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance._handleShowAlert(false, 'Updated failed!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Updated failed!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState, fetchData and setSelectedSubAffDomain', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn(), setSelectedSubAffDomain: jest.fn() });
        const wrapper = shallow(<SubAffDomainPopup {...props} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(props.fetchData).toHaveBeenCalled();
        expect(props.setSelectedSubAffDomain).toHaveBeenCalledWith(null);
    });

    it('_hideMessage - should call setState and not call fetchData', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const wrapper = shallow(<SubAffDomainPopup {...props} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(props.fetchData).not.toHaveBeenCalled();
    });

    it('_handlePressEnter - should call _handleSubmit when press enter in sub-affiliate domain name textbox', () => {
        const event = {
            charCode: 13,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<SubAffDomainPopup {...defaultProps} />);
        wrapper.instance()._handleSubmit = jest.fn();

        wrapper.find('Input[type="text"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(wrapper.instance()._handleSubmit).toHaveBeenCalled();
    });

    it('_handlePressEnter - should not call _handleSubmit when press other keys', () => {
        const event = {
            charCode: 16,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<SubAffDomainPopup {...defaultProps} />);

        wrapper.find('Input[type="text"]').simulate('keyPress', event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('_handleClosePopup - should call setSelectedSubAffDomain', () => {
        const props = Object.assign({}, defaultProps, { setSelectedSubAffDomain: jest.fn() })
        const wrapper = shallow(<SubAffDomainPopup {...props} />);

        wrapper.instance()._handleClosePopup();

        expect(props.setSelectedSubAffDomain).toHaveBeenCalledWith(null);
    });
})