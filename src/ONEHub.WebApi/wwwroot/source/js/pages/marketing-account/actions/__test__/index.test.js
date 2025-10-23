import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../modules/ajaxRequest';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setParam', type: types.SET_PARAM, data: { affId: '123' } },
    { name: 'setIsShowAddAffMktAccountPopup', type: types.SET_IS_SHOW_ADD_AF_MKT_ACCOUNT_POPUP, data: true },
    { name: 'setAff', type: types.SET_AFF, data: { affId: '123', affName: 'Test Affiliate' } }
];

describe('marketing-account actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    describe('fetchMarketingAccounts', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should fetch marketing accounts with correct parameters', async () => {
            const mockResponse = {
                status: 200,
                data: {
                    MainData: [
                        {
                            AffId: 123,
                            UserName: 'testuser',
                            AffCode: 'AFF123',
                            Status: 'Approved'
                        }
                    ],
                    TotalItem: 1
                }
            };

            const mockPost = jest.spyOn(ajaxRequest, 'post').mockResolvedValue(mockResponse);
            const param = { PageIndex: 1, PageSize: 20 };

            const result = await actions.fetchMarketingAccounts(param)();

            expect(mockPost).toHaveBeenCalledWith('Portal/Affiliate/GetAffiliateList', param);
            expect(result).toEqual(mockResponse.data);
        });

        it('should return null when response status is not 200', async () => {
            const mockResponse = {
                status: 500,
                data: null
            };

            const mockPost = jest.spyOn(ajaxRequest, 'post').mockResolvedValue(mockResponse);
            const param = { PageIndex: 1, PageSize: 20 };

            const result = await actions.fetchMarketingAccounts(param)();

            expect(result).toBeNull();
        });

        it('should return null when response is null', async () => {
            const mockPost = jest.spyOn(ajaxRequest, 'post').mockResolvedValue(null);
            const param = { PageIndex: 1, PageSize: 20 };

            const result = await actions.fetchMarketingAccounts(param)();

            expect(result).toBeNull();
        });
    });

    describe('getMarketingAccountInfo', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should get marketing account info with correct structure', async () => {
            const mockResponse = {
                status: 200,
                data: {
                    FirstName: 'John',
                    LastName: 'Doe',
                    Email: 'john@test.com',
                    PaymentMethod: 'Bank',
                    AffCode: 'AFF123'
                }
            };

            const mockPost = jest.spyOn(ajaxRequest, 'post').mockResolvedValue(mockResponse);
            const affId = 123;

            const result = await actions.getMarketingAccountInfo(affId);

            expect(mockPost).toHaveBeenCalledWith('Portal/MarketingAccount/GetUserAccountInfo', { affId });
            expect(result).toHaveProperty('personalInfo');
            expect(result).toHaveProperty('additionalInfo');
            expect(result).toHaveProperty('paymentInfo');
            expect(result).toHaveProperty('websiteInfo');
            expect(result).toHaveProperty('generalInfo');
        });

        it('should handle null response gracefully', async () => {
            const mockPost = jest.spyOn(ajaxRequest, 'post').mockResolvedValue(null);
            const affId = 123;

            const result = await actions.getMarketingAccountInfo(affId);

            expect(result).toHaveProperty('personalInfo');
            expect(result).toHaveProperty('additionalInfo');
            expect(result).toHaveProperty('paymentInfo');
            expect(result).toHaveProperty('websiteInfo');
            expect(result).toHaveProperty('generalInfo');
        });
    });

    describe('createMarketingAccount', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should create marketing account successfully', async () => {
            const mockResponse = {
                status: 200,
                data: {
                    Success: true,
                    AffId: 123,
                    Message: 'Account created successfully'
                }
            };

            const mockPost = jest.spyOn(ajaxRequest, 'post').mockResolvedValue(mockResponse);
            const data = {
                UserName: 'testuser',
                Email: 'test@example.com',
                FirstName: 'Test',
                LastName: 'User'
            };

            const result = await actions.createMarketingAccount(data);

            expect(mockPost).toHaveBeenCalledWith('Portal/MarketingAccount/CreateMarketingAccount', data);
            expect(result).toEqual(mockResponse.data);
        });

        it('should return null when creation fails', async () => {
            const mockResponse = {
                status: 500,
                data: null
            };

            const mockPost = jest.spyOn(ajaxRequest, 'post').mockResolvedValue(mockResponse);
            const data = { UserName: 'testuser' };

            const result = await actions.createMarketingAccount(data);

            expect(result).toBeNull();
        });
    });
}); 