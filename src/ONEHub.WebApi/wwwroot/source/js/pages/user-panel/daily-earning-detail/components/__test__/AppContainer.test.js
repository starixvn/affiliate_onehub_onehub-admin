import React from 'react';
import { AppContainer } from '../AppContainer';
import { shallow } from 'enzyme';
import UserPanelBreadcrumb from '../../../../common/components/UserPanelBreadcrumb';

describe('daily earning detail - components - AppContainer', () => {
    const productList = [
        {
            ProductId: 1,
            ProductName: 'Sportsbook'
        },
        {
            ProductId: 3,
            ProductName: 'Playtech Casino'
        },
        {
            ProductId: 4,
            ProductName: 'Number Game'
        }
    ]

    const baseCurrencyList = [
        {
            ExchangeId: 20,
            Code: 'UUS'
        }
    ]

    const currencyList = [
        {
            key: 20,
            name: 'UUS',
            checked: true
        }
    ]

    const defaultProps = {
        param: {
            affId: 1271808,
            monthDate: "06 January 2019",
            productId: 0,
            statementHistory: {}
        },
        redirectToStatementHistory: jest.fn(),
        productList,
        currencyList,
        baseCurrencyList
    }
    it('render correctly', () => {
        const result = shallow(<AppContainer {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with monthDate is null', () => {
        const props = Object.assign({}, defaultProps, { monthDate: null });
        const result = shallow(<AppContainer {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('setSelectedUserPanel - should be called', () => {
        const props = Object.assign({}, defaultProps, { setSelectedUserPanel: jest.fn() });
        const wrapper = shallow(<AppContainer {...props} />);

        wrapper.find(UserPanelBreadcrumb).props().breadcrumbList[0].handleClick();

        expect(props.redirectToStatementHistory).toHaveBeenCalledWith(defaultProps.param.statementHistory);
    });

    it('redirectToDailyEarning - should be called', () => {
        const props = Object.assign({}, defaultProps, { redirectToDailyEarning: jest.fn() });
        const wrapper = shallow(<AppContainer {...props} />);

        wrapper.find(UserPanelBreadcrumb).props().breadcrumbList[1].handleClick();

        expect(props.redirectToDailyEarning).toHaveBeenCalledWith(defaultProps.param);
    });
});