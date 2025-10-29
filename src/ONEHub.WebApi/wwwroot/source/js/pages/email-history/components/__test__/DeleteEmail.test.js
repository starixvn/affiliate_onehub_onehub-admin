import React from 'react';
import { DeleteEmail } from '../DeleteEmail';
import { shallow } from 'enzyme';

describe('email history - components - DeleteEmail ', () => {
    const defaultProps = {
        checkedEmails: {},
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

    it('render correctly', () => {
        const result = shallow(<DeleteEmail {...defaultProps} />);
        result.setState({ messageNotification: 'abc' })

        expect(result).toMatchSnapshot();
    });

    it('_handleDeleteEmails - should call setState when not select', () => {
        const wrapper = shallow(<DeleteEmail {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Button').simulate('click');

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: 'Please select items to delete', isConfirmPopup: false });
    });


    it('_handleDeleteEmails - should call setState when selected', () => {
        const props = Object.assign({}, defaultProps, { checkedEmails: { 2205: false, 2255: true } });
        const wrapper = shallow(<DeleteEmail {...props} />);
        wrapper.setState = jest.fn();

        wrapper.find('Button').simulate('click');

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: 'Are you sure to delete the selected emails?', isConfirmPopup: true, emailIdList: ['2255'] });
    });

    it('_deleteEmails - should call toggleLoader, deleteEmailHistory, setState and fetchData with correct parameters', async () => {
        const data = { IsSuccessful: true, Message: '' };

        const toggleLoader = jest.fn();
        const deleteEmailHistory = jest.fn(() => data);
        const fetchData = jest.fn();
        const props = Object.assign({}, defaultProps, { toggleLoader, deleteEmailHistory, fetchData, checkedEmails: { 2205: false, 2255: true } });
        const wrapper = shallow(<DeleteEmail {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteEmails(['2255']);

        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.deleteEmailHistory).toHaveBeenCalledWith({ EmailIdList: "2255" });
        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: 'Delete Emails Successfully', isConfirmPopup: false });
        expect(props.fetchData).toHaveBeenCalledWith(defaultProps.param);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('_deleteEmails - should call toggleLoader, deleteEmailHistory and setState but not call fetchData with IsSuccessful is false', async () => {
        const data = { IsSuccessful: false, Message: 'Delete is failed!' };

        const toggleLoader = jest.fn();
        const deleteEmailHistory = jest.fn(() => data);
        const fetchData = jest.fn();
        const props = Object.assign({}, defaultProps, { toggleLoader, deleteEmailHistory, fetchData, checkedEmails: { 2205: false, 2255: true } });
        const wrapper = shallow(<DeleteEmail {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteEmails(['2255']);

        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.deleteEmailHistory).toHaveBeenCalledWith({ EmailIdList: "2255" });
        expect(props.fetchData).not.toHaveBeenCalled();
        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: 'Delete is failed!', isConfirmPopup: false });
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('_deleteEmails - should call toggleLoader and deleteEmailHistory but not call alert and fetchData with response is error', async () => {
        const toggleLoader = jest.fn();
        const deleteEmailHistory = jest.fn();
        const fetchData = jest.fn();
        const props = Object.assign({}, defaultProps, { toggleLoader, deleteEmailHistory, fetchData, checkedEmails: { 2205: false, 2255: true } });
        const wrapper = shallow(<DeleteEmail {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteEmails(['2255']);

        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.deleteEmailHistory).toHaveBeenCalledWith({ EmailIdList: "2255" });
        expect(props.fetchData).not.toHaveBeenCalled();
        expect(wrapper.setState).not.toHaveBeenCalled();
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('handleCloseNotificationPopup - should call setState and _deleteEmails', async () => {
        const wrapper = shallow(<DeleteEmail {...defaultProps} />);
        wrapper.setState({ emailIdList: ['123'] });
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._deleteEmails = jest.fn();

        await instance.handleCloseNotificationPopup(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: '' });
        expect(instance._deleteEmails).toHaveBeenCalledWith(['123']);
    });

    it('handleCloseNotificationPopup - should call setState but not call _deleteEmails', async () => {
        const wrapper = shallow(<DeleteEmail {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._deleteEmails = jest.fn();

        await instance.handleCloseNotificationPopup(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: '' });
        expect(instance._deleteEmails).not.toHaveBeenCalled();
    });
})