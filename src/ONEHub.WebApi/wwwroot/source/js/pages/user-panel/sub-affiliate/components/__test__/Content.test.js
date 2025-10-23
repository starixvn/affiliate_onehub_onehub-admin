import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../modules/constants';

describe('customer member - components - Content', () => {
    const param = {
        affId: 1271808,
        monthDate: "18 May 2020"
    };

    const defaultProps = {
        param,
        pagingOption: defaultPagingOption
    };

    const gridData = [
        {
            AffId: 123,
            AffName: "12BETAFF003",
            Commission: 123,
            SubAffiliateEarning: 123
        },
        {
            AffId: 234,
            AffName: "12BETAFF004",
            Commission: 234,
            SubAffiliateEarning: 234
        }
    ];

    const total = {
        AffId: 0,
        AffName: "",
        Commission: 357,
        SubAffiliateEarning: 357
    };

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data', () => {
        const pagingOption = Object.assign({}, defaultProps.pagingOption, { TotalItem: 2 });
        const props = Object.assign({}, defaultProps, { pagingOption });
        const result = shallow(<Content {...props} />);

        result.instance().setState({ gridData, total });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const componentInstance = new Content(defaultProps);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate({ productId: 1 });

        expect(componentInstance.fetchData).toHaveBeenCalledWith({ ...param, pageIndex: 1, pageSize: 20 });
    });

    it('fetchData - should call toggleLoaderUserPanel and setState with correct parameter', async () => {
        const data = { MainData: gridData, Total: total, TotalItem: 2 };

        const toggleLoaderUserPanel = jest.fn();
        const fetchData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, fetchData, setPagingOption: jest.fn() });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData, total });
    });

    it('fetchData - should call toggleLoaderUserPanel and setState with incorrect parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const fetchData = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, fetchData, setPagingOption: jest.fn() });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: null, total: 0 });
    });

    it('handlePaging - should call fetchData with correct parameters', () => {
        const setPagingOption = jest.fn();
        const pageIndex = 2;
        const pageSize = 50;
        const paramExpect = Object.assign({}, defaultProps.param, { pageIndex, pageSize });

        const props = Object.assign({}, defaultProps, { setPagingOption });
        const componentInstance = new Content(props);
        componentInstance.fetchData = jest.fn();

        componentInstance.handlePaging(pageIndex, pageSize);

        expect(componentInstance.fetchData).toHaveBeenCalledWith(paramExpect);
    });
});