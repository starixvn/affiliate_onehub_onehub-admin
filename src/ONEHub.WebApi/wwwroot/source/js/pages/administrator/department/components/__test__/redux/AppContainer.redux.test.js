import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

describe('department - AppContainer - connect', () => {
    it('should mapping to props correctly', () => {
        const initialState = {
            noMapping: '',
            isShowLoader: false
        }

        const mockStore = configureMockStore()
        const wrapper = shallow(<AppContainer store={mockStore(initialState)} />).dive()

        const { isShowLoader, noMapping } = wrapper.props()

        expect(noMapping).toBeUndefined()
        expect(isShowLoader).toBeFalsy()
    })
})