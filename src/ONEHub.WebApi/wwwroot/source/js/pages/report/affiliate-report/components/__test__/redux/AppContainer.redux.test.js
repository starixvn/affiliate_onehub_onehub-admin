import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('aff report - AppContainer - connect', () => {
    let wrapper
    let store

    beforeEach(() => {
        const initialState = {
            isShowLoader: false
        }
        store = mockStore(initialState)
        wrapper = shallow(<AppContainer store={store} />).dive()
    })

    it('should show correct value', () => {
        expect(wrapper.props().isShowLoader).toBeFalsy()
    })
})