import * as actions from '../loadingDataAction';
import * as types from '../types';
import * as ajaxRequest from '../../../../../modules/ajaxRequest';

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setAffCommonInfo', type: types.SET_AFF_COMMON_INFO, data: { Id: 123 } },
    { name: 'receiveLeftMenuInfo', type: types.LEFTPANEL_RECEIVE_AFFINFO, data: 'receiveLeftMenuInfo' }
];

describe('customer - main page actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to getAffiliateInfo with correct parameter', () => {
        const expectedResponse = {
            data: {
                AffId: 1271808,
                AffLink: "http://localhost:55690/Auth/AdminLogin?chalengeStr=0vxcms&accKey=DA32D2BCA145C89C5A08F5582529A1AB22FC5D79E87021269AF024B1D173F6D8DCC1C3B71E50D895FD85C94BADFE129DA89C67AAC0BB1205106C3A1427C90332&custName=12BETAFF226&accId=1000000026&accOnId=8402",
                AffName: "12BETAFF226",
                AffType: 2,
                BalanceBf: 9802280.5446,
                CommGroupName: "NoCommission",
                ContactApps: '[{"Name":"MSN/YM/QQ","Value":"@123","Order":0}]',
                FirstName: "bb",
                Gender: false,
                GroupId: 102,
                LastLoginDateText: "04/11/2019 22:24:00",
                LastLoginIp: "10.18.200.125",
                LastName: "12BETAFF226",
                MoreSiteUrls: "www.sportsbookie.com;www.gzyyy.com;www.123.com",
                NoSiteDesc: "",
                Phone: "abc",
                PreferredLanguage: "vi-VN",
                SiteUrl: "https://aff-12b.nexdev.net/UserAsian/UserPanel/Main/#MyAccount",
                Status: "Approved"
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: 'TOGGLE_LOADER_LEFT_PANEL', data: true },
            { type: types.SET_AFF_COMMON_INFO, data: { affId: 1271808, affName: '12BETAFF226', status: 'Approved' } },
            { type: types.LEFTPANEL_RECEIVE_AFFINFO, data: expectedResponse.data },
            { type: 'USER_PANEL/SET_SELECTED_USERPANEL', data: 'edit' },
            { type: 'SET_IS_VALID_USERNAME', data: true },
            { type: 'TOGGLE_LOADER_LEFT_PANEL', data: false },
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getAffiliateInfo']('12BETAFF226', 'edit')).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/GetAffiliateInfo', { affUsername: "12BETAFF226" });
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should create action to getAffiliateInfo with incorrect parameter', () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: 'TOGGLE_LOADER_LEFT_PANEL', data: true },
            { type: types.SET_AFF_COMMON_INFO, data: null },
            { type: types.LEFTPANEL_RECEIVE_AFFINFO, data: null },
            { type: 'SET_IS_VALID_USERNAME', data: false },
            { type: 'TOGGLE_LOADER_LEFT_PANEL', data: false },
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getAffiliateInfo']('12BET')).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/GetAffiliateInfo', { affUsername: "12BET" });
            expect(store.getActions()).toEqual(expectedAction)
        })
    })
});