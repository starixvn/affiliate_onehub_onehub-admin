import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';
import { DatePicker } from '@9softstudio/react-datepicker';

describe('landing page statistics - components - Filter', () => {
    const today = '07/12/2019';
    const languageList = [
        {
            LanguageCode: "en-US",
            LanguageName: "English"
        },
        {
            LanguageCode: "vi-VN",
            LanguageName: "Vietnamese"
        },
        {
            LanguageCode: "zh-TW",
            LanguageName: "Chinese Traditional"
        },
        {
            LanguageCode: "abc",
            LanguageName: "ABC"
        }
    ];
    const pageList = [
        {
            PageCode: "sportsbook",
            PageId: 1,
            PageName: "Sportsbook"
        },
        {
            PageCode: "casino",
            PageId: 18,
            PageName: "Casino"
        },
        {
            PageCode: "keno",
            PageId: 21,
            PageName: "Keno"
        }
    ];
    const shortCodeLanguageList = {
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
        today,
        affId: 1271808,
        languageList,
        shortCodeLanguageList,
        setShortCodeLanguageList: jest.fn(),
        getPageList: jest.fn()
    };

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);
        result.setState({ pageList });

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call handleGetPageList', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.handleGetPageList = jest.fn();

        instance.componentDidMount();

        expect(instance.handleGetPageList).toHaveBeenCalled();
        expect(defaultProps.getPageList).toHaveBeenCalled();
    });

    it('componentDidMount - should not call handleGetPageList', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ pageList });
        const instance = wrapper.instance();
        instance.handleGetPageList = jest.fn();

        instance.componentDidMount();

        expect(instance.handleGetPageList).not.toHaveBeenCalled();
    });

    it('handleChange - should call setState when change page select', () => {
        const event = {
            target: {
                value: 'casino',
                name: 'selectedPage'
            }
        }
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ pageList });
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="select"][name="selectedPage"][id="selectedPage"]').simulate('change', event)

        expect(wrapper.setState).toHaveBeenCalledWith({ selectedPage: 'casino' });
    });

    it('handleChange - should call setState when change languageCode select', () => {
        const event = {
            target: {
                value: 'en',
                name: 'languageCode'
            }
        }
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ pageList });
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="select"][name="languageCode"][id="languageCode"]').simulate('change', event)

        expect(wrapper.setState).toHaveBeenCalledWith({ languageCode: 'en' });
    });

    it('handleChange - should call setState when change deviceType select', () => {
        const event = {
            target: {
                value: 1,
                name: 'deviceType'
            }
        }
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ pageList });
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="select"][name="deviceType"][id="deviceType"]').simulate('change', event)

        expect(wrapper.setState).toHaveBeenCalledWith({ deviceType: 1 });
    });

    it('handleChangeFromDate - should be called when From change', () => {
        const monthDate = { format: jest.fn(() => "6/25/2019") };
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ pageList });
        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(0).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ fromDate: "6/25/2019", toDate: "7/12/2019" });
    });

    it('handleChangeToDate - should be called when To change', () => {
        const monthDate = { format: jest.fn(() => "7/10/2019") };
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ pageList });
        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(1).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ toDate: "7/10/2019" });
    });

    it('handleSearch - should be called when click Search Button', () => {
        const setParam = jest.fn();
        const setSelectedPage = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam, setSelectedPage });
        const wrapper = shallow(<Filter {...props} />);
        wrapper.setState({ pageList });

        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ affId: 1271808, deviceType: -1, fromDate: "7/01/2019", languageCode: "", selectedPage: "", toDate: "7/12/2019" });
        expect(props.setSelectedPage).toHaveBeenCalledWith(null);
    });
});