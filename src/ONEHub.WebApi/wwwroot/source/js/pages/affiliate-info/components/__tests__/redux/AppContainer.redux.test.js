import React from 'react';
import AppContainer from '../../AppContainer';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { SET_SHOW_POPUP_COMMGROUP } from '../../../actions/types';

const mockStore = configureMockStore();

describe('Affiliate Info - components - AppContainer - connect', () => {
    let wrapper, store;

    beforeEach(() => {
        const initialState = {
            isShowLoader: true
        };
        store = mockStore(initialState);
        wrapper = shallow(<AppContainer store={store} />).dive();
    });

    it('should show correct value', () => {
        expect(wrapper.props().isShowLoader).toBeTruthy();
    });

    it('should call correct action', () => {
        wrapper.props().setShowPopupCommGroup(true);

        const actions = store.getActions();
        expect(actions).toEqual([{ type: SET_SHOW_POPUP_COMMGROUP, data: true }]);
    });
})