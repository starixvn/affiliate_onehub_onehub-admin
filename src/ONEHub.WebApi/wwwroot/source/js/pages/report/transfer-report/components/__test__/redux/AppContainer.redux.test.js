import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

describe('transfer report - AppContainer - connect', () => {
    it('should mapping to props correctly', () => {
        const initialState = {
            noMapping: '',
            isShowLoader: false
        }

        const mockStore = configureMockStore()
        const wrapper = shallow(<AppContainer store={mockStore(initialState)} />).dive()

        expect(wrapper.props().noMapping).toBeUndefined()
        expect(wrapper.props().isShowLoader).toBeFalsy()
    })
})