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

describe('daily earning detail actions', () => {
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
                        CustId: 31951570,
                        Deposit: 0,
                        IbcUserName: "12BETEURO02237",
                        UserName: "12BET$cicutadino",
                        Ggr: 4.1405,
                        Withdrawal: 0
                    },
                    {
                        BankingFee: 0,
                        Bonus: 0,
                        CustId: 33221781,
                        Deposit: 0,
                        IbcUserName: "12BETGBP02004",
                        UserName: "12BET$Munir12",
                        Ggr: -540.2242,
                        Withdrawal: 0
                    }
                ],
                Total: {
                    BankingFee: 0,
                    Bonus: 0,
                    CustId: 0,
                    Deposit: 0,
                    IbcUserName: "Total",
                    UserName: null,
                    Ggr: -536.0837,
                    Withdrawal: 0
                }
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            monthDate: "06 January 2019",
            productId: 0
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/StatementHistory/GetDailyEarningDetail', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            monthDate: "06 January 2019",
            productId: 0
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/StatementHistory/GetDailyEarningDetail', param);

        expect(result).toEqual(null);
    })
});