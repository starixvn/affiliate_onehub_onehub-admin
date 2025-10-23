import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'shouldResetScrollPosition', value: true, action: { type: types.SHOULD_RESET_SCROLL_POSITION, data: false }, expectedResult: false },
    { name: 'gridData', value: null, action: { type: types.SET_GRID_DATA, data: [{ domainName: 'abc.com' }] }, expectedResult: [{ domainName: 'abc.com' }] },
    { name: 'selectedSubAffDomain', value: null, action: { type: types.SET_SELECTED_SUB_AFF_DOMAIN, data: { domainId: 123 } }, expectedResult: { domainId: 123 } }
]

describe('sub-affiliate domain reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
})