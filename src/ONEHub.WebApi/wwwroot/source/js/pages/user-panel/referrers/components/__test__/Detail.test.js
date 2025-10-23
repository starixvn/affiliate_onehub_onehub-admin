import React from 'react';
import { Detail } from '../Detail';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../modules/constants';

describe('referrers - components - Detail', () => {
    const affId = 1271808;
    const selectedSiteUrl = 'www.12-bet.com';
    const defaultProps = {
        affId,
        selectedSiteUrl,
        pagingOption: defaultPagingOption,
        param: {
            deviceType: 0,
            fromDate: "07/01/2016",
            toDate: "7/22/2019"
        }
    };

    const data = {
        MainData: [
            {
                Fdm: 0,
                Signups: 0,
                SiteUrl: "",
                TotalClick: 29,
                UniqueClick: 29,
                WebsiteUrl: "http://www.12-bet.com/goto/12-bet-hant"
            },
            {
                Fdm: 0,
                Signups: 0,
                SiteUrl: "",
                TotalClick: 1,
                UniqueClick: 1,
                WebsiteUrl: "http://www.12-bet.com/goto/12-bet-id"
            }
        ],
        TotalItem: 2
    };

    it('render correctly', () => {
        const result = shallow(<Detail {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data', () => {
        const result = shallow(<Detail {...defaultProps} />);

        result.instance().setState({ gridData: data.MainData });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data is empty', () => {
        const result = shallow(<Detail {...defaultProps} />);

        result.instance().setState({ gridData: {} });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if selectedSiteUrl change', () => {
        const componentInstance = new Detail(defaultProps);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate({ selectedSiteUrl: "" });

        expect(componentInstance.fetchData).toHaveBeenCalledWith({ ...defaultProps.param, selectedSiteUrl, pageIndex: 1, pageSize: 20 });
    });

    it('fetchDetailData - should call toggleLoaderUserPanel, setState and setPagingOption with correct parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchDetailData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchDetailData });
        const componentInstance = new Detail(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { selectedSiteUrl, pageIndex: 1, pageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchDetailData).toHaveBeenCalledWith({ ...param, affId });
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: data.MainData, shouldResetScrollPosition: true });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 2, PageIndex: 1, PageSize: 20 });
    });

    it('fetchDetailData - should call toggleLoader, setState and setPagingOption with incorrect parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchDetailData = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchDetailData });
        const componentInstance = new Detail(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { selectedSiteUrl: '', pageIndex: 1, pageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchDetailData).toHaveBeenCalledWith({ ...param, affId });
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: null, shouldResetScrollPosition: true });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 0, PageIndex: 1, PageSize: 20 });
    });

    it('handlePaging - should call setPagingOption and fetchData with correct parameters', () => {
        const setPagingOption = jest.fn();
        const pageIndex = 2;
        const pageSize = 50;

        const paramExpect = Object.assign({}, defaultProps.param, { selectedSiteUrl, pageIndex, pageSize });

        const props = Object.assign({}, defaultProps, { setPagingOption });
        const componentInstance = new Detail(props);
        componentInstance.fetchData = jest.fn();

        componentInstance.handlePaging(pageIndex, pageSize);

        expect(componentInstance.fetchData).toHaveBeenCalledWith(paramExpect);
    });
});