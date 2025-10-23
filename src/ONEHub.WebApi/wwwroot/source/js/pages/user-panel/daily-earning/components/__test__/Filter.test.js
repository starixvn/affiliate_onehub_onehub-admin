import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';

describe('daily earning - components - Filter', () => {
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
            monthDate: "Jan-2019",
            productId: 0,
            baseCurrencyId: '',
            currencyIds: ''
        },
        setParam: jest.fn(),
        productList,
        currencyList,
        baseCurrencyList
    }

    it('render correctly', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        expect(wrapper).toMatchSnapshot();
    });

    it('render correctly with empty', async () => {
        const props = Object.assign({}, defaultProps, {
            productList: null,
            currencyList: null,
            baseCurrencyList: null
        })
        const wrapper = await shallow(<Filter {...props} />);

        expect(wrapper).toMatchSnapshot();
    });

    it('handleChangeProduct - should call setState and handleSetParam', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn((obj, func) => func && func());
        const instance = wrapper.instance();
        instance.handleSetParam = jest.fn();

        instance.handleChangeProduct(1);

        expect(wrapper.setState).toHaveBeenCalledWith({ selectedProduct: 1 }, expect.any(Function));
        expect(wrapper.instance().handleSetParam).toHaveBeenCalled();
    });

    it('handleChangeBaseCurrency - should call setState and handleSetParam', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn((obj, func) => func && func());
        const instance = wrapper.instance();
        instance.handleSetParam = jest.fn();

        instance.handleChangeBaseCurrency({ target: {value: '123'}});

        expect(wrapper.setState).toHaveBeenCalledWith({ selectedBaseCurrency: 123 }, expect.any(Function));
        expect(wrapper.instance().handleSetParam).toHaveBeenCalled();
    });

    it('handleChangeCurrency - should call setState and handleSetParam', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn((obj, func) => func && func());
        const instance = wrapper.instance();
        instance.handleSetParam = jest.fn();

        instance.handleChangeCurrency({}, '20');

        expect(wrapper.setState).toHaveBeenCalledWith({ currencyList, selectedCurrencyList: '20' }, expect.any(Function));
        expect(wrapper.instance().handleSetParam).toHaveBeenCalled();
    });

    it('handleSetParam - should be called when From change', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.instance().handleSetParam(1);

        expect(defaultProps.setParam).toHaveBeenCalledWith({ affId: 1271808, monthDate: "Jan-2019", productId: 0, baseCurrencyId: 20, currencyIds: '20' });
    });
});