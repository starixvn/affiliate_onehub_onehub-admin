﻿import { SET_SHOW_POPUP_PASSWORD } from '../../actions/types'
import { showPopupPassword } from '../index'

describe('showPopupPassword reducer', () => {
    it(`should handle showPopupPassword reducer with type SET_SHOW_POPUP_PASSWORD`, () => {
        const result = showPopupPassword(false, { type: SET_SHOW_POPUP_PASSWORD, data: true });
        expect(result).toEqual(true);
    });
});