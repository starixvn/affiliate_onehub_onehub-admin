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
    { name: 'setSelectedPage', type: types.SET_SELECTED_PAGE, data: 'abc.com' },
    { name: 'setParam', type: types.SET_PARAM, data: { param: 'param' } },
]

describe('landing page actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('getPageList - should return correct data', async () => {
        const getPageList = actions['getPageList']();

        expect(getPageList).toEqual(expect.any(Function));
    })

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: [
                {
                    Fdm: 0,
                    LanguageCode: "hien",
                    Page: "-",
                    Signups: 0,
                    TotalClick: 2,
                    UniqueClick: 1,
                    WebsiteUrl: ""
                },
                {
                    Fdm: 0,
                    LanguageCode: "ch",
                    Page: "1",
                    Signups: 0,
                    TotalClick: 1,
                    UniqueClick: 1,
                    WebsiteUrl: ""
                }
            ],
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            deviceType: 0,
            fromDate: "07/01/2018",
            languageCode: "",
            selectedPage: "",
            toDate: "7/3/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/LandingPageStatistics/GetLandingPageStatisticsList', param);
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

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/LandingPageStatistics/GetLandingPageStatisticsList', param);

        expect(result).toEqual(null);
    })

    it('should create action to fetchDetailData with correct parameter', async () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        Fdm: 0,
                        LanguageCode: "",
                        Page: "",
                        Signups: 0,
                        TotalClick: 8,
                        UniqueClick: 4,
                        WebsiteUrl: "https://aff-12b.nexdev.net/UserAsian/UserPanel/Main/#MediaGallery"
                    },
                    {
                        Fdm: 0,
                        LanguageCode: "",
                        Page: "",
                        Signups: 0,
                        TotalClick: 1,
                        UniqueClick: 1,
                        WebsiteUrl: "none"
                    }
                ],
                TotalItem: 2
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            deviceType: 0,
            fromDate: "07/01/2018",
            languageCode: "hien",
            pageIndex: 1,
            pageSize: 20,
            selectedPage: "sportsbook",
            toDate: "7/3/2019"
        }

        const result = await actions['fetchDetailData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/LandingPageStatistics/GetLandingPageStatisticsDetailList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchDetailData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            deviceType: 0,
            fromDate: "07/01/2018",
            languageCode: "hien",
            pageIndex: 1,
            pageSize: 20,
            selectedPage: "sportsbook",
            toDate: "7/3/2019"
        }

        const result = await actions['fetchDetailData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/LandingPageStatistics/GetLandingPageStatisticsDetailList', param);

        expect(result).toEqual(null);
    })
});