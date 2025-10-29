import React from 'react';
import { InsertUpdateForm } from '../InsertUpdateForm';
import { shallow } from 'enzyme';

describe('department list - components - InsertUpdateForm ', () => {
    const defaultProps = {
        selectedDepartmentId: 123,
        isOpenInsertUpdatePopup: true,
        fetchData: jest.fn()
    };

    it('render correctly with insert', () => {
        const props = Object.assign({}, defaultProps, { selectedDepartmentId: 0 });
        const result = shallow(<InsertUpdateForm {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with update', () => {
        const result = shallow(<InsertUpdateForm {...defaultProps} />);
        result.setState({ isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with not show popup', () => {
        const props = Object.assign({}, defaultProps, { isOpenInsertUpdatePopup: false });
        const result = shallow(<InsertUpdateForm {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call setState', () => {
        const props = Object.assign({}, defaultProps, { selectedDepartmentId: 234 });
        const result = shallow(<InsertUpdateForm {...props} />);
        const instance = result.instance();

        result.setState = jest.fn();
        instance._handleGetDepartmentDetail = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: false });
        expect(instance._handleGetDepartmentDetail).toHaveBeenCalledWith(234);
    });

    it('_handleGetDepartmentDetail - should call getDepartmentDetail and setState', async () => {
        const expectResult = {
            DepartmentId: 123,
            DepartmentName: "IT",
            Description: "IT dept",
            NoOfUser: 12
        }
        const props = Object.assign({}, defaultProps, { getDepartmentDetail: jest.fn(() => expectResult) });
        const result = shallow(<InsertUpdateForm {...props} />);
        const instance = result.instance();

        result.setState = jest.fn();

        await instance._handleGetDepartmentDetail(123);

        expect(props.getDepartmentDetail).toHaveBeenCalledWith(123);
        expect(result.setState).toHaveBeenCalledWith({ departmentName: 'IT', description: "IT dept" });
    });

    it('_handleChange - should call setState ', () => {
        const event = {
            target: {
                name: 'departmentName',
                value: '123'
            }
        };
        const props = Object.assign({}, defaultProps, { setselectedDepartmentId: jest.fn() })
        const result = shallow(<InsertUpdateForm {...props} />);
        result.setState = jest.fn();

        result.find('Input[type="text"][name="departmentName"]').simulate('change', event);

        expect(result.setState).toHaveBeenCalledWith({ "departmentName": "123" });
    });

    it('_handleChange - should call _handleShowAlert ', () => {
        const event = {
            target: {
                name: 'departmentName',
                value: '123"abc'
            }
        };
        const props = Object.assign({}, defaultProps, { setselectedDepartmentId: jest.fn() })
        const result = shallow(<InsertUpdateForm {...props} />);
        result.instance()._handleShowAlert = jest.fn();

        result.find('Input[type="text"][name="departmentName"]').simulate('change', event);

        expect(result.instance()._handleShowAlert).toHaveBeenCalledWith(false, `Department name can not contain (') and (") characters!`);
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert with departmentName is empty', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Please input department name!");
    });

    it('_handleSubmit - should call toggleLoader, insertDepartment and _handleShowAlert with with insert successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { insertDepartment: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ departmentName: 'abc' });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "The Department has been added successfully!");
    });

    it('_handleSubmit - should call toggleLoader, insertDepartment and _handleShowAlert with with insert is failed', async () => {
        const result = { IsSuccessful: false, Message: "Adding was failed!" };
        const props = Object.assign({}, defaultProps, { insertDepartment: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ departmentName: 'abc' });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Adding was failed!");
    });

    it('_handleSubmit - should call toggleLoader, insertDepartment and _handleShowAlert with with insert is errored', async () => {
        const props = Object.assign({}, defaultProps, { insertDepartment: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();
        wrapper.setState({ departmentName: 'abc' });

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Adding the department was failed!");
    });

    it('_handleSubmit - should call toggleLoader, updateDepartment and _handleShowAlert with with update successfully', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { updateDepartment: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        wrapper.setState({ isInsert: false, departmentName: 'abc' });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "The Department has been updated successfully!");
    });

    it('_handleSubmit - should call toggleLoader, updateDepartment and _handleShowAlert with with update is failed', async () => {
        const result = { IsSuccessful: false, Message: "Updating is failed!" };
        const props = Object.assign({}, defaultProps, { updateDepartment: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        wrapper.setState({ isInsert: false, departmentName: 'abc' });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Updating is failed!");
    });

    it('_handleSubmit - should call toggleLoader, updateDepartment and _handleShowAlert with with update is errored', async () => {
        const props = Object.assign({}, defaultProps, { updateDepartment: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        wrapper.setState({ isInsert: false, departmentName: 'abc' });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit();

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Updating the department was failed!");
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', async () => {
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance._handleShowAlert(false, 'Updated failed!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Updated failed!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState and _handleClosePopup', async () => {
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(instance._handleClosePopup).toHaveBeenCalled();
    });

    it('_hideMessage - should call setState and not call _handleClosePopup', async () => {
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(instance._handleClosePopup).not.toHaveBeenCalled();
    });

    it('_handlePressEnter - should call _handleSubmit when press enter in department name textbox', () => {
        const event = {
            charCode: 13,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        wrapper.instance()._handleSubmit = jest.fn();

        wrapper.find('Input[type="text"][name="departmentName"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(wrapper.instance()._handleSubmit).toHaveBeenCalled();
    });

    it('_handlePressEnter - should call _handleShowAlert when press KeyDoubleQuotationMark in department name textbox', () => {
        const event = {
            charCode: 34,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        wrapper.instance()._handleShowAlert = jest.fn();

        wrapper.find('Input[type="text"][name="departmentName"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(wrapper.instance()._handleShowAlert).toHaveBeenCalledWith(false, 'Department name can not contain this character!');
    });

    it('_handlePressEnter - should call _handleShowAlert when press KeySingleQuotationMark in department name textbox', () => {
        const event = {
            charCode: 39,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        wrapper.instance()._handleShowAlert = jest.fn();

        wrapper.find('Input[type="text"][name="departmentName"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(wrapper.instance()._handleShowAlert).toHaveBeenCalledWith(false, 'Department name can not contain this character!');
    });

    it('_handlePressEnter - should not call _handleSubmit and _handleShowAlert when press other keys', () => {
        const event = {
            charCode: 16,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);

        wrapper.find('Input[type="text"][name="departmentName"]').simulate('keyPress', event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('_handleClosePopup - should call setselectedDepartmentId, setOpenInsertUpdatePopup and setState', () => {
        const props = Object.assign({}, defaultProps, { setSelectedDepartmentId: jest.fn(), setOpenInsertUpdatePopup: jest.fn() })
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleClosePopup();

        expect(props.setSelectedDepartmentId).toHaveBeenCalledWith(0);
        expect(props.setOpenInsertUpdatePopup).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({
            departmentName: '',
            description: '',
            isInsert: true,
            isShowMessage: false,
            isSuccess: true,
            message: ''
        });
    });
})