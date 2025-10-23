import * as types from '../../actions/types'
import * as reducers from '../index'

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'selectedUserPanel', value: null, action: { type: types.SET_SELECTED_USERPANEL, data: 'abc' }, expectedResult: 'abc' },
    { name: 'isShowLoaderUserPanel', value: false, action: { type: types.TOGGLE_LOADER_USER_PANEL, data: true }, expectedResult: true }
]

describe('customer - user panel reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});