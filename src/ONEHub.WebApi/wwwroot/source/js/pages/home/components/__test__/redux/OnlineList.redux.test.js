import React from 'react'
import OnlineList from '../../OnlineList'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('home - OnlineList - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            onlineList: [],
            pagingOption: {},
        }
        store = mockStore(initialState)
        wrapper = shallow(<OnlineList store={store} />).dive()
    })

    it('should show correct value', () => {
        const { pagingOption, onlineList } = wrapper.props();
        expect(onlineList).toEqual([])
        expect(pagingOption).toEqual({})
    })

    it('should call correct action', () => {
        wrapper.props().setPagingOption({ PageIndex: 1 })

        const actions = store.getActions();
        expect(actions).toEqual([{ type: 'SET_PAGING_OPTION', data: { PageIndex: 1 } }])
    })
})