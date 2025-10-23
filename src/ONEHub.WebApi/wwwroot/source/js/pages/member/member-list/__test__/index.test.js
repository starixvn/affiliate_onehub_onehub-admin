import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';

jest.mock('react-dom', () => ({ render: jest.fn() }))

describe('member list - App', () => {
    it('Should render correctly', () => {
        window.globalVariables = {};
        window.initialState = {};
        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    });
})