import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'selectedPage', value: null, action: { type: types.SET_SELECTED_PAGE, data: { selectedPage: "sportsbook" } }, expectedResult: { selectedPage: "sportsbook" } },
    { name: 'selectedPage', value: null, action: { type: types.SET_SELECTED_PAGE, data: null }, expectedResult: null },
    { name: 'param', value: null, action: { type: types.SET_PARAM, data: { Id: 123 } }, expectedResult: { Id: 123 } },
]

describe('landing pages statistics reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});