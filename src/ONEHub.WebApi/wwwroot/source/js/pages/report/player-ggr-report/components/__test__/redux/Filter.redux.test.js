import React from 'react'
import { shallow } from 'enzyme'
import Filter from '../../Filter'
import configureMockStore from 'redux-mock-store'

describe('player ggr report - redux - Filter', () => {
    it('should mapping to props correctly', () => {
        const initialState = {
            noMapping: '',
            productList: [],
            pagingOption: {},
            baseCurrencyList: [],
            isProduction: false,
            today: '10/27/2021',
            param: {}
        }

        const mockStore = configureMockStore()
        const wrapper = shallow(<Filter store={mockStore(initialState)} />).dive()

        const { productList, pagingOption, baseCurrencyList, isProduction, today, param, noMapping } = wrapper.props();

        expect(productList).toEqual([]);
        expect(pagingOption).toEqual({});
        expect(baseCurrencyList).toEqual([]);
        expect(isProduction).toBeFalsy();
        expect(today).toEqual('10/27/2021');
        expect(param).toEqual({});
        expect(noMapping).toBeUndefined();
    })
})