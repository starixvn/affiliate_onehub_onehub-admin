import React from 'react';
import ApprovedStatusInfo from '../../ApprovedStatusInfo';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('left panel - ApprovedStatusInfo - connect', () => {
    let wrapper;
    let store;

    beforeEach(() => {
        const initialState = {
            leftPanel: {
                affiliateInfo: {}
            },
            claimsPrincipal: { hasReadClaim: jest.fn(() => true) },
            affCommonInfo: { affName: '12BETAFF226' }
        };
        store = mockStore(initialState);
        wrapper = shallow(<ApprovedStatusInfo store={store} />).dive();
    });

    it('should show correct value', () => {
        const { affiliateInfo, affName } = wrapper.props();
        expect(affName).toEqual('12BETAFF226');
        expect(affiliateInfo).toEqual({});
    });
})