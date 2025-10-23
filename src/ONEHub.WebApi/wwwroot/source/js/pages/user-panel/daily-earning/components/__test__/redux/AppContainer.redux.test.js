import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SET_SELECTED_USERPANEL } from '../../../../../customer/user-panel/actions/types'

const mockStore = configureMockStore()

describe('daily earning - AppContainer - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            dailyEarning: {
                param: {}
            },
            productList: [],
            currencyList: [],
            baseCurrencyList: []
        }
        store = mockStore(initialState)
        wrapper = shallow(<AppContainer store={store} />).dive()
    })

    it('should show correct value', () => {
        const { param, productList, currencyList, baseCurrencyList } = wrapper.props();
        expect(baseCurrencyList).toEqual([])
        expect(currencyList).toEqual([])
        expect(productList).toEqual([])
        expect(param).toEqual({})
    })

    it('should call correct action', () => {
        wrapper.props().setSelectedUserPanel('abc')

        const actions = store.getActions();
        expect(actions).toEqual([{ type: SET_SELECTED_USERPANEL, data: 'abc'}])
    })
})