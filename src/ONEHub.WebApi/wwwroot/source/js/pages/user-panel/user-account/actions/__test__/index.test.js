import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../../modules/ajaxRequest';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setUserAccountInfo', type: types.SET_USER_ACCOUNT_INFO, data: { Id: 123 } },
    { name: 'setMoreSiteUrlsList', type: types.SET_MORE_SITE_URLS_LIST, data: 'setMoreSiteUrlsList' }
];

describe('user account actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to getUserAccountInfo with correct parameter', () => {
        const expectedResponse = {
            data: {
                "Address": "123, SMS",
                "AffId": 1271808,
                "AffName": "12BETAFF226",
                "Answer": "What?",
                "BankAccountName": "qwe",
                "BankAccountNumber": "qwe",
                "BankAddress": "qwe",
                "BankCode": "",
                "BankName": "qwe",
                "City": "V",
                "ContactApps": "[{\"Name\":\"MSN/YM/QQ\",\"Value\":\"@123\",\"Order\":0}]",
                "Country": "V",
                "Email": "hubert.duong@nexcel.vn",
                "FirstName": "bb",
                "Gender": false,
                "LastName": "12BETAFF226",
                "MailOption": false,
                "MoneybookersEmail": "",
                "MoreSiteUrls": "www.sportsbookie.com;www.gzyyy.com;www.123.com",
                "NetellerAccountId": "1",
                "NoSiteDesc": "",
                "Phone": "abc",
                "PlayerUsername": "bettingexp",
                "Postcode": "X",
                "PreferredPayment": "Player",
                "Question": "What?",
                "SiteUrl": "https://aff-12b.nexdev.net/UserAsian/UserPanel/Main/#MyAccount",
                "State": "A"
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const expectedAction = [
            { type: "TOGGLE_LOADER_USER_PANEL", data: true },
            { type: types.SET_MORE_SITE_URLS_LIST, data: ['www.sportsbookie.com', 'www.gzyyy.com', 'www.123.com'] },
            {
                type: types.SET_USER_ACCOUNT_INFO, data: {
                    ...expectedResponse.data,
                    "IsMarketingAccount": false
                }
            },
            { type: "TOGGLE_LOADER_USER_PANEL", data: false }
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getUserAccountInfo'](1271808)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/UserAccount/GetUserAccountInfo', { affId: 1271808 });
            expect(store.getActions()).toEqual(expectedAction);
        })
    })

    it('should create action to getUserAccountInfo with incorrect parameter', () => {
        ajaxRequest.post = jest.fn();

        const expectedAction = [
            { type: "TOGGLE_LOADER_USER_PANEL", data: true },
            { type: types.SET_MORE_SITE_URLS_LIST, data: [] },
            { type: types.SET_USER_ACCOUNT_INFO, data: { IsMarketingAccount: null } },
            { type: "TOGGLE_LOADER_USER_PANEL", data: false }
        ];

        const store = mockStore({ todos: [] });
        return store.dispatch(actions['getUserAccountInfo'](123456)).then(() => {
            expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/UserAccount/GetUserAccountInfo', { affId: 123456 });
            expect(store.getActions()).toEqual(expectedAction);
        })
    })

    it('should create action to updateUserAccount with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            Address: "123, SMS",
            AffId: 1271808,
            AffName: "12BETAFF226",
            Answer: "What?",
            BankAccountName: "qwe",
            BankAccountNumber: "qwe",
            BankAddress: "qwe",
            BankCode: "",
            BankName: "qwe",
            City: "V",
            ContactApps: '[{"Name":"MSN/YM/QQ","Value":"@123","Order":0}]',
            Country: "V",
            Email: "hubert.duong@nexcel.vn",
            FirstName: "bb",
            Gender: false,
            LastName: "12BETAFF226",
            MailOption: false,
            MoneybookersEmail: "",
            MoreSiteUrls: "www.sportsbookie.com;www.gzyyy.com;www.123.com",
            NetellerAccountId: "1",
            NoSiteDesc: "",
            Phone: "abc",
            PlayerUsername: "bettingexp",
            Postcode: "X",
            PreferredPayment: "Player",
            Question: "What?",
            SiteUrl: "https://aff-12b.nexdev.net/UserAsian/UserPanel/Main/#MyAccount",
            State: "A"
        }

        const result = await actions['updateUserAccount'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/UserAccount/updateUserAccount', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateUserAccount with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            Address: "123, SMS",
            AffId: 123456,
            AffName: "12BETAFF226",
            Answer: "What?",
            BankAccountName: "qwe",
            BankAccountNumber: "qwe",
            BankAddress: "qwe",
            BankCode: "",
            BankName: "qwe",
            City: "V",
            ContactApps: '[{"Name":"MSN/YM/QQ","Value":"@123","Order":0}]',
            Country: "V",
            Email: "hubert.duong@nexcel.vn",
            FirstName: "bb",
            Gender: false,
            LastName: "12BETAFF226",
            MailOption: false,
            MoneybookersEmail: "",
            MoreSiteUrls: "www.sportsbookie.com;www.gzyyy.com;www.123.com",
            NetellerAccountId: "1",
            NoSiteDesc: "",
            Phone: "abc",
            PlayerUsername: "bettingexp",
            Postcode: "X",
            PreferredPayment: "Player",
            Question: "What?",
            SiteUrl: "https://aff-12b.nexdev.net/UserAsian/UserPanel/Main/#MyAccount",
            State: "A"
        }

        const result = await actions['updateUserAccount'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/UserAccount/updateUserAccount', param);
        expect(result).toEqual(null);
    })

    it('should create action to getPaymentMethod', async () => {
        const paymentMethod = {
            PaymentMethods: [
                { Key: 'Player', Value: 'Bwing Player Account' },
                { key: 'Moneybookers', value: 'Moneybookers' },
                { key: 'Wire', value: 'Bank Transfer' }
            ],
            MinAmount: 23000
        };
        const expectedResponse = { data: paymentMethod, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const result = await actions['getPaymentMethod']()();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/UserAccount/GetPaymentMethod');

        expect(result).toEqual(paymentMethod);
    })

    it('should create action to getPaymentMethod with incorrect response', async () => {
        ajaxRequest.post = jest.fn();

        const result = await actions['getPaymentMethod']()();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/UserAccount/GetPaymentMethod');
        expect(result).toEqual(null);
    })
});