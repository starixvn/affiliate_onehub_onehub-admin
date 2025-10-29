import React from 'react'
import AppContainer from '../../AppContainer'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { SET_SELECTED_USERPANEL } from '../../../../user-panel/actions/types'

const mockStore = configureMockStore()

describe('customer - main page - AppContainer - connect', () => {
    let wrapper, store;

    it('should show correct value', () => {
        const initialState = {
            selectedUserPanel: "Statement History"
        };
        store = mockStore(initialState);
        wrapper = shallow(<AppContainer store={store} />).dive();

        const { selectedUserPanel, affId, status } = wrapper.props();
        expect(selectedUserPanel).toEqual("Statement History");
        expect(affId).toBeNull();
        expect(status).toBeNull();
    });

    it('should call correct action', () => {
        const initialState = {
            selectedUserPanel: "Statement History",
            affCommonInfo: {
                affId: 123,
                status: 'abc'
            }
        };
        store = mockStore(initialState);
        wrapper = shallow(<AppContainer store={store} />).dive();

        wrapper.props().setSelectedUserPanel("ABC");

        const actions = store.getActions();
        expect(actions).toEqual([{ type: SET_SELECTED_USERPANEL, data: "ABC" }]);

        const { selectedUserPanel, affId, status } = wrapper.props();
        expect(selectedUserPanel).toEqual("Statement History");
        expect(affId).toBe(123);
        expect(status).toEqual('abc');
    });
})