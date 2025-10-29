import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';

jest.mock('react-dom', () => ({ render: jest.fn() }))

describe('payment request - App', () => {
    beforeEach(() => {
        window.initialState = {
            commGroupList: [
                {
                    DeductedPercentage: 0.17,
                    DeductionId: 10,
                    DeductionName: "Platform Fee"
                },
                {
                    DeductedPercentage: 0.07,
                    DeductionId: 11,
                    DeductionName: "Operational Fee"
                },
                {
                    DeductedPercentage: 0.02,
                    DeductionId: 12,
                    DeductionName: "Banking Fee"
                }
            ],
            poductList: [
                {
                    ProductId: 1,
                    ProductName: "Sportsbook"
                },
                {
                    ProductId: 2,
                    ProductName: "Playtech Casino"
                },
                {
                    ProductId: 2,
                    ProductName: "Number Game"
                }
            ],
            affInfo: {
                AffId: 1271808,
                AffType: 3,
                Email: "hubert.duong@nexcel.vn",
                FirstName: "bb",
                GroupId: 1271808,
                MailOption: false,
                PlayerUsername: "bettingexp",
                PreferredLanguage: "en-US",
                UserName: "12BETAFF226"
            }
        }
    });

    it('Should render correctly', () => {
        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    });
})