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
    { name: 'setSortingColumn', type: types.SET_SORTING_COLUMN, data: { sortingColumn: 'SortingColumn' } }

]

describe('player detail actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    const expectedResponse = {
        data: {
            MainData: [
                {
                    BankingFee: 0,
                    Bonus: 0,
                    Deposit: 0,
                    IbcUserName: "12BETEURO02237",
                    RegisteredDate: "2009-08-22T07:59:00",
                    RegisteredDateText: "08/22/2009 07:59:00",
                    Turnover: 771.4375,
                    UserName: "12BET$cicutadino",
                    Ggr: 215.0872,
                    Withdrawal: 0
                },
                {
                    BankingFee: 0,
                    Bonus: 0,
                    Deposit: 0,
                    IbcUserName: "12BETUS$02010",
                    RegisteredDate: "2009-03-13T12:13:00",
                    RegisteredDateText: "03/13/2009 12:13:00",
                    Turnover: 306,
                    UserName: "12BET$Monta",
                    Ggr: 7.22,
                    Withdrawal: 0
                }
            ],
            TotalItem: 2
        },
        status: 200
    };

    it('should create action to fetchData with correct parameter', async () => {
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            monthDate: "1/1/2019",
            pageIndex: 1,
            pageSize: 20,
            productId: 0
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/PlayerDetail/GetPlayerDetailList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            monthDate: "1/1/2019",
            pageIndex: 1,
            pageSize: 20,
            productId: 0
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/PlayerDetail/GetPlayerDetailList', param);

        expect(result).toEqual(null);
    })
});