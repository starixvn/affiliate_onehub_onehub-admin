import React from 'react';
import { DepartmentPopup } from '../DepartmentPopup';
import { shallow } from 'enzyme';
import Content from '../Content';
import EditPolicyForm from '../EditPolicyForm';
import SelectAll from '../../../../common/components/SelectAll';

describe('administrator - common - components - DepartmentPopup ', () => {
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
            IsOpen: true,
            LastName: "duong",
            UserId: 1000000045,
            UserName: "AAHubert"
        }
    ];

    const checkedUsers = {
        862400: false,
        1000000045: true
    }

    const expectResult = {
        data,
        checkedUsers
    }

    const defaultProps = {
        groupId: 120,
        isAdmin: true,
        name: 'AAHubert',
        isShowPopup: true
    };

    it('render correctly', () => {
        const result = shallow(<DepartmentPopup {...defaultProps} />);
        result.setState({ data, isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with emptyData', () => {
        const props = Object.assign({}, defaultProps, { isAdmin: false, data: [] });
        const result = shallow(<DepartmentPopup {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with data null', () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const result = shallow(<DepartmentPopup {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call getData', () => {
        const props = Object.assign({}, defaultProps, { groupId: 234 });
        const result = shallow(<DepartmentPopup {...props} />);
        const instance = result.instance();
        instance.getData = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(instance.getData).toHaveBeenCalledWith({ groupId: 234, userName: '', firstLetter: '' });
    });

    it('setState - should be called when setCheckedList in SelectAll', () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        wrapper.setState({ data });
        wrapper.setState = jest.fn();

        wrapper.find(SelectAll).props().setCheckedList({ 123: true });

        expect(wrapper.setState).toHaveBeenCalledWith({ checkedUsers: { 123: true } });
    });

    it('setState - should be called when setCheckedUsers in Content', () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find(Content).props().setCheckedUsers({ 123: true });

        expect(wrapper.setState).toHaveBeenCalledWith({ checkedUsers: { 123: true } });
    });

    it('setState - should be called when closePopup in EditPolicyForm', () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find(EditPolicyForm).props().closePopup();

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowPolicyPopup: false, selectedUserIds: '', userNames: '' });
    });

    it('handleSetParam - should call setState', () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.instance().handleSetParam({ userName: '' });

        expect(wrapper.setState).toHaveBeenCalledWith({ param: { groupId: 120, userName: '' } });
    });

    it('handleFetchData - should call getData', () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        const instance = wrapper.instance();
        instance.getData = jest.fn();

        instance.handleFetchData({ userName: '' });

        expect(instance.getData).toHaveBeenCalledWith({ groupId: 120, userName: '' });
    });

    it('getData - should call fetchData and setState', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn(() => expectResult) })
        const wrapper = shallow(<DepartmentPopup {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance().getData({ groupId: 120, userName: '', firstLetter: '' });

        expect(props.fetchData).toHaveBeenCalledWith({ groupId: 120, userName: '', firstLetter: '' });
        expect(wrapper.setState).toHaveBeenCalledWith({ ...expectResult });
    });

    it('_handleUpdate - should call _getCheckedItemIdList and _handleShowAlert', async () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        const instance = wrapper.instance();
        instance._getCheckedItemIdList = jest.fn(() => []);
        instance._handleShowAlert = jest.fn();

        await instance.handleUpdate();

        expect(instance._getCheckedItemIdList).toHaveBeenCalledWith({});
        expect(instance._handleShowAlert).toHaveBeenCalledWith('Please choose at least one account.');
    });

    it('_handleUpdate - should call _getCheckedItemIdList and _handleShowAlert', async () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState({ data, checkedUsers });
        instance._getCheckedItemIdList = jest.fn(() => ["1000000045"]);
        instance.setState = jest.fn();

        await instance.handleUpdate();

        expect(instance._getCheckedItemIdList).toHaveBeenCalledWith(checkedUsers);
        expect(instance.setState).toHaveBeenCalledWith({ "isShowPolicyPopup": true, "selectedUserIds": "1000000045", "userNames": "AAHubert" });
    });

    it('_getCheckedItemIdList - return correct data', () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);

        const result = wrapper.instance()._getCheckedItemIdList(checkedUsers);

        expect(result).toEqual(["1000000045"]);
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', async () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance._handleShowAlert('Updated failed!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Updated failed!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState', async () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._hideMessage();

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
    });

    it('setShouldResetScrollPosition - should call setState', async () => {
        const wrapper = shallow(<DepartmentPopup {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.instance().setShouldResetScrollPosition(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ shouldResetScrollPosition: true });
    });

    it('_handleClosePopup - should call closePopup', () => {
        const props = Object.assign({}, defaultProps, { closePopup: jest.fn() })
        const wrapper = shallow(<DepartmentPopup {...props} />);

        wrapper.instance().handleClosePopup();

        expect(props.closePopup).toHaveBeenCalled();
    });
})