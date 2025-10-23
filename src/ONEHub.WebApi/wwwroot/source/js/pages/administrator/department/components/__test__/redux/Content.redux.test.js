import React from 'react'
import Content from '../../Content'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

describe('department - Content - connect', () => {
    it('should mapping to props correctly', () => {
        const initialState = {
            noMapping: '',
            gridData: [],
            shouldResetScrollPosition: true
        }

        const mockStore = configureMockStore()
        const wrapper = shallow(<Content store={mockStore(initialState)} />).dive()

        const { gridData, shouldResetScrollPosition, noMapping } = wrapper.props()

        expect(noMapping).toBeUndefined()
        expect(shouldResetScrollPosition).toBeTruthy()
        expect(gridData).toEqual([])
    })
})