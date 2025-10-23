import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'moreSiteUrlsList', value: null, action: { type: types.SET_MORE_SITE_URLS_LIST, data: ['123.vn', 'abc.com'] }, expectedResult: ['123.vn', 'abc.com'] },
    { name: 'userAccountInfo', value: {}, action: { type: types.SET_USER_ACCOUNT_INFO, data: { userName: 'abc' } }, expectedResult: { userName: 'abc' } }
]

describe('user account reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});