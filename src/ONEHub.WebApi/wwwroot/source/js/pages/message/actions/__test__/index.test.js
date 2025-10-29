import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../modules/ajaxRequest';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setParam', type: types.SET_PARAM, data: { Id: 123 } },
    { name: 'setSelectedMessageId', type: types.SET_SELECTED_Message_id, data: 123456 },
    { name: 'setCheckedMessages', type: types.SET_CHECKED_MESSAGES, data: { 123456: false } },
    { name: 'setShouldResetScrollPosition', type: types.SHOULD_RESET_SCROLL_POSITION, data: false },
    { name: 'setGridData', type: types.SET_GRID_DATA, data: 'setGridData' }
];

describe('message actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        Creator: "sa",
                        Important: true,
                        Message: "test",
                        MessageId: 37,
                        PostedDate: "2019-09-13T02:12:43.987",
                        PostedDateText: "09/13/2019 02:12:43",
                        UpdatedBy: "sa",
                        UpdatedDate: "2019-09-16T02:38:23.327",
                        UpdatedDateText: "09/16/2019 02:38:23"
                    },
                    {
                        Creator: "pgmDung",
                        Important: false,
                        Message: "aaajj",
                        MessageId: 6,
                        PostedDate: "2013-02-18T05:58:53.23",
                        PostedDateText: "02/18/2013 05:58:53",
                        UpdatedBy: "pgmDung",
                        UpdatedDate: "2013-02-18T22:39:10.73",
                        UpdatedDateText: "02/18/2013 22:39:10"
                    }
                ],
                TotalItem: 2
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: 'TOGGLE_LOADER', data: true },
            { type: types.SET_GRID_DATA, data: expectedResponse.data.MainData },
            { type: 'SET_PAGING_OPTION', data: { PageIndex: 1, PageSize: 20, TotalItem: 2 } },
            { type: types.SHOULD_RESET_SCROLL_POSITION, data: true },
            { type: types.SET_CHECKED_MESSAGES, data: { 37: false, 6: false } },
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            FromDate: "9/19/2019",
            Important: null,
            IsGetAll: true,
            PageIndex: 1,
            PageSize: 20,
            ToDate: "9/19/2019"
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/GetMessageList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to fetchData with incorrect parameter', () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: 'TOGGLE_LOADER', data: true },
            { type: types.SET_GRID_DATA, data: [] },
            { type: 'SET_PAGING_OPTION', data: { PageIndex: 1, PageSize: 20, TotalItem: 0 } },
            { type: types.SHOULD_RESET_SCROLL_POSITION, data: true },
            { type: types.SET_CHECKED_MESSAGES, data: {} },
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            FromDate: "9/19/2019",
            Important: null,
            IsGetAll: false,
            PageIndex: 1,
            PageSize: 20,
            ToDate: "9/19/2019"
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/GetMessageList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getMessageDetail with correct parameter', async () => {
        const expectedResponse = {
            data: {
                Creator: "sa",
                Important: true,
                Message: "test",
                MessageId: 37,
                PostedDate: "2019-09-13T02:12:43.987",
                PostedDateText: "09/13/2019 02:12:43",
                UpdatedBy: "sa",
                UpdatedDate: "2019-09-16T02:38:23.327",
                UpdatedDateText: "09/16/2019 02:38:23"
            }, status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const selectedMessageId = 37;

        const result = await actions['getMessageDetail'](selectedMessageId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/GetMessageDetail', { selectedMessageId: 37 });

        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to getMessageDetail with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const selectedMessageId = 123456;

        const result = await actions['getMessageDetail'](selectedMessageId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/GetMessageDetail', { selectedMessageId: 123456 });
        expect(result).toEqual(null);
    })

    it('should create action to insertMessage with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            Message_cs: "",
            Message_en: "test",
            Message_es: "",
            Message_id: "",
            Message_jp: "",
            Message_ko: "",
            Message_th: "",
            Message_ch: "",
            Message_vn: "",
            MessageId: 0,
            important: false
        };

        const result = await actions['insertMessage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/insertMessage', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to insertMessage with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            Message_cs: "",
            Message_en: "",
            Message_es: "",
            Message_id: "",
            Message_jp: "",
            Message_ko: "",
            Message_th: "",
            Message_ch: "",
            Message_vn: "",
            MessageId: 0,
            important: false
        };

        const result = await actions['insertMessage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/insertMessage', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateMessage with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            Message_cs: "",
            Message_en: "test",
            Message_es: "",
            Message_id: "",
            Message_jp: "",
            Message_ko: "",
            Message_th: "",
            Message_ch: "",
            Message_vn: "",
            MessageId: 37,
            important: false
        };

        const result = await actions['updateMessage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/UpdateMessage', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateMessage with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            Message_cs: "",
            Message_en: "",
            Message_es: "",
            Message_id: "",
            Message_jp: "",
            Message_ko: "",
            Message_th: "",
            Message_ch: "",
            Message_vn: "",
            MessageId: 37,
            important: false
        };

        const result = await actions['updateMessage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/UpdateMessage', param);
        expect(result).toEqual(null);
    })

    it('should create action to deleteMessages with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const messageIdList = '37,6';

        const result = await actions['deleteMessages'](messageIdList)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/DeleteMessages', { messageIdList });

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to deleteMessages with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const messageIdList = '123456';

        const result = await actions['deleteMessages'](messageIdList)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Message/DeleteMessages', { messageIdList });
        expect(result).toEqual(null);
    })
});