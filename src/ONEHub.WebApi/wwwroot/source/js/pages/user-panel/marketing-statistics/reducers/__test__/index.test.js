import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    {
        name: 'param',
        value: null,
        action: {
            type: types.SET_PARAM,
            data: { affId: 123 }
        },
        expectedResult: { affId: 123 }
    },
    {
        name: 'param',
        value: { affId: 123 },
        action: {
            type: types.SET_PARAM,
            data: { fromDate: "2024-01-01" }
        },
        expectedResult: {
            affId: 123,
            fromDate: "2024-01-01"
        }
    },
];

describe('marketing statistics reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    });
});
