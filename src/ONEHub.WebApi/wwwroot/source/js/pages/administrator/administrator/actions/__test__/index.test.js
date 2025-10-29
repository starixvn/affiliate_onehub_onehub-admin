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
    { name: 'setParam', type: types.SET_PARAM, data: { userName: 'abc' } },
    { name: 'setShouldResetScrollPosition', type: types.SHOULD_RESET_SCROLL_POSITION, data: false },
    { name: 'setGridData', type: types.SET_GRID_DATA, data: 'setGridData' },
];

describe('admin list actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with return correct data', () => {
        const expectedResponse = {
            data: [
                {
                    UserId: 123
                }
            ],
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: 'TOGGLE_LOADER', data: true },
            { type: types.SET_GRID_DATA, data: expectedResponse.data },
            { type: types.SHOULD_RESET_SCROLL_POSITION, data: true },
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            userName: '',
            firstLetter: ''
        }
        const store = mockStore({ todos: [] });

        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetUserList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to fetchData with return error', () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: 'TOGGLE_LOADER', data: true },
            { type: types.SET_GRID_DATA, data: [] },
            { type: types.SHOULD_RESET_SCROLL_POSITION, data: true },
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            userName: '',
            firstLetter: ''
        }
        const store = mockStore({ todos: [] });

        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetUserList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to changeStatus with change successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            userId: 123,
            isOpen: false
        };

        const result = await actions['changeStatus'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/ChangeStatus', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to changeStatus with insert is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            userId: 123,
            isOpen: false
        };

        const result = await actions['changeStatus'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/ChangeStatus', param);
        expect(result).toEqual(null);
    })
});