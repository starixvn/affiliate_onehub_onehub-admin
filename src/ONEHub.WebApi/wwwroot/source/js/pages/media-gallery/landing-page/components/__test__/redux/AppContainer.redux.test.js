import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SET_SELECTED_LANDING_PAGE_ID } from '../../../actions/types'

const mockStore = configureMockStore()

describe('landing page - AppContainer - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            isShowLoader: true,
            checkedLandingPages: { 123: false },
            gridData: [{id: 123}]
        }
        store = mockStore(initialState)
        wrapper = shallow(<AppContainer store={store} />).dive()
    })

    it('should show correct value', () => {
        const { isShowLoader, gridData, checkedLandingPages } = wrapper.props();
        expect(isShowLoader).toBeTruthy()
        expect(checkedLandingPages ).toEqual({ 123: false })
        expect(gridData).toEqual([{ id: 123 }])
    })

    it('should call correct action', () => {
        wrapper.props().setSelectedLandingPageId('456')

        const actions = store.getActions();
        expect(actions).toEqual([{ type: SET_SELECTED_LANDING_PAGE_ID, data: '456'}])
    })
})