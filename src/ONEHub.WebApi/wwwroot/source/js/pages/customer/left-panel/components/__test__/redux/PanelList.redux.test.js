import React from 'react'
import PanelList from '../../PanelList'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('customer - left panel - PanelList - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            leftPanel: {
                affiliateInfo: {}
            }
        }
        store = mockStore(initialState)
        wrapper = shallow(<PanelList store={store} />).dive()
    })

    it('should show correct value', () => {
        expect(wrapper.props().affiliateInfo).toEqual({})
    })
})