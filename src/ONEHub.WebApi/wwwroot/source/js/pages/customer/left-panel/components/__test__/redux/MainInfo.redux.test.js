import React from 'react'
import MainInfo from '../../MainInfo'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('customer - left panel - MainInfo - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            leftPanel: {
                affiliateInfo: {}
            }
        }
        store = mockStore(initialState)
        wrapper = shallow(<MainInfo store={store} />).dive()
    })

    it('should show correct value', () => {
        expect(wrapper.props().affiliateInfo).toEqual({})
    })
})