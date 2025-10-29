import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('marketing-account - AppContainer - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            isShowLoader: true,
            isShowAddAffMktAccountPopup: false
        }
        store = mockStore(initialState)
        wrapper = shallow(<AppContainer store={store} />).dive()
    })

    it('should show correct value for isShowLoader', () => {
        expect(wrapper.props().isShowLoader).toBeTruthy()
    })

    it('should show correct value for isShowAddAffMktAccountPopup', () => {
        expect(wrapper.props().isShowAddAffMktAccountPopup).toBeFalsy()
    })

    it('should map dispatch functions correctly', () => {
        expect(typeof wrapper.props().setIsShowAddAffMktAccountPopup).toBe('function')
        expect(typeof wrapper.props().setAff).toBe('function')
    })

    it('should handle different state values', () => {
        const newState = {
            isShowLoader: false,
            isShowAddAffMktAccountPopup: true
        }
        store = mockStore(newState)
        wrapper = shallow(<AppContainer store={store} />).dive()

        expect(wrapper.props().isShowLoader).toBeFalsy()
        expect(wrapper.props().isShowAddAffMktAccountPopup).toBeTruthy()
    })
}) 