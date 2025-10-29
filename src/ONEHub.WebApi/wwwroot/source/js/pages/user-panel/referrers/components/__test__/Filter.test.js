import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';
import { DatePicker } from '@9softstudio/react-datepicker';

describe('referrers - components - Filter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    const today = '07/12/2019';
    const param = {
        deviceType: -1,
        fromDate: "10/1/2018",
        isClickLink: false,
        toDate: "10/31/2018"
    };
    const defaultProps = {
        today,
        param
    };
    const setParam = jest.fn();
    const setSelectedSiteUrl = jest.fn();

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call handleSearch', () => {
        const newParam = Object.assign({}, param, { isClickLink: true });
        const props = Object.assign({}, defaultProps, { param: newParam, setParam, setSelectedSiteUrl });
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.handleSearch = jest.fn();

        instance.componentDidMount();

        expect(instance.handleSearch).toHaveBeenCalledWith({ deviceType: -1, fromDate: "10/1/2018", toDate: "10/31/2018" });
    });

    it('componentDidUpdate - should call setState and setSelectedSiteUrl', () => {
        const props = Object.assign({}, defaultProps, { setSelectedSiteUrl });
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance.componentDidUpdate({ param: {} });

        expect(instance.setState).toHaveBeenCalledWith({ deviceType: -1, fromDate: "10/1/2018", toDate: "10/31/2018" });
        expect(props.setSelectedSiteUrl).toHaveBeenCalledWith(null);
    });

    it('componentDidUpdate - should call setState, setSelectedSiteUrl and handleSearch', () => {
        const newParam = Object.assign({}, param, { isClickLink: true });
        const props = Object.assign({}, defaultProps, { param: newParam, setParam, setSelectedSiteUrl });
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();
        instance.handleSearch = jest.fn();

        instance.componentDidUpdate({ param: {} });

        expect(instance.setState).toHaveBeenCalledWith({ deviceType: -1, fromDate: "10/1/2018", toDate: "10/31/2018" });
        expect(props.setSelectedSiteUrl).toHaveBeenCalledWith(null);
    });

    it('componentDidUpdate - should not call setState and setSelectedSiteUrl', () => {
        const props = Object.assign({}, defaultProps, { setSelectedSiteUrl });
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(instance.setState).not.toHaveBeenCalled();
        expect(props.setSelectedSiteUrl).not.toHaveBeenCalled();
    });

    it('handleChange - should call setState when change deviceType select', () => {
        const event = {
            target: {
                value: 1,
                name: 'deviceType'
            }
        }
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="select"][name="deviceType"][id="deviceType"]').simulate('change', event)

        expect(wrapper.setState).toHaveBeenCalledWith({ deviceType: 1 });
    });

    it('handleChangeFromDate - should be called when From change', () => {
        const monthDate = { format: jest.fn(() => "6/25/2019") };
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(0).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ fromDate: "6/25/2019", toDate: "7/12/2019" });
    });

    it('handleChangeToDate - should be called when To change', () => {
        const monthDate = { format: jest.fn(() => "7/10/2019") };
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(1).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ toDate: "7/10/2019" });
    });

    it('handleSearch - should be called when click Search Button', () => {
        const props = Object.assign({}, defaultProps, { setParam, setSelectedSiteUrl });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ deviceType: -1, fromDate: "7/01/2019", toDate: "7/12/2019" });
        expect(props.setSelectedSiteUrl).toHaveBeenCalledWith(null);
    });
});