import React from 'react';
import AppContainer from '../AppContainer';
import { shallow } from 'enzyme';

describe('customer member - components - AppContainer', () => {
    it('render correctly', () => {
        const result = shallow(<AppContainer />);

        expect(result).toMatchSnapshot();
    });
});