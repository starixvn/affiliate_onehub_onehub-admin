import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';

describe('player ggr report - App', () => {
    it('Should render correctly', () => {
        window.initialState = {
            today: '10/28/2021'
        }

        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    });
})