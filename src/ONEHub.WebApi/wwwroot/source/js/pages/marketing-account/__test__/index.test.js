import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';

jest.mock('react-dom', () => ({ render: jest.fn() }))

describe('marketing-account - App', () => {
    it('Should render correctly', () => {
        window.globalVariables = {};
        window.initialState = {
            languageList: [
                {
                    LanguageCode: 'en',
                    LanguageName: 'English'
                }
            ],
            targetCountryList: [
                {
                    TargetCountryCode: 'US',
                    TargetCountryName: 'United States'
                }
            ],
            dealList: [
                {
                    GroupId: '1',
                    GroupName: 'Standard'
                }
            ]
        }

        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    });
}) 