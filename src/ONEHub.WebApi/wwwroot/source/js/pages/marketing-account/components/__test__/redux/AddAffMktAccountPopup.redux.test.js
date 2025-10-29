import React from 'react';
import AddAffMktAccountPopup from '../../AddAffMktAccountPopup';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('marketing-account - AddAffMktAccountPopup - connect', () => {
    let wrapper, store;

    beforeEach(() => {
        const initialState = {
            aff: {
                affId: 12345,
                affName: 'TestAffiliate'
            },
            isShowAddAffMktAccountPopup: true,
            params: {
                Status: 'Approved',
                PageIndex: 1,
                PageSize: 20,
                Language: 'en'
            }
        };
        store = mockStore(initialState);
        wrapper = shallow(<AddAffMktAccountPopup store={store} />).dive();
    });

    it('should show correct value for aff', () => {
        expect(wrapper.props().aff).toEqual({
            affId: 12345,
            affName: 'TestAffiliate'
        });
    });

    it('should show correct value for isShowAddAffMktAccountPopup', () => {
        expect(wrapper.props().isShowAddAffMktAccountPopup).toBeTruthy();
    });

    it('should show correct value for params', () => {
        expect(wrapper.props().params).toEqual({
            Status: 'Approved',
            PageIndex: 1,
            PageSize: 20,
            Language: 'en'
        });
    });

    it('should map dispatch functions correctly', () => {
        expect(typeof wrapper.props().toggleLoader).toBe('function');
        expect(typeof wrapper.props().getMarketingAccountInfo).toBe('function');
        expect(typeof wrapper.props().getPaymentMethod).toBe('function');
        expect(typeof wrapper.props().setIsShowAddAffMktAccountPopup).toBe('function');
        expect(typeof wrapper.props().setParam).toBe('function');
    });

    it('should handle different state values', () => {
        const newState = {
            aff: {
                affId: 67890,
                affName: 'AnotherAffiliate'
            },
            isShowAddAffMktAccountPopup: false,
            params: {
                Status: 'Suspended',
                PageIndex: 2,
                PageSize: 50
            }
        };
        store = mockStore(newState);
        wrapper = shallow(<AddAffMktAccountPopup store={store} />).dive();

        expect(wrapper.props().aff).toEqual({
            affId: 67890,
            affName: 'AnotherAffiliate'
        });
        expect(wrapper.props().isShowAddAffMktAccountPopup).toBeFalsy();
        expect(wrapper.props().params.Status).toBe('Suspended');
        expect(wrapper.props().params.PageIndex).toBe(2);
        expect(wrapper.props().params.PageSize).toBe(50);
    });

    it('should handle empty aff object', () => {
        const stateWithEmptyAff = {
            aff: {
                affId: '',
                affName: ''
            },
            isShowAddAffMktAccountPopup: false,
            params: {}
        };
        store = mockStore(stateWithEmptyAff);
        wrapper = shallow(<AddAffMktAccountPopup store={store} />).dive();

        expect(wrapper.props().aff).toEqual({
            affId: '',
            affName: ''
        });
        expect(wrapper.props().isShowAddAffMktAccountPopup).toBeFalsy();
        expect(wrapper.props().params).toEqual({});
    });

    it('should handle null values', () => {
        const stateWithNulls = {
            aff: null,
            isShowAddAffMktAccountPopup: false,
            params: null
        };
        store = mockStore(stateWithNulls);
        wrapper = shallow(<AddAffMktAccountPopup store={store} />).dive();

        expect(wrapper.props().aff).toBeNull();
        expect(wrapper.props().isShowAddAffMktAccountPopup).toBeFalsy();
        expect(wrapper.props().params).toBeNull();
    });

    it('should handle state with missing properties', () => {
        const incompleteState = {
            aff: {
                affId: 123
                // Missing affName
            },
            isShowAddAffMktAccountPopup: true
            // Missing params
        };
        store = mockStore(incompleteState);
        wrapper = shallow(<AddAffMktAccountPopup store={store} />).dive();

        expect(wrapper.props().aff.affId).toBe(123);
        expect(wrapper.props().aff.affName).toBeUndefined();
        expect(wrapper.props().isShowAddAffMktAccountPopup).toBeTruthy();
        expect(wrapper.props().params).toBeUndefined();
    });

    it('should maintain component props when state updates', () => {
        const initialProps = wrapper.props();
        
        // Verify initial props exist
        expect(initialProps.aff).toBeDefined();
        expect(initialProps.isShowAddAffMktAccountPopup).toBeDefined();
        expect(initialProps.params).toBeDefined();

        // Functions should be properly bound
        expect(typeof initialProps.toggleLoader).toBe('function');
        expect(typeof initialProps.getMarketingAccountInfo).toBe('function');
        expect(typeof initialProps.getPaymentMethod).toBe('function');
        expect(typeof initialProps.setIsShowAddAffMktAccountPopup).toBe('function');
        expect(typeof initialProps.setParam).toBe('function');
    });

    it('should pass toggle prop from parent', () => {
        const toggle = jest.fn();
        wrapper = shallow(
            <AddAffMktAccountPopup 
                store={store} 
                toggle={toggle}
            />
        ).dive();

        expect(wrapper.props().toggle).toBe(toggle);
    });

    it('should handle complex aff object', () => {
        const complexState = {
            aff: {
                affId: 99999,
                affName: 'ComplexAffiliate',
                status: 'Active',
                category: 'Premium',
                registrationDate: '2023-01-01'
            },
            isShowAddAffMktAccountPopup: true,
            params: {
                Status: 'Approved',
                PageIndex: 1,
                PageSize: 20,
                Language: 'en',
                TargetCountryCode: 'US',
                SortType: 1
            }
        };
        store = mockStore(complexState);
        wrapper = shallow(<AddAffMktAccountPopup store={store} />).dive();

        expect(wrapper.props().aff.affId).toBe(99999);
        expect(wrapper.props().aff.affName).toBe('ComplexAffiliate');
        expect(wrapper.props().aff.status).toBe('Active');
        expect(wrapper.props().params.TargetCountryCode).toBe('US');
        expect(wrapper.props().params.SortType).toBe(1);
    });

    it('should handle boolean state changes correctly', () => {
        // Test initial true state
        expect(wrapper.props().isShowAddAffMktAccountPopup).toBeTruthy();

        // Test false state
        const falseState = {
            aff: { affId: 123, affName: 'Test' },
            isShowAddAffMktAccountPopup: false,
            params: {}
        };
        store = mockStore(falseState);
        wrapper = shallow(<AddAffMktAccountPopup store={store} />).dive();

        expect(wrapper.props().isShowAddAffMktAccountPopup).toBeFalsy();
    });

    it('should handle numeric affId values correctly', () => {
        const numericState = {
            aff: {
                affId: 0, // Test edge case of 0
                affName: 'ZeroAffiliate'
            },
            isShowAddAffMktAccountPopup: true,
            params: { PageIndex: 0, PageSize: 0 }
        };
        store = mockStore(numericState);
        wrapper = shallow(<AddAffMktAccountPopup store={store} />).dive();

        expect(wrapper.props().aff.affId).toBe(0);
        expect(wrapper.props().params.PageIndex).toBe(0);
        expect(wrapper.props().params.PageSize).toBe(0);
    });
}); 