import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../../modules/ajaxRequest'

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setReportTitle', type: types.SET_REPORT_TITLE, data: 'Affiliate Report Title' },
    { name: 'setProductList', type: types.SET_PRODUCT_LIST, data: 'setProductList' },
    { name: 'setCommGroupList', type: types.SET_COMM_GROUP_LIST, data: 'setCommGroupList' },
    { name: 'setPaymentCurrencyList', type: types.SET_PAYMENT_CURRENCY_LIST, data: 'setPaymentCurrencyList' },
    { name: 'setParam', type: types.SET_PARAM, data: 'setParam' },
    { name: 'setViewLevel', type: types.SET_VIEW_LEVEL, data: 'setViewLevel' },
    { name: 'setCurrencyList', type: types.SET_CURRENCY_LIST, data: 'setCurrencyList' }
]

describe('affiliate report actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('fetchData - call api successfully', async () => {
        ajaxRequest.post = jest.fn(() => ({ status: 200, data: 'test' }))

        const result = await actions['fetchData']({}, true)()

        expect(result).toEqual('test')
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Report/GetMainData', {})
    })

    it('fetchData - call api is errored', async () => {
        ajaxRequest.post = jest.fn(() => ({ status: 500 }))

        const result = await actions['fetchData']({}, false)()

        expect(result).toEqual(null)
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Report/GetDetailData', {})
    })
});