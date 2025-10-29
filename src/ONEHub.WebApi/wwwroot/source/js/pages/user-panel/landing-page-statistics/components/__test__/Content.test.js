import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';

describe('landing page statistics - components - Content', () => {
    const languageList = {
        ch: "Chinese Traditional",
        cs: "Chinese Simplified",
        en: "English",
        eneuro: "English (Europe)",
        es: "Spanish",
        hien: "English (India)",
        id: "Indonesian",
        jp: "Japanese",
        ko: "Korean",
        th: "Thai",
        vn: "Vietnamese"
    };
    const defaultProps = {
        languageList,
        param: {
            affId: 1271808,
            deviceType: 0,
            fromDate: "07/01/2018",
            languageCode: "",
            selectedPage: "",
            toDate: "7/15/2019"
        }
    }

    const gridData = [
        {
            Fdm: 0,
            LanguageCode: "hien",
            Page: "casino",
            Signups: 0,
            TotalClick: 2,
            UniqueClick: 2,
            WebsiteUrl: ""
        },
        {
            Fdm: 0,
            LanguageCode: "hien",
            Page: "casino",
            Signups: 0,
            TotalClick: 2,
            UniqueClick: 2,
            WebsiteUrl: ""
        },
        {
            Fdm: 0,
            LanguageCode: "en",
            Page: "sportsbook",
            Signups: 0,
            TotalClick: 2,
            UniqueClick: 1,
            WebsiteUrl: ""
        },
        {
            Fdm: 0,
            LanguageCode: "none",
            Page: "Old URL",
            Signups: 0,
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
        const param = Object.assign({}, defaultProps.param, { toDate: "7/10/2019" });
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
        const param = Object.assign({}, defaultProps.param, { pageIndex: 1, pageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(props.fetchData).toHaveBeenCalledWith(param);
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

        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: null });
    });

    it('handleSelectedPage - should be called when click page Button', () => {
        const wrapper = shallow(<Content {...defaultProps} />);

        wrapper.instance().handleSelectedPage = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(gridData[0], 1)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(wrapper.instance().handleSelectedPage).toHaveBeenCalledWith('casino', 'hien');
    });

    it('handleSelectedPage - should call setSelectedPage', () => {
        const props = Object.assign({}, defaultProps, { setSelectedPage: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance().handleSelectedPage('casino', 'hien');

        expect(props.setSelectedPage).toHaveBeenCalledWith({ languageCode: 'hien', selectedPage: "casino" });
    });
});