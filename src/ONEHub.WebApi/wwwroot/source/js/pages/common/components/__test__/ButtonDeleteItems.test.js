import React from 'react';
import ButtonDeleteItems from '../ButtonDeleteItems';
import { shallow } from 'enzyme';

describe('common - components - ButtonDeleteItems ', () => {
    const messages = {
        PleaseSelect: 'Please select items to delete',
        AreYouSureDeleteItems: 'Are you sure to delete the selected email(s)?',
        DeleteItemsSuccessfully: 'Delete Email(s) Successfully',
        PleaseEnter: 'Please enter the content of message, one language at least.',
        AreYouWant: 'Are you sure you want to update this message?'
    }

    const defaultProps = {
        checkedItems: {},
        messages,
        toggleLoader: jest.fn(),
        hasIcon: false
    }

    it('render correctly', () => {
        const result = shallow(<ButtonDeleteItems {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly has icon and notification', () => {
        const props = Object.assign({}, defaultProps, { hasIcon: true });
        const result = shallow(<ButtonDeleteItems {...props} />);
        result.setState({ message: 'ABC' })

        expect(result).toMatchSnapshot();
    });

    it('_handleDelete - should call setState when not select', () => {
        const wrapper = shallow(<ButtonDeleteItems {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleDelete();

        expect(wrapper.setState).toHaveBeenCalledWith({ message: 'Please select items to delete', itemIdList: "", isConfirmPopup: false });
    });


    it('_handleDelete - should call setState when selected', () => {
        const props = Object.assign({}, defaultProps, { checkedItems: { 2205: false, 2255: true } });
        const wrapper = shallow(<ButtonDeleteItems {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleDelete();

        expect(wrapper.setState).toHaveBeenCalledWith({ message: 'Are you sure to delete the selected email(s)?', isConfirmPopup: true, itemIdList: ['2255'] });
    });

    it('_deleteExcute - should call toggleLoader, deleteItems, setState and fetchData with correct parameters', async () => {
        const data = { IsSuccessful: true, Message: '' };

        const toggleLoader = jest.fn();
        const deleteItems = jest.fn(() => data);
        const fetchData = jest.fn();
        const props = Object.assign({}, defaultProps, { toggleLoader, deleteItems, fetchData, checkedItems: { 2205: false, 2255: true }, isOpenNotification: true });
        const wrapper = shallow(<ButtonDeleteItems {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteExcute(['2255']);

        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.deleteItems).toHaveBeenCalledWith("2255");
        expect(wrapper.setState).toHaveBeenCalledWith({ message: 'Delete Email(s) Successfully', itemIdList: '', isConfirmPopup: false });
        expect(props.fetchData).toHaveBeenCalledWith();
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('_deleteExcute - should call toggleLoader, deleteItems and setState but not call fetchData with IsSuccessful is false', async () => {
        const data = { IsSuccessful: false, Message: 'Delete is failed!' };

        const toggleLoader = jest.fn();
        const deleteItems = jest.fn(() => data);
        const fetchData = jest.fn();
        const props = Object.assign({}, defaultProps, { toggleLoader, deleteItems, fetchData, checkedItems: { 2205: false, 2255: true } });
        const wrapper = shallow(<ButtonDeleteItems {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteExcute(['2255']);

        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.deleteItems).toHaveBeenCalledWith("2255");
        expect(props.fetchData).not.toHaveBeenCalled();
        expect(wrapper.setState).toHaveBeenCalledWith({ message: 'Delete is failed!', itemIdList: '', isConfirmPopup: false });
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('_deleteExcute - should call toggleLoader and deleteItems but not call alert and fetchData with response is error', async () => {
        const toggleLoader = jest.fn();
        const deleteItems = jest.fn();
        const fetchData = jest.fn();
        const props = Object.assign({}, defaultProps, { toggleLoader, deleteItems, fetchData, checkedItems: { 2205: false, 2255: true } });
        const wrapper = shallow(<ButtonDeleteItems {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteExcute(['2255']);

        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.deleteItems).toHaveBeenCalledWith("2255");
        expect(props.fetchData).not.toHaveBeenCalled();
        expect(wrapper.setState).not.toHaveBeenCalled();
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
    });

    it('_handleCloseNotificationPopup - should call setState and _deleteExcute', async () => {
        const wrapper = shallow(<ButtonDeleteItems {...defaultProps} />);
        wrapper.setState({ itemIdList: ['123'] });
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._deleteExcute = jest.fn();

        await instance._handleCloseNotificationPopup(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ message: '' });
        expect(instance._deleteExcute).toHaveBeenCalledWith(['123']);
    });

    it('_handleCloseNotificationPopup - should call setState but not call _deleteExcute', async () => {
        const wrapper = shallow(<ButtonDeleteItems {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._deleteExcute = jest.fn();

        await instance._handleCloseNotificationPopup(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ message: '' });
        expect(instance._deleteExcute).not.toHaveBeenCalled();
    });
})