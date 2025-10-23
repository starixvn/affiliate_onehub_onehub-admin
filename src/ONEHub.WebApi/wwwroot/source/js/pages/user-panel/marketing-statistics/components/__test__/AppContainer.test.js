import React from 'react';
import { shallow } from 'enzyme';
import UserPanelSubMenu from '../../../../common/components/UserPanelSubMenu';
import Filter from '../Filter';
import Content from '../Content';
import { AppContainer } from '../AppContainer';

describe('marketing statistics - components - AppContainer', () => {
    const defaultProps = {
        languageList: [],
        setSelectedUserPanel: jest.fn(),
        setLanguageCodeList: jest.fn()
    };

    it('render correctly', () => {
        const result = shallow(<AppContainer {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('should render UserPanelSubMenu with correct props', () => {
        const wrapper = shallow(<AppContainer {...defaultProps} />);
        const subMenu = wrapper.find(UserPanelSubMenu);

        expect(subMenu).toHaveLength(1);
        expect(subMenu.props().subMenuList).toHaveLength(3);
        expect(subMenu.props().subMenuList[2].title).toBe('Channels');
        expect(subMenu.props().subMenuList[2].isActive).toBe(true);
    });

    it('should render Filter and Content components', () => {
        const wrapper = shallow(<AppContainer {...defaultProps} />);

        expect(wrapper.find(Filter)).toHaveLength(1);
        expect(wrapper.find(Content)).toHaveLength(1);
    });
});
