import React from 'react';
import { NoteModificationForm } from '../NoteModificationForm';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../../modules/constants';

describe('note - common - components - NoteModificationForm ', () => {
    const noteInfo = {
        noteContent: "12BETAFF226",
        noteId: 1001
    };
    const newNote = {
        noteContent: "12BETAFF 226",
        noteId: 0
    };
    const defaultProps = {
        affId: 1271808,
        isShowPopup: true,
        pagingOption: defaultPagingOption,
        noteInfo
    };

    it('render correctly with update Note', () => {
        const result = shallow(<NoteModificationForm {...defaultProps} />);
        result.setState({ isSuccess: false, isClickedSubmit: true });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with add Note', () => {
        const props = Object.assign({}, defaultProps, { noteInfo: { noteId: 0, noteContent: '' } });
        const result = shallow(<NoteModificationForm {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call setState if noteInfo change', () => {
        const componentInstance = new NoteModificationForm(defaultProps);
        componentInstance.setState = jest.fn();
        componentInstance.componentDidUpdate({ noteInfo: { NoteId: 0, NoteContent: '' } });

        expect(componentInstance.setState).toHaveBeenCalledWith({ noteContent: '12BETAFF226' });
    });

    it('handleChange - should call setState with change note content', () => {
        const event = {
            target: {
                value: '12BETAFF 226',
                name: 'noteContent'
            }
        }
        const wrapper = shallow(<NoteModificationForm {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="textarea"][name="noteContent"][id="noteContent"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ noteContent: '12BETAFF 226' });
    });

    it('_validateNoteContent - return correct data', () => {
        const wrapper = shallow(<NoteModificationForm {...defaultProps} />);
        wrapper.setState({ noteContent: '12BETAFF 226' });

        const result = wrapper.instance()._validateNoteContent();

        expect(result).toEqual({ isValid: true, message: "" });
    });

    it('_validateNoteContent - return incorrect data with noteContent is empty', () => {
        const wrapper = shallow(<NoteModificationForm {...defaultProps} />);
        wrapper.setState({ noteContent: '' });

        const result = wrapper.instance()._validateNoteContent();

        expect(result).toEqual({ isValid: false, message: "This field is required" });
    });

    it('_validateNoteContent - return incorrect data with noteContent > max lenght', () => {
        const wrapper = shallow(<NoteModificationForm {...defaultProps} />);
        wrapper.setState({
            noteContent: '_validateNoteContent - return incorrect data with noteContent > max lenght, '
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
                + '_validateNoteContent - return incorrect data with noteContent > max lenght'
        });

        const result = wrapper.instance()._validateNoteContent();

        expect(result).toEqual({ isValid: false, message: "This field must not exceed 1000 characters" });
    });

    it('handleSave - should call setState and Save when click Add button', () => {
        const props = Object.assign({}, defaultProps, { noteInfo: { noteId: 0, noteContent: '' } });
        const wrapper = shallow(<NoteModificationForm {...props} />);
        wrapper.setState({ noteContent: '12BETAFF 226' });
        wrapper.setState = jest.fn();
        wrapper.instance().Save = jest.fn();

        wrapper.find('Button').at(0).simulate('click');

        expect(wrapper.instance().Save).toHaveBeenCalledWith(newNote);
        expect(wrapper.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
    });

    it('handleSave - should call setState but not call Save when click Add button', () => {
        const props = Object.assign({}, defaultProps, { noteInfo: { noteId: 0, noteContent: '' } });
        const wrapper = shallow(<NoteModificationForm {...props} />);
        wrapper.setState = jest.fn();
        wrapper.instance().Save = jest.fn();

        wrapper.find('Button').at(0).simulate('click');

        expect(wrapper.instance().Save).not.toHaveBeenCalled();
        expect(wrapper.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
    });

    it('Save - should call insertNote and setState with response null', async () => {
        const props = Object.assign({}, defaultProps, { noteInfo: { noteId: 0, noteContent: '' }, insertNote: jest.fn(() => null) });
        const wrapper = shallow(<NoteModificationForm {...props} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn());

        await wrapper.instance().Save(newNote);

        expect(props.insertNote).toHaveBeenCalledWith({ affId: 1271808, ...newNote });
        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: "The request is failed" }, expect.any(Function)]);
    });

    it('Save - should call insertNote and setState with response data', async () => {
        const data = { IsSuccessful: false, Message: 'Add note is failed!' }
        const props = Object.assign({}, defaultProps, { noteInfo: { noteId: 0, noteContent: '' }, insertNote: jest.fn(() => data) });
        const wrapper = shallow(<NoteModificationForm {...props} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn());

        await wrapper.instance().Save(newNote);

        expect(props.insertNote).toHaveBeenCalledWith({ affId: 1271808, ...newNote });
        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: "Add note is failed!" }, expect.any(Function)]);
    });

    it('Save - should call insertNote and setState with response data is successfful', async () => {
        const data = { IsSuccessful: true, Message: '' };
        const setShowPopup = jest.fn();
        const getNoteList = jest.fn();
        const props = Object.assign({}, defaultProps, { noteInfo: { noteId: 0, noteContent: '' }, insertNote: jest.fn(() => data), getNoteList, setShowPopup });
        const wrapper = shallow(<NoteModificationForm {...props} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn());

        await wrapper.instance().Save(newNote);

        expect(props.insertNote).toHaveBeenCalledWith({ affId: 1271808, ...newNote });
        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: true, message: "Add Note is successful" }, expect.any(Function)]);
        //expect(props.setShowPopup).toHaveBeenCalledWith(false);
        //expect(props.getNoteList).toHaveBeenCalledWith({ affId: 1271808, pageIndex: 1, pageSize: 20 });
    });

    it('handleSave - should call setState and Save when click Update button', () => {
        const wrapper = shallow(<NoteModificationForm {...defaultProps} />);
        wrapper.setState({ noteContent: '12BETAFF 226' });
        wrapper.setState = jest.fn();
        wrapper.instance().Save = jest.fn();

        wrapper.find('Button').at(0).simulate('click');

        expect(wrapper.instance().Save).toHaveBeenCalledWith({ noteContent: "12BETAFF 226", noteId: 1001 });
        expect(wrapper.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
    });

    it('handleSave - should call setState but not call Save when click Update button', () => {
        const wrapper = shallow(<NoteModificationForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        wrapper.instance().Save = jest.fn();

        wrapper.find('Button').at(0).simulate('click');

        expect(wrapper.instance().Save).not.toHaveBeenCalled();
        expect(wrapper.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
    });

    it('Save - should call updateNote and setState with response null', async () => {
        const props = Object.assign({}, defaultProps, { updateNote: jest.fn(() => null) });
        const wrapper = shallow(<NoteModificationForm {...props} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn());

        await wrapper.instance().Save(noteInfo);

        expect(props.updateNote).toHaveBeenCalledWith({ affId: 1271808, ...noteInfo });
        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: "The request is failed" }, expect.any(Function)]);
    });

    it('Save - should call updateNote and setState with response data', async () => {
        const data = { IsSuccessful: false, Message: 'Update note is failed!' }
        const props = Object.assign({}, defaultProps, { updateNote: jest.fn(() => data) });
        const wrapper = shallow(<NoteModificationForm {...props} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn());

        await wrapper.instance().Save(noteInfo);

        expect(props.updateNote).toHaveBeenCalledWith({ affId: 1271808, ...noteInfo });
        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: "Update note is failed!" }, expect.any(Function)]);
    });

    it('Save - should call updateNote and setState with response data is successfful', async () => {
        const data = { IsSuccessful: true, Message: '' };
        const setShowPopup = jest.fn();
        const getNoteList = jest.fn();
        const props = Object.assign({}, defaultProps, { updateNote: jest.fn(() => data), getNoteList, setShowPopup });
        const wrapper = shallow(<NoteModificationForm {...props} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn());

        await wrapper.instance().Save(noteInfo);

        expect(props.updateNote).toHaveBeenCalledWith({ affId: 1271808, ...noteInfo });
        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: true, message: "Update Note is successful" }, expect.any(Function)]);
        //expect(props.setShowPopup).toHaveBeenCalledWith(false);
        //expect(props.getNoteList).toHaveBeenCalledWith({ affId: 1271808, pageIndex: 1, pageSize: 20 });
    });

    it('handleClosePopup - should call setShowPopup and setState when click Cancel button', () => {
        const setShowPopup = jest.fn();
        const props = Object.assign({}, defaultProps, { setShowPopup });
        const wrapper = shallow(<NoteModificationForm {...props} />);
        wrapper.setState = jest.fn();

        wrapper.find('Button').at(1).simulate('click');

        expect(props.setShowPopup).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ noteContent: '', isClickedSubmit: false });
    });
})