import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';

jest.mock('react-dom', () => ({ render: jest.fn() }))

describe('message - App', () => {

    it('Should render correctly', () => {
        window.initialState = {
            languageList: [
                {
                    ShortedLanguageCode: 'en',
                    LanguageName: 'English'
                }
            ],
            today: '10/28/2021'
        }

        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    });
})