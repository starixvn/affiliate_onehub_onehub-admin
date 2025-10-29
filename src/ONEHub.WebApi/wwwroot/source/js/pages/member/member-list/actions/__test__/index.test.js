import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../../modules/ajaxRequest';

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
    { name: 'setIsFromOtherPages', type: types.SET_IS_FROM_OTHER_PAGES, data: true },
    { name: 'setShouldResetScrollPosition', type: types.SHOULD_RESET_SCROLL_POSITION, data: false },
    { name: 'setGridData', type: types.SET_GRID_DATA, data: 'setGridData' }
];

describe('member list actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        MemberId: 123,
                    },
                    {
                        MemberId: 234,
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
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            AffName: "",
            UserName: "",
            IbcUserName: "",
            PageIndex: 1,
            PageSize: 20,
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Player/GetMemberList', param);
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
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            AffName: "abc123",
            UserName: "",
            IbcUserName: "",
            PageIndex: 1,
            PageSize: 20,
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Player/GetMemberList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    //it('should create action to deleteMember with correct parameter', async () => {
    //    const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
    //    ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
    //    const memberId = 123;

    //    const result = await actions['deleteMember'](memberId)();

    //    expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Member/Deletemember', { memberId });

    //    expect(result).toEqual({ IsSuccessful: true, Message: "" });
    //})

    //it('should create action to deleteMember with incorrect parameter', async () => {
    //    ajaxRequest.post = jest.fn();
    //    const memberId = -234;

    //    const result = await actions['deleteMember'](memberId)();

    //    expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Member/Deletemember', { memberId });
    //    expect(result).toEqual(null);
    //})
});