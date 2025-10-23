import React from 'react'
import Filter from '../../Filter'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('marketing-account - Filter - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            languageCodeList: {
                'en': 'English',
                'zh-CN': 'Chinese Simplified'
            },
            targetCountryCodeList: {
                'US': 'United States',
                'CN': 'China'
            }
        }
        store = mockStore(initialState)
        wrapper = shallow(<Filter store={store} />).dive()
    })

    it('should show correct value for languageCodeList', () => {
        expect(wrapper.props().languageCodeList).toEqual({
            'en': 'English',
            'zh-CN': 'Chinese Simplified'
        })
    })

    it('should show correct value for targetCountryCodeList', () => {
        expect(wrapper.props().targetCountryCodeList).toEqual({
            'US': 'United States',
            'CN': 'China'
        })
    })

    it('should map dispatch functions correctly', () => {
        expect(typeof wrapper.props().setParam).toBe('function')
        expect(typeof wrapper.props().setIsShowAddAffMktAccountPopup).toBe('function')
    })

    it('should handle different state values', () => {
        const newState = {
            languageCodeList: {
                'fr': 'French',
                'de': 'German'
            },
            targetCountryCodeList: {
                'FR': 'France',
                'DE': 'Germany'
            }
        }
        store = mockStore(newState)
        wrapper = shallow(<Filter store={store} />).dive()

        expect(wrapper.props().languageCodeList).toEqual({
            'fr': 'French',
            'de': 'German'
        })
        expect(wrapper.props().targetCountryCodeList).toEqual({
            'FR': 'France',
            'DE': 'Germany'
        })
    })

    it('should handle empty state values', () => {
        const emptyState = {
            languageCodeList: {},
            targetCountryCodeList: {}
        }
        store = mockStore(emptyState)
        wrapper = shallow(<Filter store={store} />).dive()

        expect(wrapper.props().languageCodeList).toEqual({})
        expect(wrapper.props().targetCountryCodeList).toEqual({})
    })
}) 