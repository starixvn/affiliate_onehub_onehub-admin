import React from 'react'
import Content from '../../Content'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

describe('marketing-account - Content - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const initialState = {
            params: {
                Status: '',
                SortType: 1,
                SortDirectionType: 1,
                Language: '',
                UserName: '',
                PageIndex: 1,
                PageSize: 20,
                TargetCountryCode: ''
            },
            languageCodeList: {
                'en': 'English',
                'zh-CN': 'Chinese Simplified'
            },
            targetCountryCodeList: {
                'US': 'United States',
                'CN': 'China'
            },
            canAddAffMktAccount: true
        }
        store = mockStore(initialState)
        wrapper = shallow(<Content store={store} />).dive()
    })

    it('should show correct value for params', () => {
        expect(wrapper.props().params).toEqual({
            Status: '',
            SortType: 1,
            SortDirectionType: 1,
            Language: '',
            UserName: '',
            PageIndex: 1,
            PageSize: 20,
            TargetCountryCode: ''
        })
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

    it('should show correct value for canAddAffMktAccount', () => {
        expect(wrapper.props().canAddAffMktAccount).toBeTruthy()
    })

    it('should map dispatch functions correctly', () => {
        expect(typeof wrapper.props().toggleLoader).toBe('function')
        expect(typeof wrapper.props().setIsShowAddAffMktAccountPopup).toBe('function')
        expect(typeof wrapper.props().setAff).toBe('function')
    })

    it('should handle different state values', () => {
        const newState = {
            params: {
                Status: 'Approved',
                SortType: 2,
                SortDirectionType: 2,
                Language: 'en',
                UserName: 'testuser',
                PageIndex: 2,
                PageSize: 50,
                TargetCountryCode: 'US'
            },
            languageCodeList: {
                'fr': 'French'
            },
            targetCountryCodeList: {
                'FR': 'France'
            },
            canAddAffMktAccount: false
        }
        store = mockStore(newState)
        wrapper = shallow(<Content store={store} />).dive()

        expect(wrapper.props().params.Status).toBe('Approved')
        expect(wrapper.props().params.UserName).toBe('testuser')
        expect(wrapper.props().canAddAffMktAccount).toBeFalsy()
        expect(wrapper.props().languageCodeList).toEqual({ 'fr': 'French' })
        expect(wrapper.props().targetCountryCodeList).toEqual({ 'FR': 'France' })
    })

    it('should handle null params', () => {
        const nullParamsState = {
            params: null,
            languageCodeList: {},
            targetCountryCodeList: {},
            canAddAffMktAccount: false
        }
        store = mockStore(nullParamsState)
        wrapper = shallow(<Content store={store} />).dive()

        expect(wrapper.props().params).toBeNull()
        expect(wrapper.props().canAddAffMktAccount).toBeFalsy()
    })

    it('should handle empty state values', () => {
        const emptyState = {
            params: {},
            languageCodeList: {},
            targetCountryCodeList: {},
            canAddAffMktAccount: false
        }
        store = mockStore(emptyState)
        wrapper = shallow(<Content store={store} />).dive()

        expect(wrapper.props().params).toEqual({})
        expect(wrapper.props().languageCodeList).toEqual({})
        expect(wrapper.props().targetCountryCodeList).toEqual({})
        expect(wrapper.props().canAddAffMktAccount).toBeFalsy()
    })
}) 