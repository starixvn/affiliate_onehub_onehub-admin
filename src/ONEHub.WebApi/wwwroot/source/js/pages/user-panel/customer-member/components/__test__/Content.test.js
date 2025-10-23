import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../modules/constants';

describe('customer member - components - Content', () => {
    const defaultProps = {
        affId: 1271808,
        pagingOption: defaultPagingOption,
        param: {
            fromDate: "7/01/2017",
            isGetAll: false,
            memberType: '0',
            toDate: "7/01/2019"
        }
    }

    const data = [
        {
            Currency: "TB",
            Email: "",
            FirstName: "",
            LastName: "",
            RegisteredDate: "2017-07-02T13:44:00",
            RegisteredDateString: "07/02/2017 01:44:00 PM",
            UserName: "12BET$thongchart14"
        },
        {
            Currency: "RMB",
            Email: "",
            FirstName: "firstname_1271808",
            LastName: "lastname_1271808",
            RegisteredDate: "2017-07-03T13:14:00",
            RegisteredDateString: "07/03/2017 01:14:00 PM",
            UserName: "zwmwxx8023"
        }
    ]

    beforeEach(() => {
        window.globalVariables = {};
        window.initialState = {};
    })

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.instance().setState({ data });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data and canViewMemberEmail is true', () => {
        const props = Object.assign({}, defaultProps, { canViewMemberEmail: true });
        const result = shallow(<Content {...props} />);

        result.instance().setState({ data });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data is empty', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.instance().setState({ data: {} });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const param = Object.assign({}, defaultProps.param, { ToDate: "6/27/2017" });
        const props = Object.assign({}, defaultProps, { param });
        const componentInstance = new Content(props);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate(defaultProps);

        expect(componentInstance.fetchData).toHaveBeenCalledWith({ ...param, pageIndex: 1, pageSize: 20 });
    });

    it('fetchData - should call toggleLoaderUserPanel, setState and setPagingOption with correct parameter', async () => {
        const data = { MainData: [{ Id: 123 }], TotalItem: 1 };

        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchData });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { pageIndex: 1, pageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith({ ...param, affId: 1271808 });
        expect(componentInstance.setState).toHaveBeenCalledWith({ data: [{ Id: 123 }] });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 1, PageIndex: 1, PageSize: 20 });
    });

    it('fetchData - should call toggleLoaderUserPanel, setState and setPagingOption with incorrect parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchData = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchData });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { memberType: '-1', pageIndex: 1, pageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith({ ...param, affId: 1271808 });
        expect(componentInstance.setState).toHaveBeenCalledWith({ data: null });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 0, PageIndex: 1, PageSize: 20 });
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