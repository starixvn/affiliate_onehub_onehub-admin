import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../modules/constants';

describe('payment request - components - Content ', () => {
    const defaultProps = {
        pagingOption: defaultPagingOption,
        param: {
            FromDate: "6/25/2019",
            IsGetAll: false,
            PageIndex: 1,
            PageSize: 20,
            SearchBy: 1,
            Status: null,
            ToDate: "6/26/2019",
            Username: null
        }
    }

    const gridData = [
        {
            AffName: "12BETAFF226",
            Amount: 125,
            CompletedDateText: "06/20/2019 22:45:23",
            Creator: "AAwalter",
            Status: "Approved",
            TransDateText: "06/20/2019 22:25:07",
            TransId: 1262276211
        },
        {
            AffName: "12BETAFF226",
            Amount: 105,
            CompletedDateText: "06/19/2019 00:20:18",
            Creator: "AAwalter",
            Status: "Processing",
            TransDateText: "06/18/2019 22:14:31",
            TransId: 1262276209
        }
    ]

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have gridData', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.instance().setState({ gridData });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have gridData is empty', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.instance().setState({ gridData: {} });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const param = Object.assign({}, defaultProps.param, { ToDate: "6/27/2019" });
        const props = Object.assign({}, defaultProps, { param });
        const componentInstance = new Content(props);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate(defaultProps);

        expect(componentInstance.fetchData).toHaveBeenCalledWith({ ...param, PageIndex: 1, PageSize: 20 });
    });

    it('fetchData - should call toggleLoader, setState and setPagingOption with correct parameter', async () => {
        const data = { MainData: [{ Id: 123 }], TotalItem: 1 };

        const toggleLoader = jest.fn();
        const setPagingOption = jest.fn();
        const fetchData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { toggleLoader, setPagingOption, fetchData });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { PageIndex: 1, PageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: [{ Id: 123 }], shouldResetScrollPosition: true });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 1, PageIndex: 1, PageSize: 20 });
    });

    it('fetchData - should call toggleLoader, setState and setPagingOption with incorrect parameter', async () => {
        const toggleLoader = jest.fn();
        const setPagingOption = jest.fn();
        const fetchData = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoader, setPagingOption, fetchData });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { AffId: 'abc', PageIndex: 1, PageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: null, shouldResetScrollPosition: true });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 0, PageIndex: 1, PageSize: 20 });
    });

    it('handleSetTransactionId - should be called when click transId Button', () => {
        const wrapper = shallow(<Content {...defaultProps} />);

        wrapper.instance().handleSetTransactionId = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('a').at(0).simulate('click');

        expect(wrapper.instance().handleSetTransactionId).toHaveBeenCalledWith(1262276211);
    });

    it('handleSetTransactionId - should call setState and setTransactionId', () => {
        const props = Object.assign({}, defaultProps, { setTransactionId: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance().handleSetTransactionId(1262276211);

        expect(wrapper.setState).toHaveBeenCalledWith({ shouldResetScrollPosition: false });
        expect(props.setTransactionId).toHaveBeenCalledWith(1262276211);
    });

    it('handlePaging - should call fetchData with correct parameters', () => {
        const setPagingOption = jest.fn();
        const PageIndex = 2;
        const PageSize = 50;
        const paramExpect = Object.assign({}, defaultProps.param, { PageIndex, PageSize });

        const props = Object.assign({}, defaultProps, { setPagingOption });
        const componentInstance = new Content(props);
        componentInstance.fetchData = jest.fn();

        componentInstance.handlePaging(PageIndex, PageSize);

        expect(componentInstance.fetchData).toHaveBeenCalledWith(paramExpect);
    });
});