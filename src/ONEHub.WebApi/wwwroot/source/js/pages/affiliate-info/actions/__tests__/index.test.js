import * as actions from '../index';
import * as types from '../types';

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setReportTitle', type: types.SET_REPORT_TITLE, data: 'Affiliate Info Title' },
    { name: 'setParam', type: types.SET_PARAM, data: { param: 'param' } },
    { name: 'setShowPopupCommGroup', type: types.SET_SHOW_POPUP_COMMGROUP, data: true },
    { name: 'setAffId', type: types.SET_AFFID, data: 123 },
    { name: 'setParentAffName', type: types.SET_PARENT_AFF_NAME, data: 'ABC' },
    { name: 'setCommGroup', type: types.SET_COMM_GROUP, data: '12BETAFF001' },
    { name: 'setSelectedColumn', type: types.SET_SELECTED_COLUMN, data: '1,2,3' },
]

describe('affiliate info actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });
});