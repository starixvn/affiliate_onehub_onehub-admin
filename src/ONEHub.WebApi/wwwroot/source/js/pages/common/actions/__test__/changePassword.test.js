import { setShowPopupPassword, updateChangeAffPasswword, updateChangeAdminPasswword } from '../changePassword';
import * as ajaxRequest from '../../../../modules/ajaxRequest';
import { SET_SHOW_POPUP_PASSWORD } from '../types';

describe('changePassword actions', () => {
    it(`should create action to setShowPopupPassword action`, async () => {
        const expectedAction = { type: SET_SHOW_POPUP_PASSWORD, data: true };

        expect(setShowPopupPassword(true)).toEqual(expectedAction);
    });

    it('should create action to updateChangeAffPasswword with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            AffId: 123456,
            Password: '123abc',
            ConfirmPassword: '123abc'
        }

        const result = await updateChangeAffPasswword(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Affiliate/ChangePassword', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateChangeAffPasswword with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            AffId: 968222,
            Password: '123abc',
            ConfirmPassword: '123abc'
        }

        const result = await updateChangeAffPasswword(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Affiliate/ChangePassword', param);
        expect(result).toEqual({ IsSuccessful: true, Message: '' });
    })

    it('should create action to updateChangeAdminPasswword with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            AccountId: 123,
            Password: '123abc',
            ConfirmPassword: '123abc'
        }

        const result = await updateChangeAdminPasswword(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/ChangePassword', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateChangePasswword with correct parameter', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            AccountId: 123,
            Password: '123abc',
            ConfirmPassword: '123abc'
        }

        const result = await updateChangeAdminPasswword(param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/ChangePassword', param);
        expect(result).toEqual({ IsSuccessful: true, Message: '' });
    })
});