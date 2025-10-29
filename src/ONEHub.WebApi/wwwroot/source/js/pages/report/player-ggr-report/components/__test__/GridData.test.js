import React from 'react';
import { shallow } from 'enzyme';
import { GridData } from '../GridData';

describe('player ggr report - GridData ', () => {
    const param = {
        PageIndex: 1,
        PageSize: 20
    };

    const productList = [
        { key: 1, name: "Sportsbook", checked: true },
        { key: 2, name: "Abc", checked: false }
    ]

    const defaultProps = {
        pagingOption: {
            PageIndex: 1,
            PageSize: 20,
            TotalItem: 0,
            PageList: [10, 20, 50, 100, 500]
        },
        param: {},
        productList
    };

    it('componentDidUpdate - should call fetchData when param changed', () => {
        const props = Object.assign({}, defaultProps, { param, setPagingOption: jest.fn() });
        const componentInstance = new GridData(props);
        componentInstance.fetchData = jest.fn();

        componentInstance.componentDidUpdate(defaultProps);

        expect(componentInstance.fetchData).toHaveBeenCalledWith(param);
    });

    it('fetchData - should call fetchData successfully', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), setPagingOption: jest.fn(), fetchData: jest.fn(() => ({ MainData: [], Total: null, TotalItem: 0 })) });
        const componentInstance = new GridData(props);
        componentInstance.setState = jest.fn();

        await componentInstance.fetchData(param);

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: [], total: null });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 0, PageIndex: param.PageIndex, PageSize: param.PageSize });
        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
    });

    it('fetchData - should call fetchData with an error', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), setPagingOption: jest.fn(), fetchData: jest.fn() });
        const componentInstance = new GridData(props);
        componentInstance.setState = jest.fn();

        await componentInstance.fetchData(param);

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).not.toHaveBeenCalled();
        expect(props.setPagingOption).not.toHaveBeenCalled();
        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
    });

    it('handlePaging - should call fetchData with correct parameters', () => {
        const index = 1;
        const size = 20;
        const newPaging = {
            PageIndex: index,
            PageSize: size
        };
        const paramExpect = Object.assign({}, defaultProps.param, newPaging);

        const componentInstance = new GridData(defaultProps);
        componentInstance.fetchData = jest.fn();

        componentInstance.handlePaging(index, size);

        expect(componentInstance.fetchData).toHaveBeenCalledWith(paramExpect);
    });

    it('_resetScroll - should reset scroll', () => {
        const expectCurrent = {
            scrollTop: 0,
            scrollLeft: 0
        };

        const componentInstance = new GridData(defaultProps);
        componentInstance.tableRef = {
            current: {
                scrollTop: 123,
                scrollLeft: 234
            }
        };

        componentInstance._resetScroll();

        expect(componentInstance.tableRef.current).toEqual(expectCurrent);
    });

    it('should render correctly', () => {
        const total = {
            FdmDateText: '',
            RegistrationDateText: '',
            TotalTurnover: 100,
            TotalGgr: 100,
            ProductReportList: {
                1: {
                    Turnover: 100,
                    Ggr: 100
                }
            }
        };
        const dataList = [
            {
                FdmDateText: '10/28/2021 00:00:00',
                RegistrationDateText: '10/28/2021 00:00:00',
                AffName: '12BETAFF001',
                PlayerName: 'abc',
                TotalTurnover: 100,
                TotalGgr: 100,
                ProductReportList: {
                    1: {
                        Turnover: 100,
                        Ggr: 100
                    }
                }
            }
        ];

        const wrapper = shallow(<GridData {...defaultProps} />);
        wrapper.instance().setState({ gridData: dataList, total });

        expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly with empty data', () => {
        const total = 0;
        const dataList = [
        ];

        const wrapper = shallow(<GridData {...defaultProps} />);
        wrapper.instance().setState({ gridData: dataList, total });

        expect(wrapper).toMatchSnapshot();
    });
});