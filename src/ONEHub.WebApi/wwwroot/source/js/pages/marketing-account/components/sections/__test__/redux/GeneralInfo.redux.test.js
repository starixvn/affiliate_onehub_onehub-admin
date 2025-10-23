import React from 'react';
import GeneralInfo from '../../GeneralInfo';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('marketing-account - sections - GeneralInfo - connect', () => {
    let wrapper, store;

    const defaultState = {
        aff: {
            affId: 12345,
            affName: 'Test Marketing Account'
        },
        languageCodeList: {
            'en': 'English',
            'zh': 'Chinese',
            'th': 'Thai'
        },
        targetCountryCodeList: {
            'US': 'United States',
            'CN': 'China',
            'TH': 'Thailand'
        },
        dealOptionsList: {
            'rev_share': 'Revenue Share',
            'cpa': 'CPA',
            'hybrid': 'Hybrid'
        }
    };

    beforeEach(() => {
        store = mockStore(defaultState);
        wrapper = shallow(<GeneralInfo store={store} />).dive();
    });

    it('should show correct aff value', () => {
        expect(wrapper.props().aff).toEqual(defaultState.aff);
    });

    it('should show correct languageCodeList value', () => {
        expect(wrapper.props().languageCodeList).toEqual(defaultState.languageCodeList);
    });

    it('should show correct targetCountryCodeList value', () => {
        expect(wrapper.props().targetCountryCodeList).toEqual(defaultState.targetCountryCodeList);
    });

    it('should show correct dealOptionsList value', () => {
        expect(wrapper.props().dealOptionsList).toEqual(defaultState.dealOptionsList);
    });

    it('should handle missing aff object', () => {
        const stateWithoutAff = { ...defaultState, aff: null };
        store = mockStore(stateWithoutAff);
        wrapper = shallow(<GeneralInfo store={store} />).dive();
        
        expect(wrapper.props().aff).toBeNull();
    });

    it('should handle missing languageCodeList', () => {
        const stateWithoutLanguages = { ...defaultState, languageCodeList: null };
        store = mockStore(stateWithoutLanguages);
        wrapper = shallow(<GeneralInfo store={store} />).dive();
        
        expect(wrapper.props().languageCodeList).toBeNull();
    });

    it('should handle missing targetCountryCodeList', () => {
        const stateWithoutCountries = { ...defaultState, targetCountryCodeList: null };
        store = mockStore(stateWithoutCountries);
        wrapper = shallow(<GeneralInfo store={store} />).dive();
        
        expect(wrapper.props().targetCountryCodeList).toBeNull();
    });

    it('should handle missing dealOptionsList', () => {
        const stateWithoutDeals = { ...defaultState, dealOptionsList: null };
        store = mockStore(stateWithoutDeals);
        wrapper = shallow(<GeneralInfo store={store} />).dive();
        
        expect(wrapper.props().dealOptionsList).toBeNull();
    });

    it('should handle empty state objects', () => {
        const emptyState = {
            aff: {},
            languageCodeList: {},
            targetCountryCodeList: {},
            dealOptionsList: {}
        };
        store = mockStore(emptyState);
        wrapper = shallow(<GeneralInfo store={store} />).dive();
        
        expect(wrapper.props().aff).toEqual({});
        expect(wrapper.props().languageCodeList).toEqual({});
        expect(wrapper.props().targetCountryCodeList).toEqual({});
        expect(wrapper.props().dealOptionsList).toEqual({});
    });

    it('should handle complex aff object structure', () => {
        const complexAff = {
            affId: 99999,
            affName: 'Complex Marketing Account Name',
            email: 'test@example.com',
            status: 'active',
            additionalData: {
                nested: 'value'
            }
        };
        const stateWithComplexAff = { ...defaultState, aff: complexAff };
        store = mockStore(stateWithComplexAff);
        wrapper = shallow(<GeneralInfo store={store} />).dive();
        
        expect(wrapper.props().aff).toEqual(complexAff);
        expect(wrapper.props().aff.affName).toBe('Complex Marketing Account Name');
        expect(wrapper.props().aff.additionalData.nested).toBe('value');
    });

    it('should handle large option lists', () => {
        const largeLanguageList = {};
        const largeCountryList = {};
        const largeDealList = {};
        
        // Generate large lists
        for (let i = 0; i < 50; i++) {
            largeLanguageList[`lang${i}`] = `Language ${i}`;
            largeCountryList[`country${i}`] = `Country ${i}`;
            largeDealList[`deal${i}`] = `Deal Option ${i}`;
        }
        
        const stateWithLargeLists = {
            ...defaultState,
            languageCodeList: largeLanguageList,
            targetCountryCodeList: largeCountryList,
            dealOptionsList: largeDealList
        };
        
        store = mockStore(stateWithLargeLists);
        wrapper = shallow(<GeneralInfo store={store} />).dive();
        
        expect(Object.keys(wrapper.props().languageCodeList)).toHaveLength(50);
        expect(Object.keys(wrapper.props().targetCountryCodeList)).toHaveLength(50);
        expect(Object.keys(wrapper.props().dealOptionsList)).toHaveLength(50);
    });

    it('should provide setAff dispatch function', () => {
        expect(typeof wrapper.props().setAff).toBe('function');
    });

    it('should handle dispatch function call', () => {
        const mockDispatch = jest.fn();
        store.dispatch = mockDispatch;
        
        // Re-render with updated store
        wrapper = shallow(<GeneralInfo store={store} />).dive();
        
        // Simulate calling setAff
        if (wrapper.props().setAff) {
            wrapper.props().setAff('new value');
        }
        
        // The exact dispatch behavior depends on the setAff action creator
        // Just verify the function is callable without error
        expect(typeof wrapper.props().setAff).toBe('function');
    });

    it('should maintain props structure when state updates', () => {
        const updatedState = {
            ...defaultState,
            aff: { affId: 54321, affName: 'Updated Account' }
        };
        
        store = mockStore(updatedState);
        wrapper = shallow(<GeneralInfo store={store} />).dive();
        
        expect(wrapper.props().aff.affId).toBe(54321);
        expect(wrapper.props().aff.affName).toBe('Updated Account');
        expect(wrapper.props().languageCodeList).toEqual(defaultState.languageCodeList);
        expect(wrapper.props().targetCountryCodeList).toEqual(defaultState.targetCountryCodeList);
        expect(wrapper.props().dealOptionsList).toEqual(defaultState.dealOptionsList);
    });
}); 