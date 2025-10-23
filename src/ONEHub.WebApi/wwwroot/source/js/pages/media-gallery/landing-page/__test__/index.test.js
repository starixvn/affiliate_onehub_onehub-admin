import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';

jest.mock('react-dom', () => ({ render: jest.fn() }))

describe('landing page list - App', () => {
    it('Should render correctly', () => {
        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    });
})