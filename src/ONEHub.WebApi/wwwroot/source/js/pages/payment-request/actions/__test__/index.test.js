import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../modules/ajaxRequest';

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setParam', type: types.SET_PARAM, data: { param: 'param' } },
    { name: 'setTransactionId', type: types.SET_TRANSACTION_ID, data: 123456 },
]

describe('payment request actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: {
                MainData: [{
                    AffName: "12BETAFF226",
                    Amount: 125,
                    CompletedDateText: "06/20/2019 22:45:23",
                    Creator: "AAwalter",
                    Status: "Approved",
                    TransDateText: "06/20/2019 22:25:07",
                    TransId: 1262276211
                }],
                Total: null,
                TotalItem: 1
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            FromDate: "6/25/2019",
            IsGetAll: false,
            PageIndex: 1,
            PageSize: 20,
            SearchBy: 1,
            Status: null,
            ToDate: "6/26/2019",
            Username: null
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/PaymentRequest/GetPaymentRequestList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            FromDate: "6/25/2019",
            IsGetAll: false,
            PageIndex: 1,
            PageSize: 20,
            SearchBy: 1,
            Status: null,
            ToDate: "6/26/2019",
            Username: '123abc123'
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/PaymentRequest/GetPaymentRequestList', param);

        expect(result).toEqual(null);
    })
});