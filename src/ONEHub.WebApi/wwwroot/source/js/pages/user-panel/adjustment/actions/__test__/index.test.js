import { getBalanceBroughtForward, handleSubmit } from '../index';
import * as ajaxRequest from '../../../../../modules/ajaxRequest';
import { submitFail } from "../../../../../modules/constants";

describe('adjustment actions', () => {
    it('should create action to getBalanceBroughtForward with correct parameter', async () => {
        const expectedResponse = {
            data: 123456,
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808
        }

        const result = await getBalanceBroughtForward(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/Adjustment/GetBalanceBroughtForward', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to getBalanceBroughtForward with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456
        }

        const result = await getBalanceBroughtForward(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/Adjustment/GetBalanceBroughtForward', param);

        expect(result).toEqual(0);
    })

    it('should create action to handleSubmit with correct parameter', async () => {
        const expectedResponse = {
            data: { IsSuccessful: true, Message: '' },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            amount: 100,
            content: ''
        }

        const result = await handleSubmit(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/Adjustment/InsertAdjustment', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to handleSubmit with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();

        const param = {
            affId: 123456,
            amount: 100,
            content: ''
        }

        const result = await handleSubmit(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/Adjustment/InsertAdjustment', param);

        expect(result).toEqual(submitFail);
    })
});