import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';

describe('referrers - components - Content', () => {
    const defaultProps = {
        affId: 1271808,
        param: {
            deviceType: 0,
            fromDate: "7/1/2019",
            toDate: "7/31/2019"
        }
    }

    const gridData = [
        {
            Fdm: 0,
            Signups: 0,
            SiteUrl: "ha.nexdev.net",
            TotalClick: 28,
            UniqueClick: 18,
            WebsiteUrl: ""
        },
        {
            Fdm: 0,
            Signups: 0,
            SiteUrl: "none",
            TotalClick: 1,
            UniqueClick: 1,
            WebsiteUrl: ""
        },
        {
            Fdm: 0,
            Signups: 0,
            SiteUrl: "Old URL",
            TotalClick: 0,
            UniqueClick: 0,
            WebsiteUrl: ""
        }
    ];

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
        const param = Object.assign({}, defaultProps.param, {
            deviceType: 0,
            fromDate: "10/1/2018",
            isClickLink: true,
            toDate: "10/31/2018"
        });
        const props = Object.assign({}, defaultProps, { param });
        const componentInstance = new Content(props);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate(defaultProps);

        expect(componentInstance.fetchData).toHaveBeenCalledWith(param);
    });

    it('fetchData - should call toggleLoaderUserPanel and setState with correct parameter', async () => {
        const data = [{ Id: 123 }];

        const toggleLoaderUserPanel = jest.fn();
        const fetchData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, fetchData });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();

        await componentInstance.fetchData(defaultProps.param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith({ ...defaultProps.param, affId: defaultProps.affId });
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: [{ Id: 123 }] });
    });

    it('fetchData - should call toggleLoader and setState with incorrect parameter', async () => {
        const toggleLoaderUserPanel = jest.fn();
        const fetchData = jest.fn(() => null);

        const props = Object.assign({}, defaultProps, { toggleLoaderUserPanel, fetchData });
        const componentInstance = new Content(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { deviceType: '-1' });

        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith({ ...param, affId: defaultProps.affId });
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: null });
    });

    it('setSelectedSiteUrl - should be called when click url Button', () => {
        const props = Object.assign({}, defaultProps, { setSelectedSiteUrl: jest.fn() });
        const wrapper = shallow(<Content {...props} />);

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(gridData[0], 1)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(props.setSelectedSiteUrl).toHaveBeenCalledWith("ha.nexdev.net");
    });
});