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
];

describe('marketing statistics actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: [
                {
                    ChannelName: "Channel1",
                    Value: 100
                },
                {
                    ChannelName: "Channel2",
                    Value: 200
                }
            ],
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 123,
            fromDate: "2024-01-01",
            toDate: "2024-01-31",
            languageCodes: "en,vi",
            includedInActive: true
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/MarketingStatistics/GetMarketingStatisticsList', param);
        expect(result).toEqual(expectedResponse.data);
    });

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123,
            fromDate: "2024-01-01",
            toDate: "2024-01-31",
            languageCodes: "en,vi",
            includedInActive: true
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/MarketingStatistics/GetMarketingStatisticsList', param);
        expect(result).toEqual(null);
    });
});
