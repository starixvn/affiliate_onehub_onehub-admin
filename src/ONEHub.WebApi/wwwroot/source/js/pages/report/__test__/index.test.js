import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';

jest.mock('react-dom', () => ({ render: jest.fn() }))

describe('report - App', () => {

    beforeEach(() => {
        window.globalVariables = {};
        window.initialState = {
            "[AffReport]":"[Write]"
        };
    })

    it('Should render correctly', () => {
        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    });
})