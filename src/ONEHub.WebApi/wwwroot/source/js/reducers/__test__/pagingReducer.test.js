import { SET_PAGING_OPTION } from '../../actions/actionTypes';
import { pagingOption } from '../pagingReducer';

const defaultPagingOption = {
    PageIndex: 1,
    PageSize: 20,
    TotalItem: 0,
    PageList: [10]
};

const expectPagingOption = {
    PageIndex: 1,
    PageSize: 20,
    TotalItem: 100,
    PageList: [10, 20, 50, 100, 500]
}

describe('pagingOption reducer', () => {
    it(`should handle pagingOption reducer with type SET_PAGING_OPTION`, () => {
        const result = pagingOption(defaultPagingOption, { type: SET_PAGING_OPTION, data: { TotalItem: 100, PageList: [10, 20, 50, 100, 500] } });
        expect(result).toEqual(expectPagingOption);
    });
});