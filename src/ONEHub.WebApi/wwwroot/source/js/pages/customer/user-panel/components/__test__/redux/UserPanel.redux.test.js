import React from 'react'
import UserPanel from '../../UserPanel'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('user panel - UserPanel - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            isShowLoaderUserPanel: true
        }
        store = mockStore(initialState)
        wrapper = shallow(<UserPanel store={store} />).dive()
    })

    it('should show correct value', () => {
        expect(wrapper.props().isShowLoader).toBeTruthy()
    })
})