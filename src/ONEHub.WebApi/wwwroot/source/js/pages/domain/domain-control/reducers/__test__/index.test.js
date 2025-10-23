import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'shouldResetScrollPosition', value: true, action: { type: types.SHOULD_RESET_SCROLL_POSITION, data: false }, expectedResult: false },
    { name: 'gridData', value: null, action: { type: types.SET_GRID_DATA, data: [{ domainName: 'abc.com' }] }, expectedResult: [{ domainName: 'abc.com' }] },
    { name: 'selectedTargetCountry', value: null, action: { type: types.SET_SELECTED_TARGET_COUNTRY, data: 'en-US' }, expectedResult: 'en-US' },
    { name: 'selectedDomainId', value: true, action: { type: types.SET_SELECTED_DOMAIN_ID, data: 123 }, expectedResult: 123 },
    { name: 'affDomainList', value: null, action: { type: types.SET_AFF_DOMAIN_LIST, data: [{ domainName: 'abc.com' }] }, expectedResult: [{ domainName: 'abc.com' }] },
    { name: 'affSubDomainList', value: null, action: { type: types.SET_AFF_SUB_DOMAIN_LIST, data: [{ domainName: 'abc' }] }, expectedResult: [{ domainName: 'abc' }] },
    { name: 'redirectDomainList', value: null, action: { type: types.SET_REDIRECT_DOMAIN_LIST, data: [{ domainName: '123.com' }] }, expectedResult: [{ domainName: '123.com' }] }
]

describe('domain control reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
})