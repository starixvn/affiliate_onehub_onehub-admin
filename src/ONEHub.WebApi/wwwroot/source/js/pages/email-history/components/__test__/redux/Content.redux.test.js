import React from 'react'
import Content from '../../Content'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SET_SELECTED_EMAIL_ID } from '../../../actions/types'

const mockStore = configureMockStore()

describe('email history - Content - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            pagingOption: {},
            param: {},
            checkedEmails: '',
            claimsPrincipal: { hasWriteClaim: jest.fn(() => true) },
            shouldResetScrollPosition: false,
            gridData: []
        }
        store = mockStore(initialState)
        wrapper = shallow(<Content store={store} />).dive()
    })

    it('should show correct value', () => {
        const { pagingOption, param, checkedEmails, shouldResetScrollPosition, gridData, isModifiable, isShowSender } = wrapper.props();
        expect(gridData).toEqual([])
        expect(pagingOption).toEqual({})
        expect(param).toEqual({})
        expect(checkedEmails).toEqual('')
        expect(shouldResetScrollPosition).toBeFalsy()
        expect(isModifiable).toBeTruthy()
        expect(isShowSender).toBeTruthy()
    })

    it('should call correct action', () => {
        wrapper.props().setSelectedEmailId(123)

        const actions = store.getActions();
        expect(actions).toEqual([{ type: SET_SELECTED_EMAIL_ID, data: 123 }])
    })
})