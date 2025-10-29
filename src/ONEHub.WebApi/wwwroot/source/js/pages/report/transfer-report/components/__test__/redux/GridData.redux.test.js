import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import GridData from '../../GridData'

describe('transfer report - redux - GridData - ', () => {
    it('should mapping to props correctly', () => {
        const initialState = {
            noMapping: '',
            pagingOption: {},
            param: {}
        }

        const mockStore = configureMockStore()
        const wrapper = shallow(<GridData store={mockStore(initialState)} />).dive()

        const { pagingOption, param, noMapping } = wrapper.props()

        expect(noMapping).toBeUndefined()
        expect(pagingOption).toEqual({})
        expect(param).toEqual({})
    })
})