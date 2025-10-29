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
    { name: 'setParamFromHome', type: types.SET_PARAM_FROM_HOME, data: { IsFromHome: true } },
    { name: 'setBannerDetailUrl', type: types.SET_BANNER_DETAIL_URL, data: 'abc/test.jpg' },
    { name: 'setCategoryList', type: types.SET_CATEGORY_LIST, data: [{ id: 234, name: 'SP Bonus' }] },
    { name: 'setSelectedBannerId', type: types.SET_SELECTED_BANNER_ID, data: 123456 },
    { name: 'setCheckedBanners', type: types.SET_CHECKED_BANNERS, data: { 123456: false } },
    { name: 'setShouldResetScrollPosition', type: types.SHOULD_RESET_SCROLL_POSITION, data: false },
    { name: 'setDisableCurrency', type: types.SET_DISABLE_CURRENCY, data: true },
    { name: 'setGridData', type: types.SET_GRID_DATA, data: 'setGridData' },
    { name: 'setSizeList', type: types.SET_SIZE_LIST, data: [{ id: 234, name: '320x50' }] },
];

describe('banner list actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to getCategories', async () => {
        const expectedResponse = { data: [{ CategoryName: "name" }], status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const result = await actions['getCategories'](1)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetCategoryList', { userType: 1 });
        expect(result).toEqual([{
            categoryName: 'name',
            key: 'name',
            name: 'name',
            checked: false
        }]);
    })

    it('should create action to getCategories', async () => {
        ajaxRequest.post = jest.fn();

        const result = await actions['getCategories'](1)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetCategoryList', { userType: 1 });
        expect(result).toEqual([]);
    })

    it('should create action to getCategoryList', async () => {
        const expectedResponse = { data: [{ Id: 123, Name: 'SP Bonus' }], status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: 'SET_CATEGORY_LIST', data: [{ Id: 123, Name: 'SP Bonus' }] }
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getCategoryList'](1)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetCategoryList', { userType: 1 });
            expect(store.getActions()).toEqual(expectedAction);
        })
    })

    it('should create action to getCategoryList', async () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: 'SET_CATEGORY_LIST', data: [] }
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getCategoryList'](1)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetCategoryList', { userType: 1 });
            expect(store.getActions()).toEqual(expectedAction);
        })
    })

    it('should create action to getSizeList', async () => {
        const expectedResponse = { data: [{ Id: 123, Name: '320x50' }], status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: 'SET_SIZE_LIST', data: [{ "checked": false, "key": 123, "name": "320x50", }] }
        ];

        const param = {
            AffType: 2,
            Category: "",
            Currency: "",
            DeviceType: 0,
            ImageType: "",
            Language: "",
            Size: "",
            SubCategory: ""
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getSizeList'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetSizeList', param);
            expect(store.getActions()).toEqual(expectedAction);
        })
    })

    it('should create action to getSizeList', async () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: 'SET_SIZE_LIST', data: null }
        ];

        const param = {
            AffType: 5,
            Category: "",
            Currency: "",
            DeviceType: 0,
            ImageType: "",
            Language: "",
            Size: "",
            SubCategory: ""
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getSizeList'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetSizeList', param);
            expect(store.getActions()).toEqual(expectedAction);
        })
    })

    it('should create action to fetchData with correct parameter', () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        BannerId: 2485,
                        Categories: ["Casino"],
                        SubCategories: ["Baccarat"],
                        Currencies: ["EURO"],
                        DeviceTypes: ["1"],
                        FileName: "CategoryMedia/giphy.gif",
                        ImageType: "Image",
                        Language: "Chinese Simplified",
                        Size: "500x500"
                    },
                    {
                        BannerId: 2448,
                        Categories: ["Number Game"],
                        SubCategories: [""],
                        Currencies: ["EURO"],
                        DeviceTypes: ["1"],
                        FileName: "CategoryMedia/step1.jpg",
                        ImageType: "Image",
                        Language: "Chinese Simplified",
                        Size: "1655x438"
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
            { type: types.SET_CHECKED_BANNERS, data: { 2485: false, 2448: false } },
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            AffType: 2,
            Category: "",
            Currency: "",
            DeviceType: 0,
            ImageType: "",
            Language: "",
            PageIndex: 1,
            PageSize: 20,
            Size: "",
            SubCategory: ""
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetBannerList', param);
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
            { type: types.SET_CHECKED_BANNERS, data: {} },
            { type: 'TOGGLE_LOADER', data: false },
        ];
        const param = {
            AffType: 5,
            Category: "",
            Currency: "",
            DeviceType: 0,
            ImageType: "",
            Language: "",
            PageIndex: 1,
            PageSize: 20,
            Size: "",
            SubCategory: ""
        }

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['fetchData'](param)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetBannerList', param);
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getBannerDetail with correct parameter', async () => {
        const expectedResponse = {
            data: {
                BannerId: 2485,
                Category: "Baccarat",
                Currency: "EURO",
                DeviceType: 1,
                FileName: "CategoryMedia/Casino/Baccarat/giphy.gif",
                ImageType: "Image",
                Language: "Chinese Simplified",
                Size: "500x500"
            }, status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const selectedBannerId = 2485;

        const result = await actions['getBannerDetail'](selectedBannerId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetBannerDetail', { selectedBannerId: 2485 });

        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to getBannerDetail with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const selectedBannerId = 123456;

        const result = await actions['getBannerDetail'](selectedBannerId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/GetBannerDetail', { selectedBannerId: 123456 });
        expect(result).toEqual(null);
    })

    it('should create action to insertBanner with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            BannerId: 0,
            files: [{ name: 'abc.png' }]
        };

        const result = await actions['insertBanner'](param)();

        expect(ajaxRequest.post.mock.calls[0][0]).toEqual('Portal/MediaGallery/insertBanner');

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to insertBanner with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            BannerId: 123456
        };

        const result = await actions['insertBanner'](param)();

        expect(ajaxRequest.post.mock.calls[0][0]).toEqual('Portal/MediaGallery/insertBanner');
        expect(result).toEqual(null);
    })

    it('should create action to updateBanner with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            BannerId: 2485
        };

        const result = await actions['updateBanner'](param)();

        expect(ajaxRequest.post.mock.calls[0][0]).toEqual('Portal/MediaGallery/UpdateBanner');

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateBanner with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            BannerId: 123456
        };

        const result = await actions['updateBanner'](param)();

        expect(ajaxRequest.post.mock.calls[0][0]).toEqual('Portal/MediaGallery/UpdateBanner');
        expect(result).toEqual(null);
    })

    it('should create action to deleteBanners with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const BannerIdList = '2485,2448';

        const result = await actions['deleteBanners']({ BannerIdList })();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/DeleteBanners', { BannerIdList });

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to deleteBanners with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const BannerIdList = '123456';

        const result = await actions['deleteBanners']({ BannerIdList })();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/MediaGallery/DeleteBanners', { BannerIdList });
        expect(result).toEqual(null);
    })
});