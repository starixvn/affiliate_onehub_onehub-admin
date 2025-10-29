import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SET_TRANSACTION_ID } from '../../../actions/types'

const mockStore = configureMockStore()

describe('payment request - AppContainer - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            isShowLoader: true,
            transactionId: '123',
            param: {},
            licenseeName: 'ABC'
        }
        store = mockStore(initialState)
        wrapper = shallow(<AppContainer store={store} />).dive()
    })

    it('should show correct value', () => {
        const { isShowLoader, transactionId, param, licenseeName } = wrapper.props();
        expect(isShowLoader).toBeTruthy()
        expect(transactionId).toEqual('123')
        expect(licenseeName).toEqual('ABC')
        expect(param).toEqual({})
    })

    it('should call correct action', () => {
        wrapper.props().setTransactionId('456')

        const actions = store.getActions();
        expect(actions).toEqual([{ type: SET_TRANSACTION_ID, data: '456'}])
    })
})