import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'transactionId', value: null, action: { type: types.TRANSACTION_ID, data: 123 }, expectedResult: 123 },
    { name: 'param', value: {}, action: { type: types.SET_PARAM, data: { productId: 123, content: 'abc' } }, expectedResult: { productId: 123, content: 'abc' } },
    { name: 'expandMonthDateList', value: null, action: { type: types.SET_EXPAND_MONTH_DATE_LIST, data: { 123: true } }, expectedResult: { 123: true } },
]

describe('statement history reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});