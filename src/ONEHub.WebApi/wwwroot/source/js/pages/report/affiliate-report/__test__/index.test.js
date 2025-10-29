import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';

describe('aff report - App', () => {

    it('Should render correctly', () => {
        window.initialState = {
            languageList: [
                {
                    LanguageCode: 'en-US',
                    LanguageName: 'English'
                }
            ],
            productList: [
                {
                    ProductId: 123,
                    ProductName: 'Test'
                }
            ],
            currencyList: [
                {
                    ExchangeId: 123,
                    Code: 'USD'
                }
            ],
            paymentCurrencyList: [
                {
                    ExchangeId: 123,
                    Code: 'USD'
                }
            ],
            commGroupList: [
                {
                    Id: 123,
                    Name: 'Test'
                }
            ],
            baseCurrencyList: [],
            isProduction: false,
            today: '10/28/2021'
        }

        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    });
})