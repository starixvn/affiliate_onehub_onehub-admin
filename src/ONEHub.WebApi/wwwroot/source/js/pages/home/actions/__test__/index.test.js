import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../modules/ajaxRequest';
import { defaultGeneralInfo } from '../../libs/constants';

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
    { name: 'setGeneralInfo', type: types.SET_GENERAL_INFO, data: { PaymentReqNum: 1 } },
    { name: 'setOnlineList', type: types.SET_ONLINE_LIST, data: [{ UserName: 'sa' }] }
];

describe('home actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to getOnlineList with correct parameter', () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        UserName: "sa"
                    },
                    {
                        UserName: "pgmDung"
                    }
                ],
                TotalItem: 2
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            //{ type: 'TOGGLE_LOADER' , data: true },
            { type: types.SET_ONLINE_LIST, data: expectedResponse.data.MainData },
            { type: 'SET_PAGING_OPTION', data: { PageIndex: 1, PageSize: 20, TotalItem: 2 } },
            //{ type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            pageIndex: 1,
            pageSize: 20
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getOnlineList'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Home/GetOnlineList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getOnlineList with incorrect parameter', () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            //{ type: 'TOGGLE_LOADER' , data: true },
            { type: types.SET_ONLINE_LIST, data: [] },
            { type: 'SET_PAGING_OPTION', data: { PageIndex: 1, PageSize: 20, TotalItem: 0 } },
            //{ type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            pageIndex: 1,
            pageSize: 20
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getOnlineList'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Home/GetOnlineList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getGeneralInfo with return correctly', async () => {
        const expectedResponse = { data: { PaymentReqNum: 1 }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: 'TOGGLE_LOADER', data: true },
            { type: types.SET_GENERAL_INFO, data: { PaymentReqNum: 1 } },
            { type: 'TOGGLE_LOADER', data: false }
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getGeneralInfo']()).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Home/GetGeneralInfo');
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getGeneralInfo with return error', async () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: 'TOGGLE_LOADER', data: true },
            { type: types.SET_GENERAL_INFO, data: defaultGeneralInfo },
            { type: 'TOGGLE_LOADER', data: false }
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getGeneralInfo']()).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Home/GetGeneralInfo');
            expect(store.getActions()).toEqual(expectedAction)
        })
    })
});