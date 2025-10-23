import React from 'react';
import { Content } from '../Content';
import { shallow, mount } from 'enzyme';

describe('landing page list - components - Content ', () => {
    const gridData = [
        {
            PageCode: "sportsbooks",
            PageId: 1,
            PageName: "Sportsbooks"
        },
        {
            PageCode: "numbergame",
            PageId: 22,
            PageName: "Number Game"
        }
    ];

    const defaultProps = {
        checkedLandingPages: { 1: false, 22: false },
        shouldResetScrollPosition: true,
        gridData
    };

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is null', () => {
        const props = Object.assign({}, defaultProps, { gridData: null })
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is empty', () => {
        const props = Object.assign({}, defaultProps, { gridData: [] })
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('setSelectedLandingPageId - should be called when click edit button', () => {
        const props = Object.assign({}, defaultProps, { setSelectedLandingPageId: jest.fn() })
        const result = mount(<Content {...props} />);

        result.find('Button').at(0).simulate('click');

        expect(props.setSelectedLandingPageId).toHaveBeenCalledWith(1);
    });

    it('_onCheckItem - should be called when click edit button', () => {
        const event = {
            target: {
                checked: true
            }
        };
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setCheckedLandingPages: jest.fn() })
        const result = mount(<Content {...props} />);

        result.find('input[type="checkbox"]').at(0).simulate('change', event);

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setCheckedLandingPages).toHaveBeenCalledWith({ 1: true, 22: false });
    });
})