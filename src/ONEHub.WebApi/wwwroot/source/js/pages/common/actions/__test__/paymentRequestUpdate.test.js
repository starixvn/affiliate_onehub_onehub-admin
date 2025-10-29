import { getPaymentRequestDetail, updatePaymentRequest } from '../paymentRequestUpdate';
import * as ajaxRequest from '../../../../modules/ajaxRequest';

describe('paymentRequestUpdate actions', () => {
    it('should create action to getPaymentRequestDetail with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            transId: 1262276211
        }

        const result = await getPaymentRequestDetail(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/PaymentRequest/GetPaymentRequestDetail', param);
        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to getPaymentRequestDetail with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            transId: 123456
        }

        const result = await getPaymentRequestDetail(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/PaymentRequest/GetPaymentRequestDetail', param);
        expect(result).toEqual(null);
    })


    it('should create action to updatePaymentRequest with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            AffId: 968222,
            TransId: 1262276211,
            Status: 'Reject',
            AdminDesc: 'AdminDesc',
            AffDesc: 'AffDesc'
        }

        const result = await updatePaymentRequest(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/PaymentRequest/UpdatePaymentRequest', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updatePaymentRequest with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            AffId: 123,
            TransId: 123,
            Status: 'abc',
            AdminDesc: null,
            AffDesc: null
        }

        const result = await updatePaymentRequest(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/PaymentRequest/UpdatePaymentRequest', param);
        expect(result).toEqual(null);
    })
});