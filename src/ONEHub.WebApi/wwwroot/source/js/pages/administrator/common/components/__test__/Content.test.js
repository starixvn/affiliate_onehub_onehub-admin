import React from 'react';
import Content from '../Content';
import { shallow } from 'enzyme';
import EditPolicyForm from '../EditPolicyForm';
import DepartmentPopup from '../DepartmentPopup';
import ChangePasswordForm from '../../../../common/components/ChangePasswordForm';

describe('administrator - common - components - Content ', () => {
    const data = [
        {
            CreatedDate: "2008-10-09T23:45:25.043",
            CreatedDateText: "10/09/2008 23:45:25",
            Creator: "",
            FirstName: "username    862400F",
            GroupId: 120,
            GroupName: "IT",
            IsOpen: true,
            LastName: "username    862400L",
            UserId: 862400,
            UserName: "pgmViet"
        },
        {
            CreatedDate: "2019-06-16T23:46:30.843",
            CreatedDateText: "06/16/2019 23:46:30",
            Creator: "AAwalter",
            FirstName: "hubert",
            GroupId: 120,
            GroupName: "IT",
            IsOpen: false,
            LastName: "duong",
            UserId: 1000000045,
            UserName: "AAHubert"
        }
    ];

    const checkedUsers = {
        862400: false,
        1000000045: true
    }

    const defaultProps = {
        isPopup: true,
        gridData: data,
        checkedUsers,
        param: { userName: '', firstLetter: '' },
        shouldResetScrollPosition: true
    };

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with emptyData', () => {
        const props = Object.assign({}, defaultProps, { isPopup: false, gridData: [] });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with data null', () => {
        const props = Object.assign({}, defaultProps, { gridData: null });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('setState - should be called when closePopup in EditPolicyForm', () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find(EditPolicyForm).props().closePopup();

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowPolicyPopup: false, selectedUserId: 0, userName: '' });
    });

    it('setState - should be called when setShowPopupPassword in ChangePasswordForm', () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find(ChangePasswordForm).props().setShowPopupPassword();

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowPasswordPopup: false });
    });

    it('setState - should be called when closePopup in DepartmentPopup', () => {
        const props = Object.assign({}, defaultProps, { isPopup: false });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        wrapper.find(DepartmentPopup).props().closePopup();

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowDepartmentPopup: false, selectedGroupId: 0, groupName: '' });
    });

    it('_handleShowUserPopup - should be called when click Add Acc', () => {
        const props = Object.assign({}, defaultProps, { isPopup: false });
        const wrapper = shallow(<Content {...props} />);
        wrapper.instance()._handleShowUserPopup = jest.fn();
        wrapper.setState = jest.fn();

        wrapper.find('Button').at(0).simulate('click');

        expect(wrapper.instance()._handleShowUserPopup).toHaveBeenCalledWith(0, false);
    });

    it('_handleShowUserPopup - should be called when click Add Existed Acc', () => {
        const props = Object.assign({}, defaultProps, { isPopup: false });
        const wrapper = shallow(<Content {...props} />);
        wrapper.instance()._handleShowUserPopup = jest.fn();
        wrapper.setState = jest.fn();

        wrapper.find('Button').at(1).simulate('click');

        expect(wrapper.instance()._handleShowUserPopup).toHaveBeenCalledWith(0, true);
    });

    it('_onCheckItem - should call setShouldResetScrollPosition and setCheckedUsers', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setCheckedUsers: jest.fn() });
        const wrapper = shallow(<Content {...props} />);

        wrapper.instance()._onCheckItem(true, '862400');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setCheckedUsers).toHaveBeenCalledWith({ "1000000045": true, "862400": true });
    });

    it('_handleChangeStatus - should call setShouldResetScrollPosition and setState', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleChangeStatus(862400, true);

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ message: `Are you sure you want to change status for this customer?`, isConfirmPopup: true, selectedUserId: 862400, isOpen: true });
    });

    it('_handleCloseNotificationPopup - should call _handleSaveStatus and setState', () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState({ selectedUserId: 862400 })
        instance.setState = jest.fn();
        instance._handleSaveStatus = jest.fn();

        instance._handleCloseNotificationPopup(true);

        expect(instance._handleSaveStatus).toHaveBeenCalledWith(862400, false);
        expect(instance.setState).toHaveBeenCalledWith({ message: '' });
    });

    it('_handleCloseNotificationPopup - should not call _handleSaveStatus but call setState', () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState({ selectedUserId: 862400 })
        instance.setState = jest.fn();
        instance._handleSaveStatus = jest.fn();

        instance._handleCloseNotificationPopup(false);

        expect(instance._handleSaveStatus).not.toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalledWith({ message: '' });
    });

    it('handleFetchData - should call fetchData', () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const wrapper = shallow(<Content {...props} />);

        wrapper.instance().handleFetchData();

        expect(props.fetchData).toHaveBeenCalledWith(defaultProps.param);
    });

    it('_handleShowUserPopup - should call setShouldResetScrollPosition and setState', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleShowUserPopup(862400, true);

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ selectedUserId: 862400, isShowUserPopup: true, isInsertExistedAcc: true });
    });

    it('_handleShowPolicyPopup - should call setShouldResetScrollPosition and setState', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleShowPolicyPopup(862400, 'pgmViet');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ "isShowPolicyPopup": true, "selectedUserId": 862400, "userName": "pgmViet" });
    });

    it('_handleShowDepartmentPopup - should call setShouldResetScrollPosition and setState', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleShowDepartmentPopup(120, 'IT');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ selectedGroupId: 120, isShowDepartmentPopup: true, groupName: 'IT' });
    });

    it('_handleShowPasswordPopup - should call setShouldResetScrollPosition and setState', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleShowPasswordPopup(862400);

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ selectedUserId: 862400, isShowPasswordPopup: true });
    });

    it('_handleSaveStatus - should call changeStatus and setState when update error', async () => {
        const props = Object.assign({}, defaultProps, { changeStatus: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._handleSaveStatus(862400, true);

        expect(props.changeStatus).toHaveBeenCalledWith({ selectedUserId: 862400, isOpen: true });
        expect(instance.setState).toHaveBeenCalledWith({ message: 'Update the status is failed!', isConfirmPopup: false });
    });

    it('_handleSaveStatus - should call changeStatus and setState when update failed', async () => {
        const expectedResult = { IsSuccessful: false, Message: 'Change is failed!' }
        const props = Object.assign({}, defaultProps, { changeStatus: jest.fn(() => expectedResult) });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._handleSaveStatus(862400, true);

        expect(props.changeStatus).toHaveBeenCalledWith({ selectedUserId: 862400, isOpen: true });
        expect(instance.setState).toHaveBeenCalledWith({ message: 'Change is failed!', isConfirmPopup: false });
    });

    it('_handleSaveStatus - should be called changeStatus, setState and handleFetchData when update successfully', async () => {
        const expectedResult = { IsSuccessful: true, Message: '' }
        const props = Object.assign({}, defaultProps, { changeStatus: jest.fn(() => expectedResult) });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();
        instance.handleFetchData = jest.fn();

        await instance._handleSaveStatus(862400, true);

        expect(props.changeStatus).toHaveBeenCalledWith({ selectedUserId: 862400, isOpen: true });
        expect(instance.setState).toHaveBeenCalledWith({ message: 'The status has been updated successfully!', isConfirmPopup: false });
        expect(instance.handleFetchData).toHaveBeenCalled();
    });

    it('_onCheckItem - should be called when checked user', () => {
        const event = {
            target: {
                checked: true
            }
        };

        const wrapper = shallow(<Content {...defaultProps} />);
        const instance = wrapper.instance();
        instance._onCheckItem = jest.fn();
        const dataRow = shallow(<div>{instance._renderDataSection(data)}</div>);

        dataRow.find('input[type="checkbox"]').at(0).simulate('change', event);

        expect(instance._onCheckItem).toHaveBeenCalledWith(true, 862400);
    });

    it('_handleShowUserPopup - should be called when click userName', () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        const instance = wrapper.instance();
        instance._handleShowUserPopup = jest.fn();
        const dataRow = shallow(<div>{instance._renderDataSection(data)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(instance._handleShowUserPopup).toHaveBeenCalledWith(862400, false);
    });

    it('_handleChangeStatus - should be called when change status', () => {
        const event = {
            target: {
                checked: true
            }
        };
        const props = Object.assign({}, defaultProps, { isPopup: false })
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance._handleChangeStatus = jest.fn();
        const dataRow = shallow(<div>{instance._renderDataSection(data)}</div>);

        dataRow.find('input[type="checkbox"]').at(1).simulate('change', event);

        expect(instance._handleChangeStatus).toHaveBeenCalledWith(1000000045, true);
    });

    it('_handleShowPolicyPopup - should be called when click edit policy', () => {
        const props = Object.assign({}, defaultProps, { isPopup: false })
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance._handleShowPolicyPopup = jest.fn();
        const dataRow = shallow(<div>{instance._renderDataSection(data)}</div>);

        dataRow.find('Button').at(1).simulate('click');

        expect(instance._handleShowPolicyPopup).toHaveBeenCalledWith(862400, 'pgmViet', 'IT');
    });

    it('_handleShowDepartmentPopup - should be called when click edit department', () => {
        const props = Object.assign({}, defaultProps, { isPopup: false })
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance._handleShowDepartmentPopup = jest.fn();
        const dataRow = shallow(<div>{instance._renderDataSection(data)}</div>);

        dataRow.find('Button').at(2).simulate('click');

        expect(instance._handleShowDepartmentPopup).toHaveBeenCalledWith(120, 'IT');
    });

    it('_handleShowPasswordPopup - should be called when click edit password', () => {
        const props = Object.assign({}, defaultProps, { isPopup: false })
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance._handleShowPasswordPopup = jest.fn();
        const dataRow = shallow(<div>{instance._renderDataSection(data)}</div>);

        dataRow.find('Button').at(3).simulate('click');

        expect(instance._handleShowPasswordPopup).toHaveBeenCalledWith(862400);
    });

    it('handleClosePopup - should call setState and setTimeout', async () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance.handleClosePopup();

        expect(wrapper.setState.mock.calls[0]).toEqual([{
            isShowUserPopup: false,
            isShowPolicyPopup: false,
            isShowDepartmentPopup: false,
            isShowPasswordPopup: false,
            message: ''
        }, expect.any(Function)]);
    });
})