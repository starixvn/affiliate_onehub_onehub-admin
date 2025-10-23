import React from 'react';
import { EmailDetailForm } from '../EmailDetailForm';
import { shallow } from 'enzyme';

describe('email history - components - EmailDetailForm ', () => {
    const defaultProps = {
        selectedEmailId: 2205,
        param: {
            FromDate: "6/28/2019",
            IsGetAll: true,
            PageIndex: 1,
            PageSize: 20,
            SearchById: 1,
            SearchText: "",
            ToDate: "6/28/2019"
        }
    }

    const dataItem = {
        AffName: "12BETAFF12885",
        Content: null,
        Email: "te@te1.com",
        EmailId: 2205,
        Sender: "test test1",
        SentDateText: "12/14/2018 03:11:25",
        Subject: "Captcha Test 10"
    }

    it('render correctly', () => {
        const result = shallow(<EmailDetailForm {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have dataItem', () => {
        const result = shallow(<EmailDetailForm {...defaultProps} />);
    
        result.setState({ dataItem });
    
        expect(result).toMatchSnapshot();
    });

    it('render correctly with have dataItem and isSuccess is false', () => {
        const result = shallow(<EmailDetailForm {...defaultProps} />);
    
        result.setState({ dataItem, isSuccess: false });
    
        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call handleGetEmailHistoryDetail if selectedEmailId change', () => {
        const props = Object.assign({}, defaultProps, { selectedEmailId: 2255 });
        const componentInstance = new EmailDetailForm(props);
        componentInstance.handleGetEmailHistoryDetail = jest.fn();
        componentInstance.componentDidUpdate(defaultProps);

        expect(componentInstance.handleGetEmailHistoryDetail).toHaveBeenCalledWith(2255);
    });

    it('handleDelete - should not call toggleLoader with isConfirmed is false', () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EmailDetailForm {...props} />);
        wrapper.setState({ dataItem });
        window.confirm = jest.fn(() => false);

        wrapper.find('Button').at(0).simulate('click');
    
        expect(props.toggleLoader).not.toHaveBeenCalled();
    });

    it('handleGetEmailHistoryDetail - should call getEmailHistoryDetail', async () => {
        const toggleLoader = jest.fn();
        const getEmailHistoryDetail = jest.fn(() => dataItem);
        const props = Object.assign({}, defaultProps, { toggleLoader, getEmailHistoryDetail });
        const wrapper = shallow(<EmailDetailForm {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance().handleGetEmailHistoryDetail(2205);
    
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.getEmailHistoryDetail).toHaveBeenCalledWith(2205);
        expect(wrapper.setState).toHaveBeenCalledWith({ dataItem });
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('_handleDeleteEmail - should not setState', async () => {
        const wrapper = shallow(<EmailDetailForm {...defaultProps} />);
        wrapper.setState({ dataItem });
        wrapper.setState = jest.fn();

        await wrapper.find('Button').at(0).simulate('click');

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: 'Are you sure to delete the selected email?', isConfirmPopup: true, selectedEmailId: 2205 });
    });

    it('_deleteEmail - should not toggleLoader and deleteEmailHistory with isConfirmed is true and response is null', async () => {
        const toggleLoader = jest.fn();
        const deleteEmailHistory = jest.fn();
        const props = Object.assign({}, defaultProps, { toggleLoader, deleteEmailHistory });
        const wrapper = shallow(<EmailDetailForm {...props} />);
        wrapper.setState({ dataItem });
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        await wrapper.instance()._deleteEmail(2205);
    
        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.deleteEmailHistory).toHaveBeenCalledWith({ EmailIdList: 2205 });
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('_deleteEmail - should not toggleLoader and deleteEmailHistory with isConfirmed is true and response is not success', async () => {
        const data = { IsSuccessful: false, Message: 'Delete Email is failed!' };
        const toggleLoader = jest.fn();
        const deleteEmailHistory = jest.fn(() => data);
        const props = Object.assign({}, defaultProps, { toggleLoader, deleteEmailHistory });
        const wrapper = shallow(<EmailDetailForm {...props} />);
        wrapper.setState({ dataItem });
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn());

        await wrapper.instance()._deleteEmail(2205);
    
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.deleteEmailHistory).toHaveBeenCalledWith({ EmailIdList: 2205 });
        expect(wrapper.setState).toHaveBeenCalledTimes(1);
        expect(wrapper.setState.mock.calls[0][0]).toEqual({
            isShowMessage: true,
            isSuccess: false,
            message: 'Delete Email is failed!'
        });
        expect(wrapper.setState.mock.calls[0][1]).toEqual(expect.any(Function));
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('_deleteEmail - should not toggleLoader and deleteEmailHistory with isConfirmed is true and response is successful', async () => {
        const data = { IsSuccessful: true, Message: '' };
        const toggleLoader = jest.fn();
        const deleteEmailHistory = jest.fn(() => data);
        const setSelectedEmailId = jest.fn();
        const fetchData = jest.fn();
        const props = Object.assign({}, defaultProps, { toggleLoader, deleteEmailHistory, setSelectedEmailId, fetchData });
        const wrapper = shallow(<EmailDetailForm {...props} />);
        wrapper.setState({ dataItem });
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn());

        await wrapper.instance()._deleteEmail(2205);
    
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.deleteEmailHistory).toHaveBeenCalledWith({ EmailIdList: 2205 });
        expect(wrapper.setState).toHaveBeenCalledTimes(1);
        expect(wrapper.setState.mock.calls[0][0]).toEqual({
            isShowMessage: true,
            isSuccess: true,
            message: 'Delete Email Successfully'
        });
        expect(wrapper.setState.mock.calls[0][1]).toEqual(expect.any(Function));
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('handleClosePopup - setSelectedEmailId when click Cancel button', async () => {
        const setSelectedEmailId = jest.fn();
        const props = Object.assign({}, defaultProps, { setSelectedEmailId });
        const result = shallow(<EmailDetailForm {...props} />);
        result.setState({ dataItem });

        await result.find('Button').at(1).simulate('click');
    
        expect(props.setSelectedEmailId).toHaveBeenCalledWith(null);
    });

    it('handleCloseNotificationPopup - should call setState and _deleteEmail', async () => {
        const wrapper = shallow(<EmailDetailForm {...defaultProps} />);
        wrapper.setState({ selectedEmailId: 123 });
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._deleteEmail = jest.fn();

        await instance.handleCloseNotificationPopup(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: '' });
        expect(instance._deleteEmail).toHaveBeenCalledWith(123);
    });

    it('handleCloseNotificationPopup - should call setState but not call _deleteEmail', async () => {
        const wrapper = shallow(<EmailDetailForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._deleteEmail = jest.fn();

        await instance.handleCloseNotificationPopup(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: '' });
        expect(instance._deleteEmail).not.toHaveBeenCalled();
    });
})