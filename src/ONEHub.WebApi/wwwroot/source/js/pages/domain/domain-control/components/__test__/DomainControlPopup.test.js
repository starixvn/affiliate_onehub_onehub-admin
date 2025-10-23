import React from 'react';
import { DomainControlPopup } from '../DomainControlPopup';
import { shallow } from 'enzyme';
import Select from '../../../../../components/select';

describe('domain control - components - DomainControlPopup ', () => {
    const targetCountryList = [
        {
            TargetCountryCode: "MY",
            TargetCountryName: "Malaysia"
        },
        {
            TargetCountryCode: "VN",
            TargetCountryName: "VietNam"
        }
    ]

    const affDomainList = [
        {
            DomainId: 21,
            DomainName: "10.18.200.209:7613/Go"
        },
        {
            DomainId: 34,
            DomainName: "go.test.com"
        }
    ]

    const redirectDomainList = [
        {
            DomainId: 46,
            DomainName: "smart.123.vn"
        },
        {
            DomainId: 60,
            DomainName: "12liammobile"
        }
    ]

    const emptyDomain = {
        domainId: 0,
        targetCountryCode: 'MY',
        affDomainId: 21,
        redirectDomainId: 46,
        isUsed: false
    };

    const selectedDomain = {
        domainId: 89,
        targetCountryCode: 'VN',
        affDomainId: 34,
        redirectDomainId: 60,
        isUsed: true
    };

    const domainControl = {
        DomainId: 89,
        TargetCountryCode: 'VN',
        AffDomainId: 34,
        RedirectDomainId: 60,
        IsUsed: true
    };


    const defaultProps = {
        selectedtargetCountryCode: 'en-GB',
        affDomainList,
        redirectDomainList,
        targetCountryList,
        selectedDomainId: 89,
        affSubDomainList: [
            {
                columnKey: "test",
                columnName: "test",
                checked: true
            }
        ]
    };

    it('render correctly with insert', () => {
        const props = Object.assign({}, defaultProps, { selectedDomainId: 0 });
        const result = shallow(<DomainControlPopup {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with update', () => {
        const result = shallow(<DomainControlPopup {...defaultProps} />);
        result.setState({ isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with not show popup', () => {
        const props = Object.assign({}, defaultProps, { selectedDomainId: null });
        const result = shallow(<DomainControlPopup {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate should call setState', () => {
        const props = Object.assign({}, defaultProps, { selectedDomainId: 1 });
        const result = shallow(<DomainControlPopup {...props} />);
        const instance = result.instance();
        instance._handleUpdateState = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(instance._handleUpdateState).toHaveBeenCalledWith(1);
    });

    it('_handleUpdateState - with insert - should call getTargetCountryListByDomains and setState', async () => {
        const props = Object.assign({}, defaultProps, { getTargetCountryListByDomains: jest.fn(() => targetCountryList), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._handleUpdateState(0);

        expect(props.getTargetCountryListByDomains).toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalled();
    });

    it('_handleUpdateState - with insert - should call getTargetCountryListByDomains and setState with empty market', async () => {
        const props = Object.assign({}, defaultProps, { getTargetCountryListByDomains: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._handleUpdateState(0);

        expect(props.getTargetCountryListByDomains).toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalled();
    });

    it('_handleUpdateState - with insert - should not call getTargetCountryListByDomains and setState', async () => {
        const props = Object.assign({}, defaultProps, { getTargetCountryListByDomains: jest.fn(), toggleLoader: jest.fn(), affDomainList: [] });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._handleUpdateState(0);

        expect(props.getTargetCountryListByDomains).not.toHaveBeenCalled();
        expect(instance.setState).not.toHaveBeenCalled();
    });

    it('_handleUpdateState - with update - should call toggleLoader, getDomainControlById, getTargetCountryListByDomains and setState', async () => {
        const props = Object.assign({}, defaultProps, { getTargetCountryListByDomains: jest.fn(() => targetCountryList), getDomainControlById: jest.fn(() => domainControl), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._handleUpdateState(89);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(props.getDomainControlById).toHaveBeenCalled();
        expect(props.getTargetCountryListByDomains).toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalled();
    });

    it('_handleUpdateState - with update - should call toggleLoader, getDomainControlById and setSelectedDomainId', async () => {
        const props = Object.assign({}, defaultProps, { getDomainControlById: jest.fn(), toggleLoader: jest.fn(), setSelectedDomainId: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._handleUpdateState(123);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(props.getDomainControlById).toHaveBeenCalled();
        expect(props.setSelectedDomainId).toHaveBeenCalledWith(null);
        expect(instance.setState).not.toHaveBeenCalled();
    });

    it('_handleChange should be called when change market', () => {
        const event = {
            target: {
                type: 'select',
                name: 'targetCountryCode',
                value: 'MY'
            }
        };

        const result = shallow(<DomainControlPopup {...defaultProps} />);
        result.setState({ selectedDomain, targetCountryListByDomains: targetCountryList });
        result.setState = jest.fn();
        result.find('Input[type="select"][name="targetCountryCode"]').simulate('change', event);

        expect(result.setState).toHaveBeenCalledWith({ selectedDomain: { ...selectedDomain, targetCountryCode: 'MY' } });
    });

    it('_handleChange should be called when change status', () => {
        const event = {
            target: {
                type: 'checkbox',
                name: 'status',
                checked: false
            }
        };

        const result = shallow(<DomainControlPopup {...defaultProps} />);
        result.setState({ selectedDomain });
        result.setState = jest.fn();
        result.find('input[type="checkbox"][name="isUsed"]').simulate('change', event);

        expect(result.setState).toHaveBeenCalledWith({ selectedDomain: { domainId: 89, targetCountryCode: 'VN', isUsed: true, affDomainId: 34, redirectDomainId: 60, status: false } });
    });

    it('_handleChangeDomain should be called when change aff domain', () => {
        const result = shallow(<DomainControlPopup {...defaultProps} />);
        result.setState({ selectedDomain });
        result.instance()._handleChangeDomain = jest.fn();
        result.find(Select).at(0).simulate('change', 1);

        expect(result.instance()._handleChangeDomain).toHaveBeenCalledWith("affDomainId", 1);
    });

    it('_handleChangeDomain should be called when change redirect domain', () => {
        const result = shallow(<DomainControlPopup {...defaultProps} />);
        result.setState({ selectedDomain });
        result.instance()._handleChangeDomain = jest.fn();
        result.instance()._handleChangeDomain = jest.fn();
        result.find(Select).at(1).simulate('change', 2);

        expect(result.instance()._handleChangeDomain).toHaveBeenCalledWith("redirectDomainId", 2);
    });

    it('_handleChangeDomain - should call toggleLoader, getTargetCountryListByDomains and setState', async () => {
        const props = Object.assign({}, defaultProps, { getTargetCountryListByDomains: jest.fn(() => targetCountryList), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._handleChangeDomain("AffDomainId", 123);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(props.getTargetCountryListByDomains).toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalled();
    });

    it('_handleChangeDomain - should call toggleLoader, getTargetCountryListByDomains and setState with empty targetCountryList', async () => {
        const props = Object.assign({}, defaultProps, { getTargetCountryListByDomains: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._handleChangeDomain("AffDomainId", 123);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(props.getTargetCountryListByDomains).toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalled();
    });

    it('_handleSubmit - should call toggleLoader, insertDomain and _handleShowAlert with with insert successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { insertDomain: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState({ selectedDomain: emptyDomain });
        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Add Successfully!");
    });

    it('_handleSubmit - should call toggleLoader, insertDomain and _handleShowAlert with with insert is failed', async () => {
        const result = { IsSuccessful: false, Message: "Adding has a error" };
        const props = Object.assign({}, defaultProps, { insertDomain: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState({ selectedDomain: emptyDomain });
        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Adding has a error");
    });

    it('_handleSubmit - should call toggleLoader, insertDomain and _handleShowAlert with with insert is errored', async () => {
        const props = Object.assign({}, defaultProps, { insertDomain: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        const instance = wrapper.instance();
        instance.setState({ selectedDomain: emptyDomain });
        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Add Domain is failed!");
    });

    it('_handleSubmit - should call toggleLoader, updateDomain and _handleShowAlert with with update successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { updateDomain: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        wrapper.setState({ isInsert: false });
        const instance = wrapper.instance();
        instance.setState({ selectedDomain });
        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Update Successfully!");
    });

    it('_handleSubmit - should call toggleLoader, updateDomain and _handleShowAlert with with update is failed', async () => {
        const result = { IsSuccessful: false, Message: "Update has a error" };
        const props = Object.assign({}, defaultProps, { updateDomain: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        wrapper.setState({ isInsert: false });
        const instance = wrapper.instance();
        instance.setState({ selectedDomain });
        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Update has a error");
    });

    it('_handleSubmit - should call toggleLoader, updateDomain and _handleShowAlert with with update is errored', async () => {
        const props = Object.assign({}, defaultProps, { updateDomain: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        wrapper.setState({ isInsert: false });
        const instance = wrapper.instance();
        instance.setState({ selectedDomain });
        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Update Domain is failed!");
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', async () => {
        const wrapper = shallow(<DomainControlPopup {...defaultProps} />);
        wrapper.setState({ selectedDomain });
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, val) => fn && fn());

        const instance = wrapper.instance();
        instance._hideMessage = jest.fn();
        instance._handleShowAlert(false, 'Updated failed!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Updated failed!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState, fetchData and _handleClosePopup', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(props.fetchData).toHaveBeenCalled();
        expect(instance._handleClosePopup).toHaveBeenCalled();
    });

    it('_hideMessage - should call setState and not call fetchData', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const wrapper = shallow(<DomainControlPopup {...props} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(props.fetchData).not.toHaveBeenCalled();
    });

    it('_handleClosePopup - should call setSelectedDomainId', () => {
        const props = Object.assign({}, defaultProps, { setSelectedDomainId: jest.fn() })
        const wrapper = shallow(<DomainControlPopup {...props} />);

        wrapper.instance()._handleClosePopup();

        expect(props.setSelectedDomainId).toHaveBeenCalledWith(null);
    });
})