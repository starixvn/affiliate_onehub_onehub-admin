import * as types from '../../actions/types';
import * as reducers from '../index';
import { LEFTPANEL_RECEIVE_AFFINFO } from '../../../mainpage/actions/types';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'affiliateInfo', value: null, action: { type: LEFTPANEL_RECEIVE_AFFINFO, data: { AffId: 123456 } }, expectedResult: { AffId: 123456 } },
    { name: 'isValidUserName', value: true, action: { type: types.SET_IS_VALID_USERNAME, data: false }, expectedResult: false },
    { name: 'isShowLoader', value: false, action: { type: types.TOGGLE_LOADER_LEFT_PANEL, data: true }, expectedResult: true },
    { name: 'affName', value: null, action: { type: types.SET_AFF_NAME, data: 'abc' }, expectedResult: 'abc' }
]

describe('email history reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});