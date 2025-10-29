import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import TransferBalanceForPlayerSettingPopup from '../../TransferBalanceForPlayerSettingPopup'

describe('left panel - TransferBalanceForPlayerSettingPopup component - connect - ', () => {
    it('should mapping to props correctly', () => {
        const initialState = {
            noMapping: ''
        }

        const mockStore = configureMockStore();
        const wrapper = shallow(<TransferBalanceForPlayerSettingPopup store={mockStore(initialState)} />).dive()

        const { noMapping } = wrapper.props();

        expect(noMapping).toBeUndefined();
    })
})