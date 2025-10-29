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
    { name: 'productList', value: [], action: { type: types.SET_PRODUCT_LIST, data: [1, 2, 3] }, expectedResult: [1, 2, 3] },
]

describe('player ggr report reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});