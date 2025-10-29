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
    { name: 'setParam', type: types.SET_PARAM, data: { param: 'param' } },
]

describe('daily earning actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        BankingFee: 0,
                        Bonus: 0,
                        Date: "06 January 2019",
                        Deposit: 0,
                        Ggr: -536.0837,
                        WinlostDate: "2019-01-06T00:00:00",
                        Withdrawal: 0
                    },
                    {
                        BankingFee: 0,
                        Bonus: 0,
                        Date: "07 January 2019",
                        Deposit: 0,
                        Ggr: -1495.1505,
                        WinlostDate: "2019-01-07T00:00:00",
                        Withdrawal: 0
                    }
                ],
                Total: {
                    BankingFee: 0,
                    Bonus: 0,
                    Date: "Total",
                    Deposit: 0,
                    Ggr: -4619.4527,
                    WinlostDate: null,
                    Withdrawal: 0
                }
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            monthDate: "Jan-2019",
            productId: 0
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/StatementHistory/GetDailyEarning', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            monthDate: "Jan-2019",
            productId: 0
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/StatementHistory/GetDailyEarning', param);

        expect(result).toEqual(null);
    })
});