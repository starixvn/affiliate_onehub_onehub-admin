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
    { name: 'setSelectedMonth', type: types.SET_SELECTED_MONTH, data: 'January-2017' },
    { name: 'setParam', type: types.SET_PARAM, data: { param: 'param' } }
]

describe('landing page actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('getTrackingCodeList - should return correct data', async () => {
        const expectedResponse = {
            data: [{ abc: 123 }],
            status: 200
        };
        ajaxRequest.post = jest.fn(() => expectedResponse);
        const result = await actions['getTrackingCodeList'](1300390)();

        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: [
                {
                    DateText: "07/01/2019",
                    MonthText: "July-2019",
                    TotalClick: 0,
                    UniqueClick: 0
                },
                {
                    DateText: "01/01/2017",
                    MonthText: "January-2017",
                    TotalClick: 487,
                    UniqueClick: 342
                }
            ],
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1300390,
            trackingCode: ""
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/TrackingStatistics/GetTrackingStatisticsList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            deviceType: 0,
            fromDate: "07/01/2018",
            languageCode: "",
            selectedPage: "",
            toDate: "7/3/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/TrackingStatistics/GetTrackingStatisticsList', param);

        expect(result).toEqual(null);
    })

    it('should create action to fetchDetailData with correct parameter', async () => {
        const expectedResponse = {
            data: [
                {
                    DateText: "01/31/2017",
                    MonthText: "January-2017",
                    TotalClick: 12,
                    UniqueClick: 10
                },
                {
                    DateText: "01/30/2017",
                    MonthText: "January-2017",
                    TotalClick: 11,
                    UniqueClick: 9
                }
            ],
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1300390,
            selectedMonth: "January-2017",
            trackingCode: ""
        }

        const result = await actions['fetchDetailData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/TrackingStatistics/GetTrackingStatisticsDetailList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchDetailData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            selectedMonth: "January-2017",
            trackingCode: ""
        }

        const result = await actions['fetchDetailData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/TrackingStatistics/GetTrackingStatisticsDetailList', param);

        expect(result).toEqual(null);
    })
});