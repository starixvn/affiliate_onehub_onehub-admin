import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../modules/constants';

describe('view log - components - Content', () => {
    const defaultProps = {
        affId: 1271808,
        pagingOption: defaultPagingOption,
        param: {
            logType: 0,
            fromDate: "06/06/2019",
            toDate: "06/06/2019"
        },
        showIdList: { 10279105: false },
        setPagingOption: jest.fn(),
        toggleLoaderUserPanel: jest.fn(),
        setShowIdList: jest.fn(),
        fetchData: jest.fn(() => gridData)
    }

    const gridData = [
        {
            LogId: 10279106,
            UpdatedName: "AAwalter",
            Description: "Update Affiliate's Status",
            Action: "User Info",
            Ip: "::1",
            DateText: "06/06/2019 03:42:42 AM"
        },
        {
            LogId: 10279105,
            UpdatedName: "AAwalter",
            Description: "Update Affiliate's Status",
            Action: "User Info",
            Ip: "::1",
            DateText: "06/06/2019 03:42:38 AM"
        },
        {
            LogId: 10279105,
            UpdatedName: "AAwalter",
            Description: "Assign a common commission group.GroupID=102\n AffIDList=1271808",
            Action: "Setting for Commission Group",
            Ip: "::1",
            DateText: "06/06/2019 03:42:38 AM"
        }
    ]

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.instance().setState({ gridData });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data is empty', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.instance().setState({ gridData: [] });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const param = Object.assign({}, defaultProps.param, { toDate: "6/27/2017" });
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
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: [{ Id: 123 }], "shouldResetScrollPosition": true });
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
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: null, "shouldResetScrollPosition": true });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 0, PageIndex: 1, PageSize: 20 });
    });

    it('handleShow - should call setState, setShowIdList when click button link', async () => {
        const props = Object.assign({}, defaultProps, { setShowIdList: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(gridData[1], 2, true, false)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(wrapper.setState).toHaveBeenCalledWith({ "shouldResetScrollPosition": false });
        expect(props.setShowIdList).toHaveBeenCalledWith({ 10279105: true });
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