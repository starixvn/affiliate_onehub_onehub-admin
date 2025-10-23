import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';

describe('daily earning - components - Filter', () => {
    const baseCurrencyList = [
        {
            ExchangeId: 20,
            Code: 'UUS'
        }
    ]

    const defaultProps = {
        param: {
            affId: 1271808,
            monthDate: "May-2020"
        },
        setParam: jest.fn(),
        baseCurrencyList
    }

    it('render correctly', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        expect(wrapper).toMatchSnapshot();
    });

    it('render correctly with empty', async () => {
        const props = Object.assign({}, defaultProps, { baseCurrencyList: null });
        const wrapper = await shallow(<Filter {...props} />);

        expect(wrapper).toMatchSnapshot();
    });

    it('handleChangeBaseCurrency - should call setState and handleSetParam when change base currency select', () => {
        const event = {
            target: {
                value: 1
            }
        }
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn((obj, func) => func && func());
        wrapper.instance().handleSetParam = jest.fn();

        wrapper.find('Input[type="select"][name="BaseCurrency"][id="BaseCurrency"]').simulate('change', event)

        expect(wrapper.setState).toHaveBeenCalledWith({ selectedBaseCurrency: 1 }, expect.any(Function));
        expect(wrapper.instance().handleSetParam).toHaveBeenCalled();
    });

    it('handleSetParam - should be called when From change', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.instance().handleSetParam(1);

        expect(defaultProps.setParam).toHaveBeenCalledWith({ affId: 1271808, monthDate: "May-2020", currencyId: 20 });
    });
});