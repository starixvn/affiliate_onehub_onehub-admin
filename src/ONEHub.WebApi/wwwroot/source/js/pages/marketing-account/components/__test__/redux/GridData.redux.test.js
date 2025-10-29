import React from 'react';
import GridData from '../../GridData';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('marketing-account - GridData - connect', () => {
    let wrapper, store;

    beforeEach(() => {
        const initialState = {
            params: {
                Status: 'Approved',
                PageIndex: 1,
                PageSize: 20,
                Language: 'en',
                TargetCountryCode: 'US'
            },
            languageCodeList: {
                'en': 'English',
                'zh-CN': 'Chinese'
            },
            targetCountryCodeList: {
                'US': 'United States',
                'CN': 'China'
            },
            pagingOption: {
                PageIndex: 1,
                PageSize: 20,
                TotalItem: 100
            },
            canAddAffMktAccount: true
        };
        store = mockStore(initialState);
        wrapper = shallow(<GridData store={store} />).dive();
    });

    it('should show correct value for params', () => {
        expect(wrapper.props().params).toEqual({
            Status: 'Approved',
            PageIndex: 1,
            PageSize: 20,
            Language: 'en',
            TargetCountryCode: 'US'
        });
    });

    it('should show correct value for languageCodeList', () => {
        expect(wrapper.props().languageCodeList).toEqual({
            'en': 'English',
            'zh-CN': 'Chinese'
        });
    });

    it('should show correct value for targetCountryCodeList', () => {
        expect(wrapper.props().targetCountryCodeList).toEqual({
            'US': 'United States',
            'CN': 'China'
        });
    });

    it('should show correct value for pagingOption', () => {
        expect(wrapper.props().pagingOption).toEqual({
            PageIndex: 1,
            PageSize: 20,
            TotalItem: 100
        });
    });

    it('should show correct value for canAddAffMktAccount', () => {
        expect(wrapper.props().canAddAffMktAccount).toBeTruthy();
    });

    it('should map dispatch functions correctly', () => {
        expect(typeof wrapper.props().toggleLoader).toBe('function');
        expect(typeof wrapper.props().fetchMarketingAccounts).toBe('function');
        expect(typeof wrapper.props().setPagingOption).toBe('function');
    });

    it('should handle different state values', () => {
        const newState = {
            params: {
                Status: 'Suspended',
                PageIndex: 2,
                PageSize: 50
            },
            languageCodeList: {
                'fr': 'French'
            },
            targetCountryCodeList: {
                'FR': 'France'
            },
            pagingOption: {
                PageIndex: 2,
                PageSize: 50,
                TotalItem: 200
            },
            canAddAffMktAccount: false
        };
        store = mockStore(newState);
        wrapper = shallow(<GridData store={store} />).dive();

        expect(wrapper.props().params.Status).toBe('Suspended');
        expect(wrapper.props().params.PageIndex).toBe(2);
        expect(wrapper.props().params.PageSize).toBe(50);
        expect(wrapper.props().languageCodeList).toEqual({ 'fr': 'French' });
        expect(wrapper.props().targetCountryCodeList).toEqual({ 'FR': 'France' });
        expect(wrapper.props().pagingOption.TotalItem).toBe(200);
        expect(wrapper.props().canAddAffMktAccount).toBeFalsy();
    });

    it('should handle null params', () => {
        const stateWithNullParams = {
            params: null,
            languageCodeList: {},
            targetCountryCodeList: {},
            pagingOption: {
                PageIndex: 1,
                PageSize: 20,
                TotalItem: 0
            },
            canAddAffMktAccount: false
        };
        store = mockStore(stateWithNullParams);
        wrapper = shallow(<GridData store={store} />).dive();

        expect(wrapper.props().params).toBeNull();
    });

    it('should handle empty state values', () => {
        const emptyState = {
            params: {},
            languageCodeList: {},
            targetCountryCodeList: {},
            pagingOption: {
                PageIndex: 1,
                PageSize: 20,
                TotalItem: 0
            },
            canAddAffMktAccount: false
        };
        store = mockStore(emptyState);
        wrapper = shallow(<GridData store={store} />).dive();

        expect(wrapper.props().params).toEqual({});
        expect(wrapper.props().languageCodeList).toEqual({});
        expect(wrapper.props().targetCountryCodeList).toEqual({});
        expect(wrapper.props().pagingOption.TotalItem).toBe(0);
        expect(wrapper.props().canAddAffMktAccount).toBeFalsy();
    });

    it('should handle state with missing properties', () => {
        const incompleteState = {
            params: {
                Status: 'Approved'
                // Missing other properties
            },
            languageCodeList: {
                'en': 'English'
            }
            // Missing other state properties
        };
        store = mockStore(incompleteState);
        wrapper = shallow(<GridData store={store} />).dive();

        expect(wrapper.props().params.Status).toBe('Approved');
        expect(wrapper.props().languageCodeList).toEqual({ 'en': 'English' });
        expect(wrapper.props().targetCountryCodeList).toBeUndefined();
        expect(wrapper.props().pagingOption).toBeUndefined();
        expect(wrapper.props().canAddAffMktAccount).toBeUndefined();
    });

    it('should maintain component props when state updates', () => {
        const initialProps = wrapper.props();
        
        // Verify initial props exist
        expect(initialProps.params).toBeDefined();
        expect(initialProps.languageCodeList).toBeDefined();
        expect(initialProps.targetCountryCodeList).toBeDefined();
        expect(initialProps.pagingOption).toBeDefined();
        expect(initialProps.canAddAffMktAccount).toBeDefined();

        // Functions should be properly bound
        expect(typeof initialProps.toggleLoader).toBe('function');
        expect(typeof initialProps.fetchMarketingAccounts).toBe('function');
        expect(typeof initialProps.setPagingOption).toBe('function');
    });

    it('should pass handleAddNewAccount prop from parent', () => {
        const handleAddNewAccount = jest.fn();
        wrapper = shallow(
            <GridData 
                store={store} 
                handleAddNewAccount={handleAddNewAccount}
            />
        ).dive();

        expect(wrapper.props().handleAddNewAccount).toBe(handleAddNewAccount);
    });
}); 