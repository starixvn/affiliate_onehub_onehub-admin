import React from 'react';
import Content from '../../Content';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { TOGGLE_LOADER } from '../../../../../actions/actiontypes';

const mockStore = configureMockStore();

describe('Affiliate Info - components - Content - connect', () => {
    let wrapper, store;

    beforeEach(() => {
        const initialState = {
            reportTitle: '',
            param: {},
            languageList: {},
            columnList: {}
        };
        store = mockStore(initialState);
        wrapper = shallow(<Content store={store} />).dive();
    });

    it('should show correct value', () => {
        const { reportTitle, param, languageList, columnList} = wrapper.props();
        expect(reportTitle).toEqual('');
        expect(param).toEqual({});
        expect(languageList).toEqual({});
        expect(columnList).toEqual({});
    });

    it('should call correct action', () => {
        wrapper.props().toggleLoader(true);

        const actions = store.getActions();
        expect(actions).toEqual([{ type: TOGGLE_LOADER, data: true }]);
    });
})