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
    { name: 'setSelectedSiteUrl', type: types.SET_SELECTED_SITE_URL, data: '12-bet.net' },
    { name: 'setParam', type: types.SET_PARAM, data: { param: 'param' } }
]

describe('referrers actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: [
                {
                    Fdm: 0,
                    Signups: 0,
                    SiteUrl: "123-casino.co.uk",
                    TotalClick: 2,
                    UniqueClick: 1,
                    WebsiteUrl: ""
                },
                {
                    Fdm: 0,
                    Signups: 0,
                    SiteUrl: "12-bet.net",
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
            fromDate: "07/01/2016",
            toDate: "7/3/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/Referrers/GetReferrersList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            deviceType: 0,
            fromDate: "07/01/2016",
            toDate: "7/3/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/Referrers/GetReferrersList', param);

        expect(result).toEqual(null);
    })

    it('should create action to fetchDetailData with correct parameter', async () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        Fdm: 0,
                        Signups: 0,
                        SiteUrl: "",
                        TotalClick: 1,
                        UniqueClick: 1,
                        WebsiteUrl: "http://ha.nexdev.net:7610/LRF1/Authorization/SignIn"
                    },
                    {
                        Fdm: 0,
                        Signups: 0,
                        SiteUrl: "",
                        TotalClick: 4,
                        UniqueClick: 3,
                        WebsiteUrl: "https://aff-12b.nexdev.net/UserAsian/UserPanel/#MediaGallery"
                    }
                ],
                TotalItem: 2
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            PageIndex: 1,
            PageSize: 20,
            affId: 1271808,
            deviceType: 0,
            fromDate: "07/01/2016",
            selectedSiteUrl: "ha.nexdev.net",
            toDate: "7/3/2019"
        }

        const result = await actions['fetchDetailData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/Referrers/GetReferrersDetailList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchDetailData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            PageIndex: 1,
            PageSize: 20,
            affId: 123456,
            deviceType: 0,
            fromDate: "07/01/2016",
            selectedSiteUrl: "ha.nexdev.net",
            toDate: "7/3/2019"
        }

        const result = await actions['fetchDetailData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/Referrers/GetReferrersDetailList', param);

        expect(result).toEqual(null);
    })
});