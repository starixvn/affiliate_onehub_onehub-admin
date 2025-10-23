import React from 'react'
import Content from '../../Content'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SET_VIEW_LEVEL } from '../../../actions/types'

const mockStore = configureMockStore()

describe('aff report - Content - connect', () => {
    let wrapper
    let store

    beforeEach(() => {
        const initialState = {
            currentViewLevel: 1
        }
        store = mockStore(initialState)
        wrapper = shallow(<Content store={store} />).dive()
    })

    it('should show correct value', () => {
        expect(wrapper.props().currentViewLevel).toBe(1)
    })

    it('should call correct action', () => {
        wrapper.props().setViewLevel(2)

        const actions = store.getActions()
        expect(actions).toEqual([{ type: SET_VIEW_LEVEL, data: 2 }])
    })
})