import React from 'react';
import { NoteContent } from '../NoteContent';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../../modules/constants';

describe('note - common - components - Content', () => {
    const noteList = [
        {
            CreatedBy: "AAHubert",
            LastModifyText: "06/20/2019 22:21:05",
            NoteContent: "Test Test",
            NoteId: 615
        },
        {
            CreatedBy: "AAwalter",
            LastModifyText: "06/19/2019 00:02:05",
            NoteContent: "Testing5555 update",
            NoteId: 982
        }
    ];
    const defaultProps = {
        affId: 1271808,
        pagingOption: defaultPagingOption,
        noteInfo: {
            noteContent: "",
            noteId: 0
        },
        noteList,
        isEditNote: true,
        getNoteList: jest.fn()
    };

    it('render correctly', () => {
        const props = Object.assign({}, defaultProps, { noteList: null });
        const result = shallow(<NoteContent {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data', () => {
        const result = shallow(<NoteContent {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data is empty', () => {
        const props = Object.assign({}, defaultProps, { noteList: {} });
        const result = shallow(<NoteContent {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('getNoteContentById - should call toggleLoaderUserPanel, getNoteContentById and setNoteInfo with correct parameter', async () => {
        const data = {
            CreatedBy: null,
            LastModifyText: "N/A",
            NoteContent: "12BETAFF226",
            NoteId: 1001
        };
        const toggleLoaderUserPanel = jest.fn();
        const setNoteInfo = jest.fn();
        const getNoteContentById = jest.fn(() => data);
        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setNoteInfo, getNoteContentById });
        const componentInstance = new NoteContent(props);

        await componentInstance.getNoteContentById(1001);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);
        expect(props.getNoteContentById).toHaveBeenCalledWith({ affId: 1271808, noteId: 1001 });
        expect(props.setNoteInfo).toHaveBeenCalledWith({ noteContent: "12BETAFF226", noteId: 1001 });
    });

    it('fetchData - should call toggleLoaderUserPanel and getNoteContentById, but not call setNoteInfo with incorrect parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const setNoteInfo = jest.fn();
        const getNoteContentById = jest.fn();
        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setNoteInfo, getNoteContentById });
        const componentInstance = new NoteContent(props);

        await componentInstance.getNoteContentById(-1001);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);
        expect(props.getNoteContentById).toHaveBeenCalledWith({ affId: 1271808, noteId: -1001 });
        expect(props.setNoteInfo).not.toHaveBeenCalled();
    });

    it('handleShowPopup - should be called when click Add Button', () => {
        const wrapper = shallow(<NoteContent {...defaultProps} />);
        wrapper.instance().handleShowPopup = jest.fn();

        wrapper.find('Button').simulate('click');

        expect(wrapper.instance().handleShowPopup).toHaveBeenCalledWith(0);
    });

    it('handleShowPopup - should be called when click Edit Note Button', () => {
        const wrapper = shallow(<NoteContent {...defaultProps} />);

        wrapper.instance().handleShowPopup = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(noteList[0], 1)}</div>);

        dataRow.find('Button').simulate('click');

        expect(wrapper.instance().handleShowPopup).toHaveBeenCalledWith(615);
    });

    it('handleShowPopup - should call setShowPopup and setNoteInfo', () => {
        const props = Object.assign({}, defaultProps, { setShowPopup: jest.fn(), setNoteInfo: jest.fn() });
        const wrapper = shallow(<NoteContent {...props} />);

        wrapper.instance().handleShowPopup(0);

        expect(props.setShowPopup).toHaveBeenCalledWith(true);
        expect(props.setNoteInfo).toHaveBeenCalledWith({ noteId: 0, noteContent: '' });
    });

    it('handleShowPopup - should call setShowPopup and getNoteContentById', () => {
        const props = Object.assign({}, defaultProps, { setShowPopup: jest.fn() });
        const wrapper = shallow(<NoteContent {...props} />);
        wrapper.instance().getNoteContentById = jest.fn();

        wrapper.instance().handleShowPopup(1001);

        expect(props.setShowPopup).toHaveBeenCalledWith(true);
        expect(wrapper.instance().getNoteContentById).toHaveBeenCalledWith(1001);
    });

    it('handlePaging - should call getNoteList', () => {
        const setPagingOption = jest.fn();
        const pageIndex = 2;
        const pageSize = 50;
        const paramExpect = { affId: defaultProps.affId, pageIndex, pageSize };

        const props = Object.assign({}, defaultProps, { setPagingOption });
        const componentInstance = new NoteContent(props);
        componentInstance.fetchData = jest.fn();

        componentInstance.handlePaging(pageIndex, pageSize);

        expect(props.getNoteList).toHaveBeenCalledWith(paramExpect);
    });
});