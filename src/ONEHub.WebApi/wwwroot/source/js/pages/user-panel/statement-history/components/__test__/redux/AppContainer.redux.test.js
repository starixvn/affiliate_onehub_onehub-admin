import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('statement history - AppContainer - connect', () => {
    let wrapper, store;

    beforeEach(() => {
        const initialState = {
            statementHistory: {
                param: {},
                transactionId: '123'
            },
            affCommonInfo: { affName: 'ABC' },
            licenseeName: 'XYZ'
        }
        store = mockStore(initialState)
        wrapper = shallow(<AppContainer store={store} />).dive()
    })

    it('should show correct value', () => {
        const { transactionId, affName, licenseeName } = wrapper.props();
        expect(licenseeName).toEqual('XYZ')
        expect(affName).toEqual('ABC')
        expect(transactionId).toEqual('123')
    })
})