import React from 'react'
import GeneralInfo from '../../GeneralInfo'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SET_AFF_NAME } from '../../../actions/types'

const mockStore = configureMockStore()

describe('customer - left panel - GeneralInfo - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            leftPanel: {
                affiliateInfo: {}
            }
        }
        store = mockStore(initialState)
        wrapper = shallow(<GeneralInfo store={store} />).dive()
    })

    it('should show correct value', () => {
        expect(wrapper.props().affiliateInfo ).toEqual({})
    })

    it('should call correct action', () => {
        wrapper.props().setAffName('ABC')

        const actions = store.getActions();
        expect(actions).toEqual([{ type: SET_AFF_NAME, data: 'ABC' }])
    })
})