import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';

describe('tracking statistics - components - Filter', () => {
    const trackingCodeList = ["[None]"];
    const setParam = jest.fn();
    const setSelectedMonth = jest.fn();
    const getTrackingCodeList = jest.fn(() => trackingCodeList);

    const defaultProps = {
        isClickLink: false,
        affId: 1271808,
        setParam,
        setSelectedMonth,
        getTrackingCodeList
    };

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);
        result.setState({ trackingCodeList });

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call handleClickSearch and handleGetTrackingCodeList', () => {
        const props = Object.assign({}, defaultProps, { isClickLink: true });
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.handleGetTrackingCodeList = jest.fn();
        instance.handleClickSearch = jest.fn();
        instance.setState({ monthDate: new Date('11/26/2019') });

        instance.componentDidMount();

        expect(instance.handleGetTrackingCodeList).toHaveBeenCalledWith(1271808);
        expect(instance.handleClickSearch).toHaveBeenCalled();
    });

    it('componentDidMount - should only call handleClickSearch', () => {
        const props = Object.assign({}, defaultProps, { isClickLink: true });
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.setState({ trackingCodeList });
        instance.handleGetTrackingCodeList = jest.fn();
        instance.handleClickSearch = jest.fn();

        instance.componentDidMount();

        expect(instance.handleGetTrackingCodeList).not.toHaveBeenCalled();
        expect(instance.handleClickSearch).toHaveBeenCalled();
    });

    it('componentDidUpdate - should call handleClickSearch', () => {
        const props = Object.assign({}, defaultProps, { isClickLink: true });
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.handleClickSearch = jest.fn();

        instance.componentDidUpdate();

        expect(instance.handleClickSearch).toHaveBeenCalledWith();
    });

    it('handleGetTrackingCodeList - should call setState and getTrackingCodeList', async () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance.handleGetTrackingCodeList();

        expect(instance.setState).toHaveBeenCalledWith({ trackingCodeList });
        expect(defaultProps.getTrackingCodeList).toHaveBeenCalledWith(1271808);
    });

    it('handleChange - should call setState', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance.handleChange({ target: { name: 'trackingCode', value: "[None]" } });

        expect(instance.setState).toHaveBeenCalledWith({ trackingCode: "[None]" });
    });

    it('handleClickSearch - should be called when click Search Button', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ trackingCodeList });

        wrapper.find('Button').at(0).simulate('click');

        expect(defaultProps.setParam).toHaveBeenCalledWith({ trackingCode: '' });
        expect(defaultProps.setSelectedMonth).toHaveBeenCalledWith(null);
    });
});