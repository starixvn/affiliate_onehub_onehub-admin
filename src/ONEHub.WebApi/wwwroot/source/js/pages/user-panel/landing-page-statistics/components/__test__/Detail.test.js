import React from 'react';
import { Detail } from '../Detail';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../modules/constants';

describe('landing page statistics - components - Detail', () => {
    const selectedPage = {
        languageCode: "hien",
        selectedPage: "sportsbook"
    };
    const defaultProps = {
        selectedPage,
        pagingOption: defaultPagingOption,
        param: {
            affId: 1271808,
            deviceType: 0,
            fromDate: "07/01/2018",
            toDate: "7/15/2019"
        }
    };

    const data = {
        MainData: [
            {
                Fdm: 0,
                LanguageCode: "",
                Page: "",
                Signups: 0,
                TotalClick: 8,
                UniqueClick: 4,
                WebsiteUrl: "https://aff-12b.nexdev.net/UserAsian/UserPanel/Main/#MediaGallery"
            },
            {
                Fdm: 0,
                LanguageCode: "",
                Page: "",
                Signups: 0,
                TotalClick: 1,
                UniqueClick: 1,
                WebsiteUrl: "none"
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

    it('componentDidUpdate - should call fetchData if param change', () => {
        const props = Object.assign({}, defaultProps, { selectedPage });
        const componentInstance = new Detail(props);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate({ languageCode: "", selectedPage: "" });

        expect(componentInstance.fetchData).toHaveBeenCalledWith({ ...defaultProps.param, ...selectedPage, pageIndex: 1, pageSize: 20 });
    });

    it('fetchDetailData - should call toggleLoaderUserPanel, setState and setPagingOption with correct parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchDetailData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchDetailData });
        const componentInstance = new Detail(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { ...selectedPage, pageIndex: 1, pageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchDetailData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: data.MainData });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 2, PageIndex: 1, PageSize: 20 });
    });

    it('fetchDetailData - should call toggleLoader, setState and setPagingOption with incorrect parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const setPagingOption = jest.fn();
        const fetchDetailData = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, setPagingOption, fetchDetailData });
        const componentInstance = new Detail(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { memberType: '-1', pageIndex: 1, pageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchDetailData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: null });
        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 0, PageIndex: 1, PageSize: 20 });
    });

    it('handlePaging - should call fetchData with correct parameters', () => {
        const setPagingOption = jest.fn();
        const pageIndex = 2;
        const pageSize = 50;
        const paramExpect = Object.assign({}, defaultProps.param, { ...selectedPage, pageIndex, pageSize });

        const props = Object.assign({}, defaultProps, { setPagingOption });
        const componentInstance = new Detail(props);
        componentInstance.fetchData = jest.fn();

        componentInstance.handlePaging(pageIndex, pageSize);

        expect(componentInstance.fetchData).toHaveBeenCalledWith(paramExpect);
    });
});