import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';
import ReportExcel from '../../modules/reportExcel';
jest.mock('../../modules/reportExcel');

describe('players detail - components - Filter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const today = '12/26/2019';
    const affId = 1271808;
    const productList = [
        { ProductId: 1, ProductName: "Sportsbook" },
        { ProductId: 4, ProductName: "Number Game" }
    ];
    const setParam = jest.fn();
    const baseCurrencyList = [
        {
            ExchangeId: 20,
            Code: 'VND'
        }
    ]

    const currencyList = [
        {
            key: 20,
            name: 'UUS',
            checked: true
        }
    ]
    const param = {
        productId: 0,
        monthDate: "11/26/2019",
        isClickLink: false,
    };
    const defaultProps = {
        today,
        param,
        affId,
        setParam,
        sortingColumn: {
            IsSortAsc: false,
            ColumnName: 'Turnover'
        },
        setSortingColumn: jest.fn(),
        productList,
        currencyList,
        baseCurrencyList,
        isDepositFeePercent: true,
        isWithdrawalFeePercent: true
    };

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
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

    it('handleSelectMonth - should call setState', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance.handleSelectMonth(12, 2019);

        expect(instance.setState).toHaveBeenCalledWith({ monthDate: new Date(2019, 11) });
    });

    it('handleChangeProduct - should call setState', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance.handleChangeProduct(1);

        expect(instance.setState).toHaveBeenCalledWith({ selectedProduct: 1 });
    });

    it('handleChangeBaseCurrency - should call setState', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance.handleChangeBaseCurrency({ target: { value: 1 } });

        expect(instance.setState).toHaveBeenCalledWith({ selectedBaseCurrency: 1 });
    });

    it('handleChangeCurrency - should call setState', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance.handleChangeCurrency(null, '20');

        expect(instance.setState).toHaveBeenCalledWith({ selectedCurrencyList: '20', currencyList });
    });

    it('handleFormatMonthPicker - should return correctly', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        const result = wrapper.instance().handleFormatMonthPicker(12, 2019);

        expect(result).toEqual('Dec-2019');
    });

    it('handleSearch - should be called when click Search Button', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ productList });

        wrapper.find('Button').at(0).simulate('click');

        expect(defaultProps.setParam).toHaveBeenCalledWith({ baseCurrencyId: 20, currencyIds: '20', "monthDate": "12/1/2019", "productId": 0, "isIncludeRemovedPlayer": false });
    });

    it('handleExportExcel - should call exportExcel', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() })
        const wrapper = shallow(<Filter {...props} />);

        await wrapper.instance().handleExportExcel();

        expect(props.fetchData).toHaveBeenCalledWith({ "IsExportExcel": true, "affId": 1271808, baseCurrencyId: 20, currencyIds: '20', "isSortAsc": false, "monthDate": "12/1/2019", "productId": 0, "sortById": 5, "isIncludeRemovedPlayer": false });
    });

    it('handleExportExcel - should call exportExcel, _getReportTitle and ReportExcel', async () => {
        const expectedResponse = { data: ['data 1', 'data 2'] };
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn(() => expectedResponse.data) })
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance._getReportTitle = jest.fn(() => "ABC");

        await instance.handleExportExcel();

        expect(props.fetchData).toHaveBeenCalledWith({ "IsExportExcel": true, "affId": 1271808, baseCurrencyId: 20, currencyIds: '20', "isSortAsc": false, "monthDate": "12/1/2019", "productId": 0, "sortById": 5, "isIncludeRemovedPlayer": false });
        expect(ReportExcel).toHaveBeenCalledWith(expectedResponse.data, "ABC", true, true);
    });

    it('_getReportTitle - should call handleFormatMonthPicker', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState({ currencies: [{ Code: 'VND', ExchangeId: 0 }] });
        instance.handleFormatMonthPicker = jest.fn(() => "ABC");

        const result = instance._getReportTitle();

        expect(result).toEqual("Player Detail - Base Currency VND - All Products - ABC");
        expect(instance.handleFormatMonthPicker).toHaveBeenCalled();
    });

    it('_getReportTitle - should call _getSelectedProductName and handleFormatMonthPicker', () => {
        const props = Object.assign({}, defaultProps, { baseCurrencyList: null });
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.setState({ selectedProduct: 1, currencies: [{ Code: 'VND', ExchangeId: 0 }] });
        instance._getSelectedProductName = jest.fn(() => "Sportsbook");
        instance.handleFormatMonthPicker = jest.fn(() => "ABC");

        const result = instance._getReportTitle();

        expect(result).toEqual("Player Detail - Sportsbook - ABC");
        expect(instance.handleFormatMonthPicker).toHaveBeenCalled();
    });

    it('_getSelectedProductName - should return correctly', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ productList });

        const result = wrapper.instance()._getSelectedProductName(1);

        expect(result).toEqual("Sportsbook");
    });

    it('_getSelectedProductName - should return empty', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ productList });

        const result = wrapper.instance()._getSelectedProductName(2);

        expect(result).toEqual("");
    });
});