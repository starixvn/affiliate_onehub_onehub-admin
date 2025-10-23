import { setPagingOption } from '../pagingAction';
import { SET_PAGING_OPTION } from '../actionTypes';

describe('set paging action', () => {
    it(`should create action to set paging action`, () => {
        const expectedAction = { type: SET_PAGING_OPTION, data: 'data' };

        expect(setPagingOption('data')).toEqual(expectedAction);
    });
});