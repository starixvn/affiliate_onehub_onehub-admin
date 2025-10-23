import React from 'react';
import { Panel } from '../Panel';
import { shallow } from 'enzyme';

describe('home - components - Panel', () => {
    const defaultProps = {
        heading: "Affiliate Statistics",
        children: "<h3>Hello</h3>",
        className: "icon-hello"
    }
    it('render correctly', () => {
        const result = shallow(<Panel {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });
});