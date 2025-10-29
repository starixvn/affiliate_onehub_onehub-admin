import React from 'react';
import { EditPolicyForm } from '../EditPolicyForm';
import { shallow } from 'enzyme';

describe('administrator - common - components - EditPolicyForm ', () => {
    const gridData = [
        {
            FuncDesc: "User Control",
            FuncId: 21,
            GPolicy: 3,
            ParentId: 21,
            Policy: 3
        },
        {
            FuncDesc: "Affiliate",
            FuncId: 22,
            GPolicy: 1,
            ParentId: 22,
            Policy: 1
        },
        {
            FuncDesc: "Payment",
            FuncId: 23,
            GPolicy: 0,
            ParentId: 23,
            Policy: 0
        }
    ];

    const checkedPolicies = {
        21: {
            groupPermission: { HasRead: true, HasHost: true },
            individualPermission: { HasRead: true, HasHost: true }
        },
        22: {
            groupPermission: { HasRead: true, HasHost: false },
            individualPermission: { HasRead: true, HasHost: false }
        },
        23: {
            groupPermission: { HasRead: false, HasHost: true },
            individualPermission: { HasRead: false, HasHost: true }
        },
        24: {
            groupPermission: { HasRead: false, HasHost: false },
            individualPermission: { HasRead: false, HasHost: false }
        }
    }

    const defaultProps = {
        selectedId: 123,
        name: 'abc',
        isShowPopup: true,
        closePopup: jest.fn(),
        isAccountPolicy: true,
        isGetByIdList: false
    };

    it('render correctly with Role Policy', () => {
        const props = Object.assign({}, defaultProps, { isAccountPolicy: false });
        const result = shallow(<EditPolicyForm {...props} />);
        result.setState({ data: gridData, checkedPolicies });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with Account Policy', () => {
        const result = shallow(<EditPolicyForm {...defaultProps} />);
        result.setState({ data: gridData, checkedPolicies, isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with Group Account Policy', () => {
        const props = Object.assign({}, defaultProps, { isGetByIdList: true });
        const result = shallow(<EditPolicyForm {...props} />);
        result.setState({ data: gridData, checkedPolicies });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with data empty', () => {
        const result = shallow(<EditPolicyForm {...defaultProps} />);
        result.setState({ data: [], checkedPolicies });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with data empty wwith role policy', () => {
        const props = Object.assign({}, defaultProps, { isAccountPolicy: false });
        const result = shallow(<EditPolicyForm {...props} />);
        result.setState({ data: [], checkedPolicies });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call _handleGetPolicyList', () => {
        const props = Object.assign({}, defaultProps, { selectedId: 234 });
        const result = shallow(<EditPolicyForm {...props} />);
        const instance = result.instance();
        instance._handleGetPolicyList = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(instance._handleGetPolicyList).toHaveBeenCalledWith(234, true, false);
    });

    it('_handleGetPolicyList - should call getRolePolicy and setState', async () => {
        const expectResult = {
            data: {
                FuncDesc: "User Control",
                FuncId: 21,
                ParentId: 21,
                Policy: 3
            },
            checkedPolicies: {
                groupPermission: { HasRead: true, HasHost: true },
                individualPermission: {}
            }
        }
        const props = Object.assign({}, defaultProps, { getRolePolicy: jest.fn(() => expectResult) });
        const result = shallow(<EditPolicyForm {...props} />);
        const instance = result.instance();

        result.setState = jest.fn();

        await instance._handleGetPolicyList(123, false, false);

        expect(props.getRolePolicy).toHaveBeenCalledWith({ departmentId: 123 });
        expect(result.setState).toHaveBeenCalledWith({ ...expectResult });
    });

    it('_handleGetPolicyList - should call getAccountPolicyList and setState', async () => {
        const expectResult = {
            data: {
                FuncDesc: "User Control",
                FuncId: 21,
                GPolicy: 3,
                ParentId: 21,
                Policy: 3
            },
            checkedPolicies: {
                groupPermission: { HasRead: true, HasHost: true },
                individualPermission: { HasRead: true, HasHost: true }
            }
        }
        const props = Object.assign({}, defaultProps, { getAccountPolicyList: jest.fn(() => expectResult) });
        const result = shallow(<EditPolicyForm {...props} />);
        const instance = result.instance();

        result.setState = jest.fn();

        await instance._handleGetPolicyList(123, true, false);

        expect(props.getAccountPolicyList).toHaveBeenCalledWith({ accountId: 123 });
        expect(result.setState).toHaveBeenCalledWith({ ...expectResult });
    });

    it('_handleGetPolicyList - should call getPolicyListByAccountIds and setState', async () => {
        const expectResult = {
            data: {
                FuncDesc: "User Control",
                FuncId: 21,
                GPolicy: 3,
                ParentId: 21,
                Policy: 3
            },
            checkedPolicies: {
                groupPermission: { HasRead: true, HasHost: true },
                individualPermission: { HasRead: true, HasHost: true }
            }
        }
        const props = Object.assign({}, defaultProps, { getPolicyListByAccountIds: jest.fn(() => expectResult) });
        const result = shallow(<EditPolicyForm {...props} />);
        const instance = result.instance();

        result.setState = jest.fn();

        await instance._handleGetPolicyList('123', true, true);

        expect(props.getPolicyListByAccountIds).toHaveBeenCalledWith({ accountIds: '123' });
        expect(result.setState).toHaveBeenCalledWith({ ...expectResult });
    });

    it('_handleChange - should be called when checked HasHost in individual', () => {
        const event = {
            target: {
                name: 'HasHost',
                checked: true
            }
        };

        const wrapper = shallow(<EditPolicyForm {...defaultProps} />);
        wrapper.setState({ checkedPolicies });
        wrapper.instance()._handleChange = jest.fn();
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('input[type="checkbox"][name="HasHost"]').at(0).simulate('change', event);

        expect(wrapper.instance()._handleChange).toHaveBeenCalledWith({ "target": { "checked": true, "name": "HasHost" } }, 21, false);
    });

    it('_handleChange - should be called when checked HasRead in individual', () => {
        const event = {
            target: {
                name: 'HasHost',
                checked: true
            }
        };

        const wrapper = shallow(<EditPolicyForm {...defaultProps} />);
        wrapper.setState({ checkedPolicies });
        wrapper.instance()._handleChange = jest.fn();
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('input[type="checkbox"][name="HasRead"]').at(0).simulate('change', event);

        expect(wrapper.instance()._handleChange).toHaveBeenCalledWith({ "target": { "checked": true, "name": "HasHost" } }, 21, false);
    });

    it('_handleChange - should be called when checked HasHost in group', () => {
        const event = {
            target: {
                name: 'HasHost',
                checked: true
            }
        };

        const wrapper = shallow(<EditPolicyForm {...defaultProps} />);
        wrapper.setState({ checkedPolicies });
        wrapper.instance()._handleChange = jest.fn();
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('input[type="checkbox"][name="HasHost"]').at(1).simulate('change', event);

        expect(wrapper.instance()._handleChange).toHaveBeenCalledWith({ "target": { "checked": true, "name": "HasHost" } }, 21, true);
    });

    it('_handleChange - should be called when checked HasRead in group', () => {
        const event = {
            target: {
                name: 'HasHost',
                checked: true
            }
        };

        const wrapper = shallow(<EditPolicyForm {...defaultProps} />);
        wrapper.setState({ checkedPolicies });
        wrapper.instance()._handleChange = jest.fn();
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('input[type="checkbox"][name="HasRead"]').at(1).simulate('change', event);

        expect(wrapper.instance()._handleChange).toHaveBeenCalledWith({ "target": { "checked": true, "name": "HasHost" } }, 21, true);
    });

    it('_handleChange - should call setState with HasHost checked in individual', () => {
        const event = {
            target: {
                name: 'HasHost',
                checked: true
            }
        };

        const result = shallow(<EditPolicyForm {...defaultProps} />);
        const instance = result.instance();
        result.setState({ checkedPolicies });
        result.setState = jest.fn();

        instance._handleChange(event, 21, false);

        expect(result.setState).toHaveBeenCalledWith({ "checkedPolicies": { "21": { "groupPermission": { "HasHost": true, "HasRead": true }, "individualPermission": { "HasHost": true, "HasRead": true } }, "22": { "groupPermission": { "HasHost": false, "HasRead": true }, "individualPermission": { "HasHost": false, "HasRead": true } }, "23": { "groupPermission": { "HasHost": true, "HasRead": false }, "individualPermission": { "HasHost": true, "HasRead": false } }, "24": { "groupPermission": { "HasHost": false, "HasRead": false }, "individualPermission": { "HasHost": false, "HasRead": false } } } });
    });

    it('_handleChange - should call setState with HasHost checked in Group', () => {
        const event = {
            target: {
                name: 'HasHost',
                checked: true
            }
        };

        const result = shallow(<EditPolicyForm {...defaultProps} />);
        const instance = result.instance();
        result.setState({ checkedPolicies });
        result.setState = jest.fn();

        instance._handleChange(event, 21, true);

        expect(result.setState).toHaveBeenCalledWith({ "checkedPolicies": { "21": { "groupPermission": { "HasHost": true, "HasRead": true }, "individualPermission": { "HasHost": true, "HasRead": true } }, "22": { "groupPermission": { "HasHost": false, "HasRead": true }, "individualPermission": { "HasHost": false, "HasRead": true } }, "23": { "groupPermission": { "HasHost": true, "HasRead": false }, "individualPermission": { "HasHost": true, "HasRead": false } }, "24": { "groupPermission": { "HasHost": false, "HasRead": false }, "individualPermission": { "HasHost": false, "HasRead": false } } } });
    });

    it('_handleChange - should call setState with HasRead in individual', () => {
        const event = {
            target: {
                name: 'HasRead',
                checked: false
            }
        };

        const result = shallow(<EditPolicyForm {...defaultProps} />);
        const instance = result.instance();
        result.setState({ checkedPolicies });
        result.setState = jest.fn();

        instance._handleChange(event, 21, false);

        expect(result.setState).toHaveBeenCalledWith({ "checkedPolicies": { "21": { "groupPermission": { "HasHost": true, "HasRead": true }, "individualPermission": { "HasHost": false, "HasRead": false } }, "22": { "groupPermission": { "HasHost": false, "HasRead": true }, "individualPermission": { "HasHost": false, "HasRead": true } }, "23": { "groupPermission": { "HasHost": true, "HasRead": false }, "individualPermission": { "HasHost": true, "HasRead": false } }, "24": { "groupPermission": { "HasHost": false, "HasRead": false }, "individualPermission": { "HasHost": false, "HasRead": false } } } });
    });

    it('_handleChange - should call setState with HasRead in Group', () => {
        const event = {
            target: {
                name: 'HasRead',
                checked: false
            }
        };

        const result = shallow(<EditPolicyForm {...defaultProps} />);
        const instance = result.instance();
        result.setState({ checkedPolicies });
        result.setState = jest.fn();

        instance._handleChange(event, 21, true);

        expect(result.setState).toHaveBeenCalledWith({ "checkedPolicies": { "21": { "groupPermission": { "HasHost": false, "HasRead": false }, "individualPermission": { "HasHost": true, "HasRead": true } }, "22": { "groupPermission": { "HasHost": false, "HasRead": true }, "individualPermission": { "HasHost": false, "HasRead": true } }, "23": { "groupPermission": { "HasHost": true, "HasRead": false }, "individualPermission": { "HasHost": true, "HasRead": false } }, "24": { "groupPermission": { "HasHost": false, "HasRead": false }, "individualPermission": { "HasHost": false, "HasRead": false } } } });
    });

    it('_handleSubmit - should call _handleShowAlert and updateAccountPolicy with update error', async () => {
        const props = Object.assign({}, defaultProps, { updateAccountPolicy: jest.fn() });
        const wrapper = shallow(<EditPolicyForm {...props} />);
        const instance = wrapper.instance();

        instance.setState({ checkedPolicies });
        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(props.updateAccountPolicy).toHaveBeenCalledWith({ "GroupPolicies": "123,21,3;123,22,1;123,23,2;123,24,0;" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Update account policy is failed!");
    });

    it('_handleSubmit - should call _handleShowAlert and updateAccountPolicy with update failed', async () => {
        const result = { IsSuccessful: false, Message: "updateAccountPolicy is failed" };
        const props = Object.assign({}, defaultProps, { updateAccountPolicy: jest.fn(() => result) });
        const wrapper = shallow(<EditPolicyForm {...props} />);
        const instance = wrapper.instance();

        instance.setState({ checkedPolicies });
        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(props.updateAccountPolicy).toHaveBeenCalledWith({ "GroupPolicies": "123,21,3;123,22,1;123,23,2;123,24,0;" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "updateAccountPolicy is failed");
    });

    it('_handleSubmit - should call _handleShowAlert and updateAccountPolicy with isGetByIdList and update successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { updateAccountPolicy: jest.fn(() => result), isGetByIdList: true, selectedId: "123,234" });
        const wrapper = shallow(<EditPolicyForm {...props} />);
        const instance = wrapper.instance();

        instance.setState({ checkedPolicies });
        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(props.updateAccountPolicy).toHaveBeenCalledWith({ "GroupPolicies": "123,21,3;123,22,1;123,23,2;123,24,0;234,21,3;234,22,1;234,23,2;234,24,0;" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Update account policy successfully!");
    });

    it('_handleSubmit - should call _handleShowAlert and updateRolePolicy with update error', async () => {
        const props = Object.assign({}, defaultProps, { updateRolePolicy: jest.fn(), isAccountPolicy: false });
        const wrapper = shallow(<EditPolicyForm {...props} />);
        const instance = wrapper.instance();

        instance.setState({ checkedPolicies });
        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(props.updateRolePolicy).toHaveBeenCalledWith({ "GroupPolicies": "123,21,3;123,22,1;123,23,2;123,24,0;" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Update role policy is failed!");
    });

    it('_handleSubmit - should call _handleShowAlert and updateRolePolicy with isAccountPolicy and update failed', async () => {
        const result = { IsSuccessful: false, Message: "updateRolePolicy is failed" };
        const props = Object.assign({}, defaultProps, { updateRolePolicy: jest.fn(() => result), isAccountPolicy: false });
        const wrapper = shallow(<EditPolicyForm {...props} />);
        const instance = wrapper.instance();

        instance.setState({ checkedPolicies });
        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(props.updateRolePolicy).toHaveBeenCalledWith({ "GroupPolicies": "123,21,3;123,22,1;123,23,2;123,24,0;" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "updateRolePolicy is failed");
    });

    it('_handleSubmit - should call _handleShowAlert and updateRolePolicy with isAccountPolicy, isGetByIdList and update successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { updateRolePolicy: jest.fn(() => result), isAccountPolicy: false, isGetByIdList: true, selectedId: "123,234" });
        const wrapper = shallow(<EditPolicyForm {...props} />);
        const instance = wrapper.instance();

        instance.setState({ checkedPolicies });
        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(props.updateRolePolicy).toHaveBeenCalledWith({ "GroupPolicies": "123,21,3;123,22,1;123,23,2;123,24,0;234,21,3;234,22,1;234,23,2;234,24,0;" });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Update role policy successfully!");
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', async () => {
        const wrapper = shallow(<EditPolicyForm {...defaultProps} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance._handleShowAlert(false, 'Updated failed!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Updated failed!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState and _handleClosePopup', async () => {
        const wrapper = shallow(<EditPolicyForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(instance._handleClosePopup).toHaveBeenCalled();
    });

    it('_hideMessage - should call setState but not call _handleClosePopup', async () => {
        const wrapper = shallow(<EditPolicyForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(instance._handleClosePopup).not.toHaveBeenCalled();
    });

    it('_handleClosePopup - should call closePopup and setState', () => {
        const props = Object.assign({}, defaultProps, { closePopup: jest.fn() })
        const wrapper = shallow(<EditPolicyForm {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleClosePopup();

        expect(props.closePopup).toHaveBeenCalled();
        expect(wrapper.setState).toHaveBeenCalledWith({
            data: null,
            checkedPolicies: {},
            isShowMessage: false,
            isSuccess: true,
            message: ''
        });
    });
})