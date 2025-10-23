import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'categoryList', value: null, action: { type: types.SET_CATEGORY_LIST, data: [{ Id: 123, Name: "Slot" }] }, expectedResult: [{ Id: 123, Name: "Slot" }] },
    { name: 'param', value: null, action: { type: types.SET_PARAM, data: { AffType: 2 } }, expectedResult: { AffType: 2 } },
    { name: 'paramFromHome', value: null, action: { type: types.SET_PARAM_FROM_HOME, data: { IsFromHome: true } }, expectedResult: { IsFromHome: true } },
    { name: 'bannerDetailUrl', value: null, action: { type: types.SET_BANNER_DETAIL_URL, data: { bannerUrl: "abc/123/test.jpg" } }, expectedResult: { bannerUrl: "abc/123/test.jpg" } },
    { name: 'selectedBannerId', value: null, action: { type: types.SET_SELECTED_BANNER_ID, data: 123 }, expectedResult: 123 },
    { name: 'checkedBanners', value: null, action: { type: types.SET_CHECKED_BANNERS, data: { 123: true } }, expectedResult: { 123: true } },
    { name: 'shouldResetScrollPosition', value: true, action: { type: types.SHOULD_RESET_SCROLL_POSITION, data: false }, expectedResult: false },
    { name: 'isDisableCurrency', value: false, action: { type: types.SET_DISABLE_CURRENCY, data: true }, expectedResult: true },
    { name: 'gridData', value: null, action: { type: types.SET_GRID_DATA, data: [{ name: 'abc' }] }, expectedResult: [{ name: 'abc' }] },
    { name: 'sizeList', value: null, action: { type: types.SET_SIZE_LIST, data: [{ Id: 123, Name: "320x50" }] }, expectedResult: [{ Id: 123, Name: "320x50" }] }
]

describe('banner list reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});