import * as actions from '../index';
import * as types from '../types';

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
    { name: 'setSelectedUserPanel', type: types.SET_SELECTED_USERPANEL, data: 'setSelectedUserPanel' },
    { name: 'resetUserPanel', type: types.RESET_USER_PANEL, data: 'resetUserPanel' },
    { name: 'toggleLoaderUserPanel', type: types.TOGGLE_LOADER_USER_PANEL, data: true },
]

describe('user panel actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to redirectToStatementHistory', () => {
        const param = {
            affId: 1271808,
            monthDate: "Jan-2019",
            productId: 0
        };

        const data = {
            param,
            scrollTop: 100,
            expandMonthDateList: []
        }

        const expectedAction = [
            { type: 'USER_PANEL/SET_SELECTED_USERPANEL', data: 'statementHistory' },
            { type: 'USER_PANEL/STATEMENT_HISTORY/SET_PARAM', data: { ...param, isBack: true, scrollTop: data.scrollTop } },
            { type: 'USER_PANEL/STATEMENT_HISTORY/SET_EXPAND_MONTH_DATE_LIST', data: data.expandMonthDateList }
        ];

        const store = mockStore({ todos: [] });
        store.dispatch(actions['redirectToStatementHistory'](data));

        expect(store.getActions()).toEqual(expectedAction);
    })

    it('should create action to redirectToDailyEarning', () => {
        const param = {
            affId: 1271808,
            monthDate: "Jan-2019",
            productId: 0
        };
        const expectedAction = [
            { type: 'USER_PANEL/SET_SELECTED_USERPANEL', data: 'dailyEarning' },
            { type: 'USER_PANEL/DAILY_EARNING/SET_PARAM', data: param }
        ];

        const store = mockStore({ todos: [] });
        store.dispatch(actions['redirectToDailyEarning'](param));
        expect(store.getActions()).toEqual(expectedAction);
    })

    it('should create action to redirectToDailyEarningDetail', () => {
        const param = {
            affId: 1271808,
            monthDate: "06 January 2019",
            productId: 0
        }
        const expectedAction = [
            { type: 'USER_PANEL/SET_SELECTED_USERPANEL', data: 'dailyEarningDetail' },
            { type: 'USER_PANEL/DAILY_EARNING_DETAIL/SET_PARAM', data: param },
        ];

        const store = mockStore({ todos: [] });
        store.dispatch(actions['redirectToDailyEarningDetail'](param));
        expect(store.getActions()).toEqual(expectedAction)
    })

    it('should create action to redirectToSubAffiliate', () => {
        const param = {
            affId: 1271808,
            monthDate: "Jan-2019",
            productId: 0
        }
        const expectedAction = [
            { type: 'USER_PANEL/SET_SELECTED_USERPANEL', data: 'subAffiliate' },
            { type: 'USER_PANEL/SUB_AFFILIATE/SET_PARAM', data: param },
        ];

        const store = mockStore({ todos: [] });
        store.dispatch(actions['redirectToSubAffiliate'](param));
        expect(store.getActions()).toEqual(expectedAction);
    })

    it('should create action to redirectToPlayerDetail', () => {
        const param = {
            isClickLink: true,
            monthDate: "2/1/2019",
            productId: 0
        }
        const expectedAction = [
            { type: 'USER_PANEL/SET_SELECTED_USERPANEL', data: 'playerDetail' },
            { type: 'PLAYER_DETAIL/SET_PARAM', data: param },
        ];

        const store = mockStore({ todos: [] });
        store.dispatch(actions['redirectToPlayerDetail'](param));
        expect(store.getActions()).toEqual(expectedAction);
    })

    it('should create action to redirectToTrackingStatistics', () => {
        const param = {
            isClickLink: true
        }
        const expectedAction = [
            { type: 'USER_PANEL/SET_SELECTED_USERPANEL', data: 'trackingStatistics' },
            { type: 'USER_PANEL/TRACKING_STATISTICS/SET_PARAM', data: param },
        ];

        const store = mockStore({ todos: [] });
        store.dispatch(actions['redirectToTrackingStatistics'](param));
        expect(store.getActions()).toEqual(expectedAction)
    })

    it('should create action to redirectToReferrers', () => {
        const param = {
            deviceType: 0,
            fromDate: "12/1/2018",
            isClickLink: true,
            toDate: "12/31/2018"
        }
        const expectedAction = [
            { type: 'USER_PANEL/SET_SELECTED_USERPANEL', data: 'clickStatistics' },
            { type: 'SET_PARAM', data: param },
        ];

        const store = mockStore({ todos: [] });
        store.dispatch(actions['redirectToReferrers'](param));
        expect(store.getActions()).toEqual(expectedAction);
    })
});