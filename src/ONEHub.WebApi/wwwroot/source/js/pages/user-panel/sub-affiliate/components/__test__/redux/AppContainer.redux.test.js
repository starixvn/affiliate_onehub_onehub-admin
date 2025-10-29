import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('sub aff - AppContainer - connect', () => {
    let wrapper, store;

    beforeEach(() => {
        const initialState = {
            subAffiliate: {
                param: {}
            },
            baseCurrencyList: []
        }
        store = mockStore(initialState)
        wrapper = shallow(<AppContainer store={store} />).dive()
    })

    it('should show correct value', () => {
        expect(wrapper.props().baseCurrencyList).toEqual([])
    })
})