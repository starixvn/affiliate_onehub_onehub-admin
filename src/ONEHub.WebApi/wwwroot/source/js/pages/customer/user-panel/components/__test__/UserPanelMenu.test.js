import React from 'react';
import { UserPanelMenu } from '../UserPanelMenu';
import { shallow } from 'enzyme';

describe('customer - user-panel - components - UserPanelMenu', () => {
    const defaultProps = {
        selectedUserPanel: 'statementHistory',
        onClickMenu: jest.fn(),
        menuList: [
            {
                key: "statementHistory",
                name: "Statement History",
                parent: null
            },
            {
                key: "edit",
                name: "Edit",
                parent: null
            },
            {
                key: "dailyEarning",
                name: "",
                parent: "statementHistory"
            }
        ]
    }

    it('Should render correctly', () => {
        const wrapper = shallow(<UserPanelMenu {...defaultProps} />);

        expect(wrapper).toMatchSnapshot();
    });
})