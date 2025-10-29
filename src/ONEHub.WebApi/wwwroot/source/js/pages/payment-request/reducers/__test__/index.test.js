import * as types from '../../actions/types'
import * as reducers from '../index'

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'param', value: null, action: { type: types.SET_PARAM, data: { AffId: 123456 } }, expectedResult: { AffId: 123456 } },
    { name: 'transactionId', value: null, action: { type: types.SET_TRANSACTION_ID, data: 123 }, expectedResult: 123 }
]

describe('payment request reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});