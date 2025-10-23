import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import EditPolicyForm from '../../../common/components/EditPolicyForm';
import DepartmentPopup from '../../../common/components/DepartmentPopup';

describe('department list - components - Content ', () => {
    const gridData = [
        {
            DepartmentId: 123,
            DepartmentName: "IT",
            Description: "IT dept",
            NoOfUser: 12
        },
        {
            DepartmentId: 120,
            DepartmentName: "Finance",
            Description: "Finance",
            NoOfUser: 0
        },
        {
            DepartmentId: 119,
            DepartmentName: "None",
            Description: "None",
            NoOfUser: 0
        }
    ];

    const defaultProps = {
        shouldResetScrollPosition: true,
        gridData,
        fetchData: jest.fn()
    };

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is null', () => {
        const props = Object.assign({}, defaultProps, { gridData: null })
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is empty', () => {
        const props = Object.assign({}, defaultProps, { gridData: [] })
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('setState - should be called when close EditPolicyForm', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState = jest.fn();

        result.find(EditPolicyForm).props().closePopup();

        expect(result.setState).toHaveBeenCalledWith({ isShowPolicyPopup: false, selectedDepartmentId: 0, departmentName: '' });
    });

    it('setState - should be called when close DepartmentPopup', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState = jest.fn();

        result.find(DepartmentPopup).props().closePopup();

        expect(result.setState).toHaveBeenCalledWith({ isShowDepartmentPopup: false, selectedDepartmentId: 0, departmentName: '' });
    });

    it('_handleCloseNotificationPopup - should call setState and _deleteDepartment', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ selectedDepartmentId: 123 });

        const instance = result.instance();
        result.setState = jest.fn();
        instance._deleteDepartment = jest.fn();

        instance._handleCloseNotificationPopup(true);

        expect(result.setState).toHaveBeenCalledWith({ message: '' });
        expect(instance._deleteDepartment).toHaveBeenCalledWith(123);
    });

    it('_handleCloseNotificationPopup - should call setState but not call _deleteDepartment', () => {
        const result = shallow(<Content {...defaultProps} />);
        const instance = result.instance();
        result.setState = jest.fn();
        instance._deleteDepartment = jest.fn();

        instance._handleCloseNotificationPopup(true);

        expect(result.setState).toHaveBeenCalledWith({ message: '' });
        expect(instance._deleteDepartment).not.toHaveBeenCalled();
    });

    it('_handleDeleteDepartment - should be called when click delete button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });

        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('Button').at(3).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ message: `Are you sure you want to delete this department?`, isConfirmPopup: true, selectedDepartmentId: 123 });
    });

    it('_handleEditDepartment - should be called when click edit button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setSelectedDepartmentId: jest.fn(), setOpenInsertUpdatePopup: jest.fn() });

        const wrapper = shallow(<Content {...props} />);
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('Button').at(2).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setSelectedDepartmentId).toHaveBeenCalledWith(123);
        expect(props.setOpenInsertUpdatePopup).toHaveBeenCalledWith(true);
    });

    it('_handleEditDepartment - should be called when click add button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setSelectedDepartmentId: jest.fn(), setOpenInsertUpdatePopup: jest.fn() });

        const wrapper = shallow(<Content {...props} />);

        wrapper.find('Button').at(0).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setSelectedDepartmentId).toHaveBeenCalledWith(0);
        expect(props.setOpenInsertUpdatePopup).toHaveBeenCalledWith(true);
    });

    it('_handleEditPolicy - should be called when click policy button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });

        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('Button').at(1).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ isShowPolicyPopup: true, selectedDepartmentId: 123, departmentName: 'IT' });
    });

    it('_handleShowDepartmentPopup - should be called when click policy button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });

        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ isShowDepartmentPopup: true, selectedDepartmentId: 123, departmentName: 'IT' });
    });

    it('_deleteDepartment - should call deleteDepartment with delete successfully', async () => {
        const expectedResult = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), deleteDepartment: jest.fn(() => expectedResult) });
        const wrapper = shallow(<Content {...props} />);

        await wrapper.instance()._deleteDepartment(123);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
        expect(props.deleteDepartment).toHaveBeenCalledWith({ departmentId: 123 });
        expect(props.fetchData).toHaveBeenCalled();
    });

    it('_deleteDepartment - should call deleteDepartment with delete is failed', async () => {
        const expectedResult = { IsSuccessful: false, Message: "Delete is failed!" };
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), deleteDepartment: jest.fn(() => expectedResult) });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteDepartment(123);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
        expect(props.deleteDepartment).toHaveBeenCalledWith({ departmentId: 123 });
        expect(wrapper.setState).toHaveBeenCalledWith({ message: "Delete is failed!", isConfirmPopup: false });
    });

    it('_deleteDepartment - should call deleteDepartment with error', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), deleteDepartment: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteDepartment(123);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
        expect(props.deleteDepartment).toHaveBeenCalledWith({ departmentId: 123 });
        expect(wrapper.setState).not.toHaveBeenCalled();
    });
})