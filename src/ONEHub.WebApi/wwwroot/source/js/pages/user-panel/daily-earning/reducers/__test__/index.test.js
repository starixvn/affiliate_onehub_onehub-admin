﻿import { SET_PARAM } from '../../actions/types';
import { param } from '../index';

describe('daily earning reducer', () => {
    it(`should handle param reducer with type SET_PARAM`, () => {
        const result = param(null, { type: SET_PARAM, data: { Id: 123 } });
        expect(result).toEqual({ Id: 123 });
    });
});