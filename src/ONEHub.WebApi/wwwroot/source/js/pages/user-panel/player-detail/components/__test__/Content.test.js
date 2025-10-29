import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../modules/constants';

describe('players detail - components - Content', () => {
    const param = { productId: 0, monthDate: "11/1/2019" };
    const gridData = [
        {
            IbcUserName: "12BETUS$02002",
            UserName: "12BET$RyQ.Piong",
            RegisteredDate: "2009-01-21T21:13:00",
            Deposit: 0,
            Withdrawal: 0,
            DepositFee: 0,
            WithdrawalFee: 0,
            Bonus: 0,
            Turnover: 5367360,
            Ggr: -26050,
            RegisteredDateText: "01/21/2009 21:13:00"
        },
        {
            IbcUserName: "12BETRM021133",
            UserName: "12BET$all_in",
            RegisteredDate: "2013-03-07T00:30:00",
            Deposit: 0,
            Withdrawal: 0,
            DepositFee: 0,
            WithdrawalFee: 0,
            Bonus: 0,
            Turnover: 23.7056,
            Ggr: -11.9332,
            RegisteredDateText: "03/07/2013 00:30:00"
        }
    ];
    const defaultProps = {
        affId: 1271808,
        isDepositFeePercent: false,
        isWithdrawalFeePercent: false,
        pagingOption: defaultPagingOption,
        param,
        setPagingOption: jest.fn(),
        toggleLoaderUserPanel: jest.fn(),
        fetchData: jest.fn(() => gridData),
        sortingColumn: {
            IsSortAsc: false,
            ColumnName: 'Turnover'
        }
    }

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.setState({ data: gridData });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with not selected All Product', () => {
        const newParam = Object.assign({}, defaultProps.param, { productId: 1 });
        const props = Object.assign({}, defaultProps, { param: newParam, isDepositFeePercent: true, isWithdrawalFeePercent: true });
        const result = shallow(<Content {...props} />);

        result.setState({ data: gridData });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data is empty', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.setState({ data: [] });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const newParam = Object.assign({}, defaultProps.param, { monthDate: "12/1/2019" });
        const props = Object.assign({}, defaultProps, { param: newParam });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance._fetchData = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(instance._fetchData).toHaveBeenCalledWith({ ...newParam, pageIndex: 1, pageSize: 20 });
    });

    it('componentDidUpdate - should call fetchData and setState if param change isClickLink is true', () => {
        const newParam = Object.assign({}, defaultProps.param, { isClickLink: true });
        const props = Object.assign({}, defaultProps, { param: newParam });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();
        instance._fetchData = jest.fn();
        instance.componentDidUpdate(defaultProps);

        expect(instance._fetchData).toHaveBeenCalledWith({ ...newParam, pageIndex: 1, pageSize: 20 });
        expect(instance.setState).toHaveBeenCalledWith({ isSortAsc: false, sortingColumn: 'Turnover' });
    });

    it('fetchData - should call toggleLoaderUserPanel, setState and setPagingOption with correct parameter', async () => {
        const data = { MainData: gridData, TotalItem: 2 };

        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchData });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { pageIndex: 1, pageSize: 20 });
        await instance._fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith({ ...param, affId: 1271808 });
        expect(instance.setState).toHaveBeenCalledWith({ data: gridData });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 2, PageIndex: 1, PageSize: 20 });
    });

    it('fetchData - should call toggleLoaderUserPanel, setState and setPagingOption with incorrect parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchData = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchData });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { pageIndex: 1, pageSize: 20 });
        await instance._fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith({ ...param, affId: 1271808 });
        expect(instance.setState).toHaveBeenCalledWith({ data: null });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 0, PageIndex: 1, PageSize: 20 });
    });

    it('handleClickHeader - should call setState and _fetchData when sortingColumn === selectedColumn', async () => {
        const props = Object.assign({}, defaultProps, { setSortingColumn: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance._fetchData = jest.fn();

        instance.handleClickHeader('Turnover');

        expect(instance._fetchData).toHaveBeenCalledWith({ ...param, isSortAsc: true, sortById: 5, pageIndex: 1, pageSize: 20 });
        expect(props.setSortingColumn).toHaveBeenCalledWith({ IsSortAsc: true, ColumnName: 'Turnover' });
    });

    it('handleClickHeader - should call setState and _fetchData when sortingColumn !== selectedColumn', async () => {
        const props = Object.assign({}, defaultProps, { setSortingColumn: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance._fetchData = jest.fn();

        instance.handleClickHeader('Username');

        expect(instance._fetchData).toHaveBeenCalledWith({ ...param, isSortAsc: false, sortById: 1, pageIndex: 1, pageSize: 20 });
        expect(props.setSortingColumn).toHaveBeenCalledWith({ IsSortAsc: false, ColumnName: 'Username' });
    });

    it('handlePaging - should call fetchData with correct parameters', () => {
        const setPagingOption = jest.fn();
        const pageIndex = 2;
        const pageSize = 50;
        const paramExpect = Object.assign({}, defaultProps.param, { pageIndex, pageSize, isSortAsc: false, sortById: 5 });

        const props = Object.assign({}, defaultProps, { setPagingOption });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance._fetchData = jest.fn();

        instance.handlePaging(pageIndex, pageSize);

        expect(instance._fetchData).toHaveBeenCalledWith(paramExpect);
    });
});