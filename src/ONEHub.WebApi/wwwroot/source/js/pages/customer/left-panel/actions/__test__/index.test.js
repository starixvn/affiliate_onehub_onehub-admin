import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../../modules/ajaxRequest';
import { submitFail } from "../../../../../modules/constants";

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setAffName', type: types.SET_AFF_NAME, data: '12BETAFF226' },
    { name: 'setIsValidUserName', type: types.SET_IS_VALID_USERNAME, data: true },
    { name: 'toggleLoaderLeftPanel', type: types.TOGGLE_LOADER_LEFT_PANEL, data: true },
]

describe('left panel - actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to getOnLineList with correct parameter', async () => {
        const expectedResponse = {
            data: [],
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affUsername: "12BETAFF226"
        }

        const result = await actions['getOnLineList'](param.affUsername)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/getOnLineList', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to getOnLineList with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affUsername: "12BET"
        }

        const result = await actions['getOnLineList'](param.affUsername)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/getOnLineList', param);

        expect(result).toEqual(null);
    })

    it('should create action to updateLanguage with correct parameter', async () => {
        const expectedResponse = {
            data: {
                Code: 0,
                IsSuccessful: true,
                Message: ""
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            AffId: 1271808,
            PreferredLanguage: "vi-VN"
        }

        const result = await actions['updateLanguage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/UpdateLanguage', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to updateLanguage with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            AffId: 1271808,
            PreferredLanguage: "abc"
        }

        const result = await actions['updateLanguage'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/UpdateLanguage', param);

        expect(result).toEqual(submitFail);
    })

    it('should create action to updateAffType with correct parameter', async () => {
        const expectedResponse = {
            data: {
                Code: 0,
                IsSuccessful: true,
                Message: ""
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            AffId: 1271808,
            AffType: "2"
        }

        const result = await actions['updateAffType'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/UpdateAffType', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to updateAffType with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            AffId: 1271808,
            AffType: "-2"
        }

        const result = await actions['updateAffType'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/UpdateAffType', param);

        expect(result).toEqual(submitFail);
    })

    it('should create action to updateStatus with correct parameter', async () => {
        const expectedResponse = {
            data: {
                Code: 0,
                IsSuccessful: true,
                Message: ""
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            AffId: 92037914,
            Status: "Disapproved"
        }

        const result = await actions['updateStatus'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/UpdateStatus', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to updateStatus with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            AffId: 123456,
            Status: "Disapproved"
        }

        const result = await actions['updateStatus'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/UpdateStatus', param);

        expect(result).toEqual(submitFail);
    })

    it('should create action to getTransferLimitSetting with correct parameter', async () => {
        const expectedResponse = {
            data: [],
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 123
        }

        const result = await actions['getTransferLimitSetting'](param.affId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/GetTransferLimitSetting', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to getTransferLimitSetting with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123
        }

        const result = await actions['getTransferLimitSetting'](param.affId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/GetTransferLimitSetting', param);

        expect(result).toEqual(null);
    })

    it('should create action to updateTransferLimitSetting with correct parameter', async () => {
        const expectedResponse = {
            data: {
                Code: 0,
                IsSuccessful: true,
                Message: ""
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            Amount: 1271808,
            IsEnable: true
        }

        const result = await actions['updateTransferLimitSetting'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/UpdateTransferLimitSetting', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to updateTransferLimitSetting with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            Amount: 123456,
            IsEnable: true
        }

        const result = await actions['updateTransferLimitSetting'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerLeftPanel/UpdateTransferLimitSetting', param);

        expect(result).toEqual(submitFail);
    })
});