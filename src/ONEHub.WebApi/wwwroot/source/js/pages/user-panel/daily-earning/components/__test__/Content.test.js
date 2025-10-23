import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';

describe('customer member - components - Content', () => {
    const param = {
        affId: 1271808,
        monthDate: "08 January 2019",
        productId: 0
    };

    const defaultProps = {
        param
    };

    const gridData = [
        {
            BankingFee: 0,
            Bonus: 0,
            Date: "06 January 2019",
            Deposit: 0,
            Ggr: -536.0837,
            WinlostDate: "2019-01-06T00:00:00",
            Withdrawal: 0
        },
        {
            BankingFee: 0,
            Bonus: 0,
            Date: "07 January 2019",
            Deposit: 0,
            Ggr: -1495.1505,
            WinlostDate: "2019-01-07T00:00:00",
            Withdrawal: 0
        }
    ];

    const total = {
        BankingFee: 0,
        Bonus: 0,
        Deposit: 0,
        Ggr: -2031.2342,
        WinlostDate: null,
        Withdrawal: 0
    };

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.instance().setState({ gridData, total, isSelectedAllProducts: false });

        expect(result).toMatchSnapshot();
    });

    it('redirectToDailyEarningDetail - should be called', () => {
        const props = Object.assign({}, defaultProps, { redirectToDailyEarningDetail: jest.fn() });
        const wrapper = shallow(<Content {...props} />);

        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData, 'text-right highlight')}</div>);

        dataRow.find('Button').at(0).simulate('click')
        expect(props.redirectToDailyEarningDetail).toHaveBeenCalledWith({ affId: 1271808, monthDate: "06 January 2019", productId: 0 });
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const componentInstance = new Content(defaultProps);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate({ productId: 1 });

        expect(componentInstance.fetchData).toHaveBeenCalledWith(param);
    });

    it('fetchData - should call toggleLoaderUserPanel and setState with correct parameter', async () => {
        const data = { MainData: gridData, Total: total };

        const toggleLoaderUserPanel = jest.fn();
        const fetchData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, fetchData });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData, total, isSelectedAllProducts: true });
    });

    it('fetchData - should call toggleLoaderUserPanel and setState with incorrect parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const fetchData = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, fetchData });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: null, total: 0, isSelectedAllProducts: true });
    });
});