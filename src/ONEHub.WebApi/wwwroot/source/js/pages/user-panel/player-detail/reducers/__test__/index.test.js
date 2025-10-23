import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'param', value: {}, action: { type: types.SET_PARAM, data: { productId: 123, content: 'abc' } }, expectedResult: { productId: 123, content: 'abc' } },
    { name: 'sortingColumn', value: {}, action: { type: types.SET_SORTING_COLUMN, data: { sortedBy: 123 } }, expectedResult: { sortedBy: 123 } }
]

describe('player detail reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});