import React from 'react'
import Content from '../../Content'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('user account - Content - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            affCommonInfo: {
                affId: '123',
                affName: 'ABC'
            },
            edit: {
                userAccountInfo: {},
                moreSiteUrlsList: []
            },
            licenseeName: 'XYZ'
        }
        store = mockStore(initialState)
        wrapper = shallow(<Content store={store} />).dive()
    })

    it('should show correct value', () => {
        const { affId, affName, userAccountInfo, moreSiteUrlsList, licenseeName } = wrapper.props();
        expect(affId).toEqual('123')
        expect(affName).toEqual('ABC')
        expect(moreSiteUrlsList).toEqual([])
        expect(userAccountInfo).toEqual({})
        expect(licenseeName).toEqual('XYZ')
    })
})