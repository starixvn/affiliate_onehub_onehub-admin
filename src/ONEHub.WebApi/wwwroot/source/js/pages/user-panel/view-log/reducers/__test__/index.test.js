import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'showIdList', value: {}, action: { type: types.SET_SHOW_ID_LIST, data: { 123: true } }, expectedResult: { 123: true } },
    { name: 'param', value: {}, action: { type: types.SET_PARAM, data: { productId: 123, content: 'abc' } }, expectedResult: { productId: 123, content: 'abc' } }
]

describe('statement history reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});