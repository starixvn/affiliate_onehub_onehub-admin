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
    { name: 'setSelectedLandingPageId', type: types.SET_SELECTED_LANDING_PAGE_ID, data: 123456 },
    { name: 'setCheckedLandingPages', type: types.SET_CHECKED_LANDING_PAGES, data: { 123456: false } },
    { name: 'setShouldResetScrollPosition', type: types.SHOULD_RESET_SCROLL_POSITION, data: false },
    { name: 'setGridData', type: types.SET_GRID_DATA, data: 'setGridData' }
];

describe('landing page list actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', () => {
        const expectedResponse = {
            data: [
                {
                    PageCode: "sportsbooks",
                    PageId: 1,
                    PageName: "Sportsbooks"
                },
                {
                    PageCode: "numbergame",
                    PageId: 22,
                    PageName: "Number Game"
                }
            ],
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: 'TOGGLE_LOADER', data: true },
            { type: types.SET_GRID_DATA, data: expectedResponse.data },
            { type: types.SHOULD_RESET_SCROLL_POSITION, data: true },
            { type: types.SET_CHECKED_LANDING_PAGES, data: { 1: false, 22: false } },
            { type: 'TOGGLE_LOADER', data: false },
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData']()).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/GetLandingPageList');
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to fetchData with incorrect parameter', () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: 'TOGGLE_LOADER', data: true },
            { type: types.SET_GRID_DATA, data: [] },
            { type: types.SHOULD_RESET_SCROLL_POSITION, data: true },
            { type: types.SET_CHECKED_LANDING_PAGES, data: {} },
            { type: 'TOGGLE_LOADER', data: false },
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData']()).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/GetLandingPageList');
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getLandingPageDetail with correct parameter', async () => {
        const expectedResponse = {
            data: {
                PageCode: "numbergame",
                PageId: 22,
                PageName: "Number Game"
            }, status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const selectedLandingPageId = 22;

        const result = await actions['getLandingPageDetail'](selectedLandingPageId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/GetLandingPageItem', { pageId: 22 });

        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to getLandingPageDetail with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const selectedLandingPageId = 123456;

        const result = await actions['getLandingPageDetail'](selectedLandingPageId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/GetLandingPageItem', { pageId: 123456 });
        expect(result).toEqual(null);
    })

    it('should create action to insertLandingPage with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            PageId: 0,
            PageName: "Football",
            PageCode: "Football"
        };

        const result = await actions['insertLandingPage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/InsertLandingPage', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to insertLandingPage with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            PageId: 0,
            PageName: "Football",
            PageCode: ""
        };

        const result = await actions['insertLandingPage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/InsertLandingPage', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateLandingPage with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            PageId: 22,
            PageName: "Football",
            PageCode: "Football"
        };

        const result = await actions['updateLandingPage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/UpdateLandingPage', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateLandingPage with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            PageId: 22,
            PageName: "",
            PageCode: "Football"
        };

        const result = await actions['updateLandingPage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/UpdateLandingPage', param);
        expect(result).toEqual(null);
    })

    it('should create action to deleteLandingPages with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const landingPageIdList = '1,22';

        const result = await actions['deleteLandingPages'](landingPageIdList)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/DeleteLandingPage', { pageIds: landingPageIdList });

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to deleteLandingPages with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const landingPageIdList = '123456';

        const result = await actions['deleteLandingPages'](landingPageIdList)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/LandingPageList/DeleteLandingPage', { pageIds: landingPageIdList });
        expect(result).toEqual(null);
    })
});