import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../../modules/ajaxRequest';

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setTransactionId', type: types.TRANSACTION_ID, data: 1262276211 },
    { name: 'setParam', type: types.SET_PARAM, data: { param: 'param' } },
    { name: 'setExpandMonthDateList', type: types.SET_EXPAND_MONTH_DATE_LIST, data: "setExpandMonthDateList" }
]

describe('referrers actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        Amount: 125,
                        Creator: "AAwalter",
                        DateText: "Jun-2019",
                        Description: "Admin Note",
                        Status: "Approved",
                        TransId: 1262276211,
                        TransType: 202
                    },
                    {
                        Amount: -100,
                        Creator: "AAwalter",
                        DateText: "Jun-2019",
                        Description: "",
                        Status: "B/F",
                        TransId: 1262276210,
                        TransType: 203
                    }
                ],
                TotalItem: 2
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            fromDate: "1/3/2019",
            isGetAll: false,
            pageIndex: 1,
            pageSize: 20,
            toDate: "7/3/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/StatementHistory/GetStatementHistoryList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            fromDate: "1/3/2019",
            isGetAll: false,
            pageIndex: 1,
            pageSize: 20,
            toDate: "7/3/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/StatementHistory/GetStatementHistoryList', param);

        expect(result).toEqual(null);
    })
});