import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'reportTitle', value: '', action: { type: types.SET_REPORT_TITLE, data: 'Specified Report Title' }, expectedResult: 'Specified Report Title' },
    { name: 'param', value: null, action: { type: types.SET_PARAM, data: { email: 'abc@gmail.com' } }, expectedResult: { email: 'abc@gmail.com' } },
    { name: 'currentViewLevel', value: 1, action: { type: types.SET_VIEW_LEVEL, data: 2 }, expectedResult: 2 },
    { name: 'commGroupList', value: 1, action: { type: types.SET_COMM_GROUP_LIST, data: 2 }, expectedResult: 2 },
    { name: 'productList', value: 1, action: { type: types.SET_PRODUCT_LIST, data: 2 }, expectedResult: 2 },
    { name: 'paymentCurrencyList', value: 1, action: { type: types.SET_PAYMENT_CURRENCY_LIST, data: 2 }, expectedResult: 2 },
    { name: 'currencyList', value: null, action: { type: types.SET_CURRENCY_LIST, data: 'currencyList' }, expectedResult: 'currencyList' }
]

describe('affiliate report reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});