import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SET_SELECTED_BANNER_ID } from '../../../actions/types'

const mockStore = configureMockStore()

describe('banner list - AppContainer - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            isShowLoader: true,
            checkedBanners: { 123: false },
            param: {},
            gridData: [{id: 123}]
        }
        store = mockStore(initialState)
        wrapper = shallow(<AppContainer store={store} />).dive()
    })

    it('should show correct value', () => {
        const { isShowLoader, param, gridData, checkedBanners } = wrapper.props();
        expect(isShowLoader).toBeTruthy()
        expect(checkedBanners).toEqual({ 123: false })
        expect(gridData).toEqual([{ id: 123 }])
        expect(param).toEqual({})
    })

    it('should call correct action', () => {
        wrapper.props().setSelectedBannerId('456')

        const actions = store.getActions();
        expect(actions).toEqual([{ type: SET_SELECTED_BANNER_ID, data: '456'}])
    })
})