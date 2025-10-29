import React from 'react';
import { withUserPanel } from '../../withUserPanel';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store'
import { RESET_USER_PANEL } from '../../../actions/types';

const mockStore = configureMockStore()

describe('user panel - withUserPanel - connect', () => {
    let wrapper, store

    beforeEach(() => {
        const Test = () => (<h1>Test</h1>)
        const Item = withUserPanel(<Test />, 'test');

        const initialState = {
            resetUserPanel: jest.fn()
        }
        store = mockStore(initialState)
        wrapper = shallow(<Item store={store} />).dive()
    })

    it('should show correct value', () => {
        expect(wrapper.props().name).toEqual('test')
    })

    it('should call correct action', () => {
        wrapper.props().resetUserPanel('abc')

        const actions = store.getActions();
        expect(actions).toEqual([{ type: RESET_USER_PANEL, data: 'abc' }])
    })
});