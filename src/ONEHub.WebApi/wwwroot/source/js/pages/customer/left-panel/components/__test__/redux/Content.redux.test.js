import React from 'react'
import Content from '../../Content'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('customer - left panel - Content - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            leftPanel: {
                affiliateInfo: {}
            }
        }
        store = mockStore(initialState)
        wrapper = shallow(<Content store={store} />).dive()
    })

    it('should show correct value', () => {
        expect(wrapper.props().affiliateInfo).toEqual({})
    })
})