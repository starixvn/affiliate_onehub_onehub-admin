import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../modules/constants';

describe('statement history - components - Content', () => {
    const defaultProps = {
        affId: 1271808,
        pagingOption: defaultPagingOption,
        param: {
            fromDate: "1/11/2019",
            isGetAll: false,
            isBack: false,
            toDate: "7/11/2019"
        },
        expandMonthDateList: {}
    }

    const gridData = [
        {
            Amount: 0,
            CalculatedType: 2,
            Children: [
                {
                    Amount: 0,
                    CalculatedType: 0,
                    Children: [],
                    Creator: "",
                    DateText: "Jun-2020",
                    DescriptionDisplay: "Current Monthly Earning",
                    NormalizeDateText: "2020-06-30",
                    Status: "Current",
                    TransId: 0,
                    TransType: 201
                },
                {
                    Amount: 0,
                    CalculatedType: 0,
                    Children: [],
                    Creator: "",
                    DateText: "Jun-2020",
                    DescriptionDisplay: "Current Revenue Share",
                    NormalizeDateText: "2020-06-30",
                    Status: "Current",
                    TransId: 0,
                    TransType: 204
                }
            ],
            Creator: "",
            DateText: "Jun-2020",
            DescriptionDisplay: "Current Month Statistics",
            NormalizeDateText: "2020-06-30",
            Status: "Current",
            TransId: 0,
            TransType: 0
        },
        {
            Amount: 100,
            CalculatedType: 2,
            Children: [],
            Creator: "System",
            DateText: "25-May-2020",
            DescriptionDisplay: "",
            NormalizeDateText: "2020-05-25",
            Status: "Cancelled",
            TransId: 217,
            TransType: 200
        },
        {
            Amount: 100,
            CalculatedType: 2,
            Children: [],
            Creator: "System",
            DateText: "25-May-2020",
            DescriptionDisplay: "",
            NormalizeDateText: "2020-05-25",
            Status: "Processing",
            TransId: 218,
            TransType: 202
        }
    ]

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.instance().setState({ gridData });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data is empty', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.instance().setState({ gridData: {} });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const param = Object.assign({}, defaultProps.param, { toDate: "7/10/2019" });
        const props = Object.assign({}, defaultProps, { param, setExpandMonthDateList: jest.fn() });
        const componentInstance = new Content(props);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate(defaultProps);

        expect(componentInstance.fetchData).toHaveBeenCalledWith({ ...param, pageIndex: 1, pageSize: 20 }, false);
    });

    it('fetchData - should call toggleLoaderUserPanel, setState and setPagingOption with correct parameter', async () => {
        const data = { MainData: [{ Id: 123 }], TotalItem: 1 };

        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchData, setExpandMonthDateList: jest.fn() });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { pageIndex: 1, pageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith({ affId: 1271808, fromDate: "1/11/2019", pageIndex: 1, pageSize: 20, toDate: "7/11/2019" });
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: [{ Id: 123 }], shouldResetScrollPosition: true });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 1, PageIndex: 1, PageSize: 20 });
        expect(props.setExpandMonthDateList).toHaveBeenCalledWith({});
    });

    it('fetchData - should call toggleLoaderUserPanel, setState and setPagingOption with correct parameter with get all', async () => {
        const data = { MainData: [{ Id: 123 }], TotalItem: 1 };

        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchData = jest.fn(() => data);
        document.getElementsByClassName = jest.fn(() => ({ scrollTop: 0 }))

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchData, setExpandMonthDateList: jest.fn() });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { isGetAll: true, pageIndex: 1, pageSize: 20, isBack: true });
        await componentInstance.fetchData(param, false);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith({ affId: 1271808, fromDate: null, pageIndex: 1, pageSize: 20, toDate: null });
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: [{ Id: 123 }], shouldResetScrollPosition: true });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 1, PageIndex: 1, PageSize: 20 });
        expect(props.setExpandMonthDateList).not.toHaveBeenCalled();
    });

    it('fetchData - should call toggleLoader, setState and setPagingOption with incorrect parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchData = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchData, setExpandMonthDateList: jest.fn() });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { memberType: '-1', pageIndex: 1, pageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith({ affId: 1271808, fromDate: "1/11/2019", pageIndex: 1, pageSize: 20, toDate: "7/11/2019" });
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: null, shouldResetScrollPosition: true });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 0, PageIndex: 1, PageSize: 20 });
    });

    it('handleSetTransactionId - should be called when click transId Button', () => {
        const wrapper = shallow(<Content {...defaultProps} />);

        wrapper.instance().handleSetTransactionId = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(gridData[2], 2)}</div>);

        dataRow.find('Button').at(1).simulate('click');

        expect(wrapper.instance().handleSetTransactionId).toHaveBeenCalledWith(218);
    });

    it('handleSetTransactionId - should call setState and setTransactionId', () => {
        const props = Object.assign({}, defaultProps, { setTransactionId: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance().handleSetTransactionId(1262276211);

        expect(wrapper.setState).toHaveBeenCalledWith({ shouldResetScrollPosition: false });
        expect(props.setTransactionId).toHaveBeenCalledWith(1262276211);
    });

    it('_handleShow - should call setExpandMonthDateList when click amount payment Button', () => {
        const props = Object.assign({}, defaultProps, { setExpandMonthDateList: jest.fn() });
        const wrapper = shallow(<Content {...props} />);

        wrapper.instance().handleSetTransactionId = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(gridData[0], 1)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(props.setExpandMonthDateList).toHaveBeenCalledWith({ "2020-06-30": true });
    });

    it('transTypeClickHandler - should call handleSetTransactionId when click amount payment Button', () => {
        const wrapper = shallow(<Content {...defaultProps} />);

        wrapper.instance().handleSetTransactionId = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(gridData[2], 2)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(wrapper.instance().handleSetTransactionId).toHaveBeenCalledWith(218);
    });

    it('transTypeClickHandler - should call redirectToDailyEarning when click amount Button', () => {
        const props = Object.assign({}, defaultProps, { redirectToDailyEarning: jest.fn(), expandMonthDateList: { "2020-06-30": true } });
        const wrapper = shallow(<Content {...props} />);

        wrapper.instance().handleSetTransactionId = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(gridData[0], 1)}</div>);

        dataRow.find('Button').at(1).simulate('click');

        expect(props.redirectToDailyEarning).toHaveBeenCalledWith({
            affId: 1271808,
            monthDate: "2020-06-30",
            productId: 0,
            statementHistory: {
                expandMonthDateList: { "2020-06-30": true },
                param: {
                    fromDate: "1/11/2019",
                    isBack: false,
                    isGetAll: false,
                    toDate: "7/11/2019"
                },
                scrollTop: 0
            }
        });
    });

    it('transTypeClickHandler - should call redirectToSubAffiliate when click amount Button', () => {
        const props = Object.assign({}, defaultProps, { redirectToSubAffiliate: jest.fn(), expandMonthDateList: { "2020-06-30": true } });
        const wrapper = shallow(<Content {...props} />);

        wrapper.instance().handleSetTransactionId = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(gridData[0], 1)}</div>);

        dataRow.find('Button').at(2).simulate('click');

        expect(props.redirectToSubAffiliate).toHaveBeenCalledWith({
            affId: 1271808,
            monthDate: "2020-06-30",
            statementHistory: {
                expandMonthDateList: { "2020-06-30": true },
                param: {
                    fromDate: "1/11/2019",
                    isBack: false,
                    isGetAll: false,
                    toDate: "7/11/2019"
                },
                scrollTop: 0
            }
        });
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