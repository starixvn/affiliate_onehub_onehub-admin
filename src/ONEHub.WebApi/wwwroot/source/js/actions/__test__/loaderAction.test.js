import { toggleLoader } from '../loaderAction'
import { TOGGLE_LOADER } from '../actionTypes'

describe('toggle loader action', () => {
    it(`should create action to toggle loader action`, () => {
        const expectedAction = { type: TOGGLE_LOADER, data: 'data' };

        expect(toggleLoader('data')).toEqual(expectedAction);
    });
});