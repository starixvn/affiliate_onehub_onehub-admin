import React from 'react';
import { InsertUpdateAccForm } from '../InsertUpdateAccForm';
import { shallow } from 'enzyme';

describe('administrator - common - components - InsertUpdateAccForm ', () => {
    const departmentList = [{ DepartmentId: 120, DepartmentName: 'IT' }];
    const defaultProps = {
        selectedUserId: 123,
        isShowPopup: true,
        closePopup: jest.fn(),
        fetchData: jest.fn(),
        departmentList: [{ DepartmentId: 120, DepartmentName: 'IT' }],
        isInsertExistedAcc: false,
        getDepartmentList: jest.fn(() => departmentList)
    };

    it('render correctly with insert', () => {
        const props = Object.assign({}, defaultProps, { selectedUserId: 0 });
        const result = shallow(<InsertUpdateAccForm {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with insert existed Account', () => {
        const props = Object.assign({}, defaultProps, { selectedUserId: 0, isInsertExistedAcc: true });
        const result = shallow(<InsertUpdateAccForm {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with update', () => {
        const result = shallow(<InsertUpdateAccForm {...defaultProps} />);
        result.setState({ isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with not show popup', () => {
        const props = Object.assign({}, defaultProps, { departmentList: null });
        const result = shallow(<InsertUpdateAccForm {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call setState', () => {
        const props = Object.assign({}, defaultProps, { selectedUserId: 234 });
        const result = shallow(<InsertUpdateAccForm {...props} />);
        const instance = result.instance();

        result.setState = jest.fn();
        instance._handleGetUserDetail = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: false });
        expect(instance._handleGetUserDetail).toHaveBeenCalledWith(234);
    });

    it('_handleGetDepartmentList - should call setState', async () => {
        const result = shallow(<InsertUpdateAccForm {...defaultProps} />);
        const instance = result.instance();

        result.setState = jest.fn();

        await instance._handleGetDepartmentList();

        expect(defaultProps.getDepartmentList).toHaveBeenCalled();
        expect(result.setState).toHaveBeenCalledWith({ departmentList });
    });

    it('_handleGetUserDetail - should call getUserDetail and setState', async () => {
        const expectResult = {
            UserId: 123,
            UserName: 'abc',
            FirstName: 'abc',
            LastName: 'abc',
            GroupId: 234
        }
        const props = Object.assign({}, defaultProps, { getUserDetail: jest.fn(() => expectResult) });
        const result = shallow(<InsertUpdateAccForm {...props} />);
        const instance = result.instance();

        result.setState = jest.fn();

        await instance._handleGetUserDetail(123);

        expect(props.getUserDetail).toHaveBeenCalledWith(123);
        expect(result.setState).toHaveBeenCalledWith({ userName: 'abc', firstName: 'abc', lastName: 'abc', department: 234 });
    });

    it('_handleChange - should call setState with value > Maxlength ', () => {
        const event = {
            target: {
                name: 'userName',
                value: 'userName_userName_userName'
            }
        };

        const result = shallow(<InsertUpdateAccForm {...defaultProps} />);
        const instance = result.instance();
        result.setState = jest.fn();

        instance._handleChange(event);

        expect(result.setState).toHaveBeenCalledWith({ userName: "userName_userName_u" });
    });

    it('_handleChange - should call setState with value < Maxlength ', () => {
        const event = {
            target: {
                name: 'userName',
                value: '123'
            }
        };

        const result = shallow(<InsertUpdateAccForm {...defaultProps} />);
        const instance = result.instance();
        result.setState = jest.fn();

        instance._handleChange(event);

        expect(result.setState).toHaveBeenCalledWith({ userName: "123" });
    });

    it('_handleSubmit - should call _handleShowAlert with userName is empty', async () => {
        const wrapper = shallow(<InsertUpdateAccForm {...defaultProps} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Please input user name!");
    });

    it('_handleSubmit - should call _handleShowAlert with password is empty', async () => {
        const wrapper = shallow(<InsertUpdateAccForm {...defaultProps} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '' });

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Password is required!");
    });

    it('_handleSubmit - should call _handleShowAlert with department is not choose', async () => {
        const wrapper = shallow(<InsertUpdateAccForm {...defaultProps} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123' });

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, 'Please choose department!');
    });

    it('_handleSubmit - should call _handleShowAlert with invalid userName', async () => {
        const wrapper = shallow(<InsertUpdateAccForm {...defaultProps} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc@123', password: '123', department: 102 });

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, 'User Name can not be contained the special characters. Please try again!');
    });

    it('_handleSubmit - should call insertUser and _handleShowAlert with insert user successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { insertUser: jest.fn(() => result) });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123', department: 102, isInsert: true });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.insertUser).toHaveBeenCalledWith({ AccountId: 123, userName: 'abc', password: '123', firstName: '', lastName: '', groupId: 102 });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Administrator has been added successfully!");
    });

    it('_handleSubmit - should call insertUser and _handleShowAlert with insert user is failed', async () => {
        const result = { IsSuccessful: false, Message: "insert user is failed" };
        const props = Object.assign({}, defaultProps, { insertUser: jest.fn(() => result) });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123', department: 102, isInsert: true });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.insertUser).toHaveBeenCalledWith({ AccountId: 123, userName: 'abc', password: '123', firstName: '', lastName: '', groupId: 102 });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "insert user is failed");
    });

    it('_handleSubmit - should call insertUser and _handleShowAlert with insert user has error', async () => {
        const props = Object.assign({}, defaultProps, { insertUser: jest.fn() });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123', department: 102, isInsert: true });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.insertUser).toHaveBeenCalledWith({ AccountId: 123, userName: 'abc', password: '123', firstName: '', lastName: '', groupId: 102 });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Adding the administrator was failed!");
    });

    it('_handleSubmit - should call insertExistedUser and _handleShowAlert with insert existed user successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { insertExistedUser: jest.fn(() => result), isInsertExistedAcc: true });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123', department: 102, isInsert: true });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.insertExistedUser).toHaveBeenCalledWith({ AccountId: 123, userName: 'abc', password: '123', firstName: '', lastName: '', groupId: 102 });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Administrator has been added successfully!");
    });

    it('_handleSubmit - should call insertExistedUser and _handleShowAlert with insert existed user is failed', async () => {
        const result = { IsSuccessful: false, Message: "insert existed user is failed" };
        const props = Object.assign({}, defaultProps, { insertExistedUser: jest.fn(() => result), isInsertExistedAcc: true });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123', department: 102, isInsert: true });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.insertExistedUser).toHaveBeenCalledWith({ AccountId: 123, userName: 'abc', password: '123', firstName: '', lastName: '', groupId: 102 });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "insert existed user is failed");
    });

    it('_handleSubmit - should call insertExistedUser and _handleShowAlert with insert existed user has error', async () => {
        const props = Object.assign({}, defaultProps, { insertExistedUser: jest.fn(), isInsertExistedAcc: true });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123', department: 102, isInsert: true });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.insertExistedUser).toHaveBeenCalledWith({ AccountId: 123, userName: 'abc', password: '123', firstName: '', lastName: '', groupId: 102 });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Adding the administrator was failed!");
    });

    it('_handleSubmit - should call updateUser and _handleShowAlert with update user successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { updateUser: jest.fn(() => result) });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123', department: 102, isInsert: false });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.updateUser).toHaveBeenCalledWith({ AccountId: 123, userName: 'abc', password: '123', firstName: '', lastName: '', groupId: 102 });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "The abc has been updated successfully!");
    });

    it('_handleSubmit - should call updateUser and _handleShowAlert with update user is failed', async () => {
        const result = { IsSuccessful: false, Message: "update user is failed" };
        const props = Object.assign({}, defaultProps, { updateUser: jest.fn(() => result) });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123', department: 102, isInsert: false });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.updateUser).toHaveBeenCalledWith({ AccountId: 123, userName: 'abc', password: '123', firstName: '', lastName: '', groupId: 102 });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "update user is failed");
    });

    it('_handleSubmit - should call updateUser and _handleShowAlert with update user has error', async () => {
        const props = Object.assign({}, defaultProps, { updateUser: jest.fn() });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ userName: 'abc', password: '123', department: 102, isInsert: false });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.updateUser).toHaveBeenCalledWith({ AccountId: 123, userName: 'abc', password: '123', firstName: '', lastName: '', groupId: 102 });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Updating the abc was failed!");
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', async () => {
        const wrapper = shallow(<InsertUpdateAccForm {...defaultProps} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance._handleShowAlert(false, 'Updated failed!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Updated failed!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState and _handleClosePopup', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(props.fetchData).toHaveBeenCalled();
        expect(instance._handleClosePopup).toHaveBeenCalled();
    });

    it('_hideMessage - should call setState but not call _handleClosePopup', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(props.fetchData).not.toHaveBeenCalled();
        expect(instance._handleClosePopup).not.toHaveBeenCalled();
    });

    it('_handlePressEnter - should call _handleSubmit', () => {
        const event = {
            charCode: 13,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<InsertUpdateAccForm {...defaultProps} />);
        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        instance._handleKeyPress(event)

        expect(event.preventDefault).toHaveBeenCalled();
        expect(instance._handleSubmit).toHaveBeenCalled();
    });

    it('_handlePressEnter - should not call _handleSubmit', () => {
        const event = {
            charCode: 16,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<InsertUpdateAccForm {...defaultProps} />);
        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        instance._handleKeyPress(event)

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(instance._handleSubmit).not.toHaveBeenCalled();
    });

    it('_handleClosePopup - should call closePopup and setTimeout', () => {
        const props = Object.assign({}, defaultProps, { closePopup: jest.fn() })
        const wrapper = shallow(<InsertUpdateAccForm {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleClosePopup();

        expect(props.closePopup).toHaveBeenCalled();
    });
})