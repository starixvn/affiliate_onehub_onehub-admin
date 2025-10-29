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
    { name: 'setSelectedSubAffDomain', type: types.SET_SELECTED_SUB_AFF_DOMAIN, data: { domainId: 123 } },
    { name: 'setShouldResetScrollPosition', type: types.SHOULD_RESET_SCROLL_POSITION, data: false },
    { name: 'setGridData', type: types.SET_GRID_DATA, data: 'setGridData' }
];

describe('sub-affiliate domain actions', () => {
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
        return store.dispatch(actions['fetchData']()).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/SubAffDomain/GetSubAffDomainList');
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
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/SubAffDomain/GetSubAffDomainList');
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to insertSubAffDomain with insert successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            DomainId: 0,
            DomainName: "abc.com"
        };

        const result = await actions['insertSubAffDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/SubAffDomain/InsertSubAffDomain', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to insertSubAffDomain with insert is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            DomainId: 0,
            DomainName: "abc.com"
        };

        const result = await actions['insertSubAffDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/SubAffDomain/InsertSubAffDomain', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateSubAffDomain with update successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            DomainId: 123,
            DomainName: "abc.com"
        };

        const result = await actions['updateSubAffDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/SubAffDomain/UpdateSubAffDomain', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateSubAffDomain with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            DomainId: 123,
            DomainName: "abc.com"
        };

        const result = await actions['updateSubAffDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/SubAffDomain/UpdateSubAffDomain', param);
        expect(result).toEqual(null);
    })

    it('should create action to deleteSubAffDomain with delete successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            DomainId: 123
        };

        const result = await actions['deleteSubAffDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/SubAffDomain/DeleteSubAffDomain', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to deleteSubAffDomain with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            DomainId: 123
        };

        const result = await actions['deleteSubAffDomain'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/SubAffDomain/DeleteSubAffDomain', param);
        expect(result).toEqual(null);
    })
});