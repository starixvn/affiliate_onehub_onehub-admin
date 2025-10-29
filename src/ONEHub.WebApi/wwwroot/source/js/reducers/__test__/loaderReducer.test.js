﻿import { TOGGLE_LOADER } from '../../actions/actionTypes';
import { isShowLoader } from '../loaderReducer';

describe('isShowLoader reducer', () => {
    it(`should handle isShowLoader reducer with type TOGGLE_LOADER`, () => {
        const result = isShowLoader(false, { type: TOGGLE_LOADER, data: true });
        expect(result).toEqual(true);
    });
});