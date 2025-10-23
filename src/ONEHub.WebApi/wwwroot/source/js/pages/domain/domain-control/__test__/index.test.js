import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';

jest.mock('react-dom', () => ({ render: jest.fn() }))

describe('domain control - App', () => {
    it('Should render correctly', () => {
        window.initialState = {
            targetCountryList: [
                {
                    TargetCountryCode: "en-GB",
                    TargetCountryName: "English (Euro)"
                },
                {
                    TargetCountryCode: "vi-VN",
                    TargetCountryName: "VietNamese"
                }
            ],
            affSubDomainList: [
                {
                    columnKey: "test",
                    columnName: "test",
                    checked: true
                }
            ]
        };

        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    });
})