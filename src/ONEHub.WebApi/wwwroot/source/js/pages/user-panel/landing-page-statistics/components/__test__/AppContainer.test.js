import React from 'react';
import { AppContainer } from '../AppContainer';
import { shallow } from 'enzyme';
import UserPanelSubMenu from '../../../../common/components/UserPanelSubMenu';

describe('landing page statistics - components - AppContainer', () => {
    it('render correctly', () => {
        const result = shallow(<AppContainer />);

        expect(result).toMatchSnapshot();
    });

    it('setSelectedUserPanel - should be called with clickStatistics', () => {
        const props = Object.assign({}, { setSelectedUserPanel: jest.fn() });
        const wrapper = shallow(<AppContainer {...props} />);

        wrapper.find(UserPanelSubMenu).props().subMenuList[0].handleClick();

        expect(props.setSelectedUserPanel).toHaveBeenCalledWith('clickStatistics');
    });

    it('setSelectedUserPanel - should be called with landingPageStatistics', () => {
        const props = Object.assign({}, { setSelectedUserPanel: jest.fn() });
        const wrapper = shallow(<AppContainer {...props} />);

        wrapper.find(UserPanelSubMenu).props().subMenuList[1].handleClick();

        expect(props.setSelectedUserPanel).toHaveBeenCalledWith('landingPageStatistics');
    });
});