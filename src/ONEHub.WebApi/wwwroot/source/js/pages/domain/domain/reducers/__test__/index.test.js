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
    { name: 'selectedDomainId', value: null, action: { type: types.SET_SELECTED_DOMAIN_ID, data: 123 }, expectedResult: 123 }
]

describe('domain reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
})