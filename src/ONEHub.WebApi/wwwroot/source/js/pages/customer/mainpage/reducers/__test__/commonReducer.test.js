﻿import { SET_AFF_COMMON_INFO } from '../../actions/types';
import { affCommonInfo } from '../commonReducer';

describe('customer - mainpage - common reducer', () => {
    it(`should handle affCommonInfo reducer with type SET_AFF_COMMON_INFO`, () => {
        const result = affCommonInfo(null, { type: SET_AFF_COMMON_INFO, data: { Id: 123 } });
        expect(result).toEqual({ Id: 123 });
    });
});