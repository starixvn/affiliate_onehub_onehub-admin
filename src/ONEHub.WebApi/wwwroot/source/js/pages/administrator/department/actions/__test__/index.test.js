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
    { name: 'setSelectedDepartmentId', type: types.SET_SELECTED_DEPARTMENT_ID, data: 123 },
    { name: 'setShouldResetScrollPosition', type: types.SHOULD_RESET_SCROLL_POSITION, data: false },
    { name: 'setGridData', type: types.SET_GRID_DATA, data: 'setGridData' },
    { name: 'setOpenInsertUpdatePopup', type: types.SET_OPEN_INSERT_UPDATE_POPUP, data: true }
];

describe('department list actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with return correct data', () => {
        const expectedResponse = {
            data: [
                {
                    DepartmentId: 123
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
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/GetDepartmentList');
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
        return store.dispatch(actions['fetchData']()).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/GetDepartmentList');
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getDepartmentDetail with return correct data', async () => {
        const expectedResponse = {
            data: {
                DepartmentId: 123
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const selectedDepartmentId = 123;
        const result = await actions['getDepartmentDetail'](selectedDepartmentId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/GetDepartmentDetail', { selectedDepartmentId });

        expect(result).toEqual(expectedResponse.data);
    })
        ;
    it('should create action to getDepartmentDetail with return error', async () => {
        ajaxRequest.post = jest.fn();

        const selectedDepartmentId = 123;
        const result = await actions['getDepartmentDetail'](selectedDepartmentId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/GetDepartmentDetail', { selectedDepartmentId });

        expect(result).toEqual(null);
    })

    it('should create action to insertDepartment with insert successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            DepartmentName: 'abc',
            Description: 'abc'
        };

        const result = await actions['insertDepartment'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/InsertDepartment', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to insertDepartment with insert is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            DepartmentName: 'abc',
            Description: 'abc'
        };

        const result = await actions['insertDepartment'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/InsertDepartment', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateDepartment with update successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            DepartmentName: 'abc',
            Description: '123'
        };

        const result = await actions['updateDepartment'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/UpdateDepartment', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateDepartment with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            DepartmentName: 'abc',
            Description: '123'
        };

        const result = await actions['updateDepartment'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/UpdateDepartment', param);
        expect(result).toEqual(null);
    })

    it('should create action to deleteDepartment with delete successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            DepartmentId: 123
        };

        const result = await actions['deleteDepartment'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/DeleteDepartment', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to deleteDepartment with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            DepartmentId: 123456
        };

        const result = await actions['deleteDepartment'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/DeleteDepartment', param);
        expect(result).toEqual(null);
    })
});