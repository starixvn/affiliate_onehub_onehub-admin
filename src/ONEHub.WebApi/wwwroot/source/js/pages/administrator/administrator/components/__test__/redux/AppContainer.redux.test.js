import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

describe('administrator - AppContainer - connect', () => {
    it('should mapping to props correctly', () => {
        const initialState = {
            noMapping: '',
            isShowLoader: false,
            param: {},
            gridData: [],
            shouldResetScrollPosition: true
        }

        const mockStore = configureMockStore()
        const wrapper = shallow(<AppContainer store={mockStore(initialState)} />).dive()

        const { isShowLoader, param, gridData, shouldResetScrollPosition, noMapping } = wrapper.props()

        expect(noMapping).toBeUndefined()
        expect(isShowLoader).toBeFalsy()
        expect(shouldResetScrollPosition).toBeTruthy()
        expect(param).toEqual({})
        expect(gridData).toEqual([])
    })
})