import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../modules/ajaxRequest';

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setParam', type: types.SET_PARAM, data: { Id: 123 }},
    { name: 'setSelectedEmailId', type: types.SET_SELECTED_EMAIL_ID, data: 123456 },
    { name: 'setCheckedEmails', type: types.SET_CHECKED_EMAILS, data: { 123456: false }},
    { name: 'setShouldResetScrollPosition', type: types.SHOULD_RESET_SCROLL_POSITION, data: false },
    { name: 'setGridData', type: types.SET_GRID_DATA, data: 'setGridData' }
];

describe('email history actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        AffName: "12BETAFF12885",
                        Content: null,
                        Email: "te@te1.com",
                        EmailId: 2255,
                        Sender: "test test1",
                        SentDateText: "12/14/2018 03:11:25",
                        Subject: "Captcha Test 10"
                    },
                    {
                        AffName: "12BETAFF226",
                        Content: null,
                        Email: "maia.le4@starixsoft.com",
                        EmailId: 2205,
                        Sender: "12BETAFF226 12BETAFF226",
                        SentDateText: "10/07/2018 23:14:09",
                        Subject: "dhgd"
                    }
                ],
                TotalItem: 2
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: 'TOGGLE_LOADER' , data: true },
            { type: types.SET_GRID_DATA , data: expectedResponse.data.MainData },
            { type: 'SET_PAGING_OPTION', data: { PageIndex: 1, PageSize: 20, TotalItem: 2 }},
            { type: types.SHOULD_RESET_SCROLL_POSITION , data: true },
            { type: types.SET_CHECKED_EMAILS , data: { 2255: false, 2205: false } },
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            FromDate: "6/28/2019",
            IsGetAll: true,
            PageIndex: 1,
            PageSize: 20,
            SearchById: 0,
            SearchText: "",
            ToDate: "6/28/2019"
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/EmailHistory/GetEmailHistoryList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to fetchData with incorrect parameter', () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: 'TOGGLE_LOADER' , data: true },
            { type: types.SET_GRID_DATA , data: null },
            { type: 'SET_PAGING_OPTION', data: { PageIndex: 1, PageSize: 20, TotalItem: 0 }},
            { type: types.SHOULD_RESET_SCROLL_POSITION , data: true },
            { type: types.SET_CHECKED_EMAILS , data: {} },
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            FromDate: "6/28/2019",
            IsGetAll: true,
            PageIndex: 1,
            PageSize: 20,
            SearchById: 2,
            SearchText: "123abc123abc",
            ToDate: "6/28/2019"
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/EmailHistory/GetEmailHistoryList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getEmailHistoryDetail with correct parameter', async () => {
        const expectedResponse = { data: {
            AffName: null,
            Content: "12BETAFF12881 test",
            Email: "sdasd@test.com",
            EmailId: 2237,
            Sender: "12BETAFF12881",
            SentDateText: "12/05/2018 00:30:47",
            Subject: "12BETAFF12881"
        }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const selectedEmailId = 2237;

        const result = await actions['getEmailHistoryDetail'](selectedEmailId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/EmailHistory/GetEmailHistoryDetail', { selectedEmailId: 2237 });

        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to getEmailHistoryDetail with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const selectedEmailId = 123456;

        const result = await actions['getEmailHistoryDetail'](selectedEmailId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/EmailHistory/GetEmailHistoryDetail', { selectedEmailId: 123456 });
        expect(result).toEqual(null);
    })

    it('should create action to deleteEmailHistory with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            EmailIdList: '2237,2238'
        }

        const result = await actions['deleteEmailHistory'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/EmailHistory/DeleteEmailHistory', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to deleteEmailHistory with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            EmailIdList: '123456'
        }

        const result = await actions['deleteEmailHistory'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/EmailHistory/DeleteEmailHistory', param);
        expect(result).toEqual(null);
    })
});