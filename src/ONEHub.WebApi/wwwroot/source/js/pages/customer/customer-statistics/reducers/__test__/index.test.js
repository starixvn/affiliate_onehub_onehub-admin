import * as types from '../../actions/types'
import * as reducers from '../index'

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'monthDate', value: null, action: { type: types.SET_MONTHDATE, data: '6/2019' }, expectedResult: '6/2019' }
]

describe('customer statistics reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});