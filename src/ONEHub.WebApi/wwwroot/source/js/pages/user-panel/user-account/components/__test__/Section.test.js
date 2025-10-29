import React from 'react';
import Section from '../Section';
import { shallow } from 'enzyme';

describe('user account - components - Section', () => {
    it('render correctly', () => {
        const props = {
            title: "Payment Information",
            children: '<h3>Payment Information</h3>',
            name: "Payment Information"
        }
        const result = shallow(<Section {...props} />);

        expect(result).toMatchSnapshot();
    });
});