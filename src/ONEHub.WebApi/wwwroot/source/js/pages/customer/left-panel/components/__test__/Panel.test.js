import React from 'react';
import { Panel } from '../Panel';
import { shallow } from 'enzyme';

describe('left panel - components - Panel', () => {
    it('render correctly', () => {
        const props = {
            heading: 'heading',
            children: 'children',
            style: { color: 'red' },
            attributes: { id: 'panel' }
        }

        const result = shallow(<Panel {...props} />);

        expect(result).toMatchSnapshot();
    });
});