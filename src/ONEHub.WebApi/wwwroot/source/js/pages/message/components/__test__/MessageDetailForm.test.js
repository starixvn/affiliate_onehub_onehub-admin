import React from 'react';
import { MessageDetailForm } from '../MessageDetailForm';
import { shallow } from 'enzyme';

import ButtonDeleteItems from '../../../common/components/ButtonDeleteItems';

describe('message - components - MessageDetailForm ', () => {
    const message = 'Please enter the content of message, one language at least.';

    const messageContentList = {
        Message_cs: "",
        Message_en: "test",
        Message_es: "",
        Message_id: "",
        Message_jp: "",
        Message_ko: "",
        Message_th: "",
        Message_ch: "",
        Message_vn: "",
        MessageId: 0
    };

    const languages = {
        En: "English"
    }

    const param = {
        FromDate: "9/20/2019",
        Important: null,
        IsGetAll: true,
        PageIndex: 1,
        PageSize: 20,
        ToDate: "9/20/2019"
    };

    const defaultProps = {
        selectedMessageId: 37,
        param,
        defaultMessageContentList: messageContentList,
        languages
    };

    it('render correctly with update', () => {
        const result = shallow(<MessageDetailForm {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with update and Notification', () => {
        const result = shallow(<MessageDetailForm {...defaultProps} />);
        result.setState({ isClickedEdit: true, messageNotification: "abc", isSuccess: false })

        expect(result).toMatchSnapshot();
    });

    it('render correctly with insert', () => {
        const props = Object.assign({}, defaultProps, { selectedMessageId: 0 });
        const result = shallow(<MessageDetailForm {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with current message', () => {
        const props = Object.assign({}, defaultProps, { selectedMessageId: -1 });
        const result = shallow(<MessageDetailForm {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with not show popup', () => {
        const props = Object.assign({}, defaultProps, { selectedMessageId: null });
        const result = shallow(<MessageDetailForm {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate should call setState', () => {
        const props = Object.assign({}, defaultProps, { selectedMessageId: 0 });
        const result = shallow(<MessageDetailForm {...props} />);

        result.setState = jest.fn();

        result.instance().componentDidUpdate(defaultProps);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: true });
    });

    it('componentDidUpdate should call setState and _handleGetMessageDetail', () => {
        const props = Object.assign({}, defaultProps, { selectedMessageId: -1 });
        const result = shallow(<MessageDetailForm {...props} />);
        result.setState = jest.fn();

        const instance = result.instance();
        instance._handleGetMessageDetail = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: false });
        expect(instance._handleGetMessageDetail).toHaveBeenCalledWith(-1);
    });

    it('componentDidUpdate should not call setState and _handleGetMessageDetail', () => {
        const result = shallow(<MessageDetailForm {...defaultProps} />);
        result.setState = jest.fn();

        const instance = result.instance();
        instance._handleGetMessageDetail = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(result.setState).not.toHaveBeenCalled();
        expect(instance._handleGetMessageDetail).not.toHaveBeenCalled();
    });

    it('_handleGetMessageDetail should call getMessageDetail and setState', async () => {
        const MessageId = 37;
        const expectedReponse = {
            ...messageContentList,
            MessageId,
            Important: false
        };
        const props = Object.assign({}, defaultProps, { getMessageDetail: jest.fn(() => expectedReponse) });
        const result = shallow(<MessageDetailForm {...props} />);

        result.setState = jest.fn();

        await result.instance()._handleGetMessageDetail(MessageId);

        expect(props.getMessageDetail).toHaveBeenCalledWith(MessageId);
        expect(result.setState).toHaveBeenCalledWith({ messageContentList: { ...messageContentList, MessageId: "37" }, important: false });
    });

    it('_handleGetMessageDetail should call getMessageDetail but not call setState', async () => {
        const MessageId = 37;
        const props = Object.assign({}, defaultProps, { getMessageDetail: jest.fn(() => null) });
        const result = shallow(<MessageDetailForm {...props} />);

        result.setState = jest.fn();

        await result.instance()._handleGetMessageDetail(MessageId);

        expect(props.getMessageDetail).toHaveBeenCalledWith(MessageId);
        expect(result.setState).not.toHaveBeenCalled();
    });

    it('important should be changed when click checkbox', () => {
        const result = shallow(<MessageDetailForm {...defaultProps} />);

        result.setState = jest.fn();

        result.find('Input[type="checkbox"][name="important"]').simulate('change');

        expect(result.setState).toHaveBeenCalledWith({ important: true });
    });

    it('isClickedEdit should be changed when click Edit button', () => {
        const result = shallow(<MessageDetailForm {...defaultProps} />);

        result.setState = jest.fn();

        result.find('Button').at(0).simulate('click');

        expect(result.setState).toHaveBeenCalledWith({ isClickedEdit: true });
    });

    it('_handleShowAlert should be call when click button Delete', () => {
        const result = shallow(<MessageDetailForm {...defaultProps} />);
        result.instance()._handleShowAlert = jest.fn();

        result.find(ButtonDeleteItems).props().fetchData();

        expect(result.instance()._handleShowAlert).toHaveBeenCalledWith(true, "Delete Successfully!");
    });

    it('_handleChangeMessageContent - should call setState', async () => {
        const event = {
            target: {
                name: 'Message_en',
                value: 'test'
            }
        }
        const result = shallow(<MessageDetailForm {...defaultProps} />);
        result.setState = jest.fn();

        result.find('Input[type="textarea"][name="Message_en"][id="Message_en"]').simulate('change', event);

        expect(result.setState).toHaveBeenCalledWith({ messageContentList: { ...messageContentList, Message_en: 'test' } });
    });

    it('_validateMessageContent - return false', async () => {
        const props = Object.assign({}, defaultProps, { defaultMessageContentList: {} })
        const wrapper = shallow(<MessageDetailForm {...props} />);
        const instance = wrapper.instance();

        const result = instance._validateMessageContent();

        expect(result).toEqual({ isValid: false, message });
    });

    it('_validateMessageContent - return true', async () => {
        const wrapper = shallow(<MessageDetailForm {...defaultProps} />);
        const instance = wrapper.instance();

        const result = instance._validateMessageContent();

        expect(result).toEqual({ isValid: true, message: "" });
    });

    it('_handleSave - should call _validateMessageContent and _handleShowAlert', async () => {
        const result = {
            isValid: false,
            message
        }
        const wrapper = shallow(<MessageDetailForm {...defaultProps} />);
        const instance = wrapper.instance();

        instance._validateMessageContent = jest.fn(() => result);
        instance._handleShowAlert = jest.fn();

        instance._handleSave();

        expect(instance._validateMessageContent).toHaveBeenCalled();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, message);
    });

    it('_handleSave - should call _validateMessageContent and _save', async () => {
        const result = {
            isValid: true,
            message: ''
        }
        const wrapper = shallow(<MessageDetailForm {...defaultProps} />);
        const instance = wrapper.instance();

        instance._validateMessageContent = jest.fn(() => result);
        instance._save = jest.fn();

        instance._handleSave();

        expect(instance._validateMessageContent).toHaveBeenCalled();
        expect(instance._save).toHaveBeenCalled();
    });

    it('_handleSave - should call _validateMessageContent and setState', async () => {
        const result = {
            isValid: true,
            message: ''
        }
        const wrapper = shallow(<MessageDetailForm {...defaultProps} />);
        wrapper.setState({ isClickedEdit: true });
        const instance = wrapper.instance();

        instance._validateMessageContent = jest.fn(() => result);
        instance.setState = jest.fn();

        instance._handleSave();

        expect(instance._validateMessageContent).toHaveBeenCalled();
        expect(instance.setState).toHaveBeenCalledWith({ messageNotification: 'Are you sure you want to update this message?' });
    });

    it('_save - insertMessage is errored', async () => {
        const props = Object.assign({}, defaultProps, { selectedMessageId: 0, insertMessage: jest.fn() });
        const wrapper = shallow(<MessageDetailForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._save();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Add Failed!");
    });

    it('_save - insertMessage is failed', async () => {
        const result = { IsSuccessful: false, Message: "failed" };
        const props = Object.assign({}, defaultProps, { selectedMessageId: 0, insertMessage: jest.fn(() => result) });
        const wrapper = shallow(<MessageDetailForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._save();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "failed");
    });

    it('_save - insertMessage is successful', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { selectedMessageId: 0, insertMessage: jest.fn(() => result) });
        const wrapper = shallow(<MessageDetailForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._save();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Add Successfully!");
    });

    it('_save - updateMessage is errored', async () => {
        const props = Object.assign({}, defaultProps, { updateMessage: jest.fn() });
        const wrapper = shallow(<MessageDetailForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._save();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Update Failed!");
    });

    it('_save - updateMessage is failed', async () => {
        const result = { IsSuccessful: false, Message: "failed" };
        const props = Object.assign({}, defaultProps, { updateMessage: jest.fn(() => result) });
        const wrapper = shallow(<MessageDetailForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._save();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "failed");
    });

    it('_save - updateMessage is successful', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { updateMessage: jest.fn(() => result) });
        const wrapper = shallow(<MessageDetailForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._save();

        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Update Successfully!");
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', async () => {
        const wrapper = shallow(<MessageDetailForm {...defaultProps} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        const instance = wrapper.instance();
        instance._hideMessage = jest.fn();
        instance.modalRef.current = jest.fn();
        instance.modalRef.current.scrollTo = jest.fn();

        instance._handleShowAlert(false, 'Updated failed!');

        expect(instance.modalRef.current.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Updated failed!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState and _handleFetchData', async () => {
        const wrapper = shallow(<MessageDetailForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleFetchData = jest.fn();

        instance._hideMessage(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false, confirmResult: false });
        expect(instance._handleFetchData).toHaveBeenCalled();
    });

    it('_hideMessage - should call setState and not call _handleFetchData', async () => {
        const wrapper = shallow(<MessageDetailForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleFetchData = jest.fn();

        instance._hideMessage(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false, confirmResult: false });
        expect(instance._handleFetchData).not.toHaveBeenCalled();
    });

    it('_handleFetchData - should call _handleClosePopup and fetchData', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const wrapper = shallow(<MessageDetailForm {...props} />);
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._handleFetchData();

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(instance._handleClosePopup).toHaveBeenCalled();
    });

    it('_handleCloseNotificationPopup - should call setState and _save', async () => {
        const wrapper = shallow(<MessageDetailForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._save = jest.fn();

        instance._handleCloseNotificationPopup(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: '' });
        expect(instance._save).toHaveBeenCalled();
    });

    it('_handleCloseNotificationPopup - should call setState and not call _save', async () => {
        const wrapper = shallow(<MessageDetailForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._save = jest.fn();

        instance._handleCloseNotificationPopup(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: '' });
        expect(instance._save).not.toHaveBeenCalled();
    });

    it('_handleClosePopup - should call setSelectedMessageId and setState', async () => {
        const props = Object.assign({}, defaultProps, { setSelectedMessageId: jest.fn() });
        const wrapper = shallow(<MessageDetailForm {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance._handleClosePopup();

        expect(props.setSelectedMessageId).toHaveBeenCalledWith(null);
        expect(instance.setState).toHaveBeenCalledWith({ isClickedEdit: false, important: false, messageContentList });
    });
})