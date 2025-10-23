import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../../../modules/ajaxRequest';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setAffNoteList', type: types.SET_AFF_NOTE_LIST, data: [{ NoteId: 123456 }] },
    { name: 'setShowPopup', type: types.SET_SHOW_POPUP, data: true },
    { name: 'setAffNoteInfo', type: types.SET_AFF_NOTE_INFO, data: { NoteId: 123456 } }
];

describe('aff-note actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to getAffNoteList with correct parameter', () => {
        const expectedResponse = {
            data: {
                MainData: [
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
                ],
                TotalItem: 2
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: 'TOGGLE_LOADER_USER_PANEL', data: true },
            { type: types.SET_AFF_NOTE_LIST, data: expectedResponse.data.MainData },
            { type: 'SET_PAGING_OPTION', data: { PageIndex: 1, PageSize: 20, TotalItem: 2 } },
            { type: 'TOGGLE_LOADER_USER_PANEL', data: false },
        ];
        const param = {
            affId: 1271808,
            pageIndex: 1,
            pageSize: 20
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getAffNoteList'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/AffNote/GetAffNoteList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getAffNoteList with incorrect parameter', () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: 'TOGGLE_LOADER_USER_PANEL', data: true },
            { type: types.SET_AFF_NOTE_LIST, data: [] },
            { type: 'SET_PAGING_OPTION', data: { PageIndex: 1, PageSize: 20, TotalItem: 0 } },
            { type: 'TOGGLE_LOADER_USER_PANEL', data: false },
        ];
        const param = {
            affId: 123456,
            pageIndex: 1,
            pageSize: 20
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getAffNoteList'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/AffNote/GetAffNoteList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getAffNoteContentById with correct parameter', async () => {
        const expectedResponse = {
            data: {
                CreatedBy: null,
                LastModifyText: "N/A",
                NoteContent: "12BETAFF226",
                NoteId: 1001
            }, status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            affId: 1271808,
            noteId: 1001
        };

        const result = await actions['getAffNoteContentById'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/AffNote/GetAffNoteContentById', param);

        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to getAffNoteContentById with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            noteId: 123456
        };

        const result = await actions['getAffNoteContentById'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/AffNote/GetAffNoteContentById', param);
        expect(result).toEqual(null);
    })

    it('should create action to insertAffNote with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            affId: 1271808,
            noteContent: "Insert note.",
            noteId: 0
        }

        const result = await actions['insertAffNote'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/AffNote/InsertAffNote', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to insertAffNote with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            noteContent: "",
            noteId: 0
        }

        const result = await actions['insertAffNote'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/AffNote/InsertAffNote', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateAffNote with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            affId: 1271808,
            noteContent: "12BETAFF226",
            noteId: 1001
        }

        const result = await actions['updateAffNote'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/AffNote/UpdateAffNote', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateAffNote with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            noteContent: "",
            noteId: 123456
        }

        const result = await actions['updateAffNote'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/AffNote/UpdateAffNote', param);
        expect(result).toEqual(null);
    })
});