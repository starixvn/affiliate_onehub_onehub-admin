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
    { name: 'setSelectedDomainId', type: types.SET_SELECTED_DOMAIN_ID, data: 123 },
    { name: 'setShouldResetScrollPosition', type: types.SHOULD_RESET_SCROLL_POSITION, data: false },
    { name: 'setGridData', type: types.SET_GRID_DATA, data: 'setGridData' }
];

describe('domain actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with return correct data', () => {
        const expectedResponse = {
            data: [
                {
                    DomainId: 2438
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

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](false)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Domain/GetDomainList', { isAffDomain: false });
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

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](false)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Domain/GetDomainList', { isAffDomain: false });
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to insertDomain with insert successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            DomainId: 0,
            DomainName: "abc.com",
            IsAffDomain: false
        };

        const result = await actions['insertDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Domain/InsertDomain', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to insertDomain with insert is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            DomainId: 0,
            DomainName: "abc.com",
            IsAffDomain: false
        };

        const result = await actions['insertDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Domain/InsertDomain', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateDomain with update successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            DomainId: 123,
            DomainName: "abc.com",
            IsAffDomain: false
        };

        const result = await actions['updateDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Domain/UpdateDomain', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateDomain with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            DomainId: 123,
            DomainName: "abc.com",
            IsAffDomain: false
        };

        const result = await actions['updateDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Domain/UpdateDomain', param);
        expect(result).toEqual(null);
    })

    it('should create action to deleteDomain with delete successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            DomainId: 123,
            IsAffDomain: false
        };

        const result = await actions['deleteDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Domain/DeleteDomain', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to deleteDomain with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            DomainId: 123,
            IsAffDomain: false
        };

        const result = await actions['deleteDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Domain/DeleteDomain', param);
        expect(result).toEqual(null);
    })
});