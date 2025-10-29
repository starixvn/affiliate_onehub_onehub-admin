import React from 'react';
import { shallow } from 'enzyme';
import SettingPanel from '../../SettingPanel';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('left panel - SettingPanel - connect', () => {
    let wrapper, store;
    const leftPanel = { affiliateInfo: { AffId: 1271808 }, affName: '12BETAFF226', affTypeList: [{ Asian: 1 }] }

    beforeAll(() => {
        const initialState = {
            leftPanel
        }

        store = mockStore(initialState);
        wrapper = shallow(<SettingPanel store={store} />).dive()
    });

    it('should map correct state', () => {
        const { affiliateInfo, affName, affTypeList } = wrapper.props();

        expect(affiliateInfo).toEqual(leftPanel.affiliateInfo);
        expect(affName).toEqual(leftPanel.affName);
        expect(affTypeList).toEqual(leftPanel.affTypeList);
    })
})