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
    { name: 'setShowIdList', type: types.SET_SHOW_ID_LIST, data: { 10279105: true } }
]

describe('customer member actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        Action: "Setting for Commission Group",
                        DateText: "07/01/2019 12:46:38 AM",
                        Description: "GroupId=1271808GroupId=102",
                        LogId: 6860,
                        Ip: "::1",
                        UpdatedName: "AAwalter"
                    },
                    {
                        Action: "Payout",
                        DateText: "06/20/2019 10:25:07 PM",
                        Description: "Affiliate request payout. Amount=125.00",
                        LogId: 10279364,
                        Ip: "10.18.200.125",
                        UpdatedName: ""
                    }
                ],
                Total: null,
                TotalItem: 2
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            fromDate: "01/04/2016",
            logType: 0,
            pageIndex: 3,
            pageSize: 20,
            toDate: "07/03/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/ViewLog/GetViewLogList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            fromDate: "01/04/2016",
            logType: 0,
            pageIndex: 3,
            pageSize: 20,
            toDate: "07/03/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/ViewLog/GetViewLogList', param);

        expect(result).toEqual(null);
    })

    it('should create action to getLogTypeList with correct parameter', async () => {
        const expectedResponse = {
            data: [{ TypeId: 1, TypeName: 'RevenueGroup' }],
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const result = await actions['getLogTypeList']()();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/ViewLog/GetLogTypeList');
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to getLogTypeList with error response', async () => {
        ajaxRequest.post = jest.fn();

        const result = await actions['getLogTypeList']()();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/ViewLog/GetLogTypeList');

        expect(result).toEqual(null);
    })
});