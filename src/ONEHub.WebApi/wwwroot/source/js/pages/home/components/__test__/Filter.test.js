import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';

describe('home - components - Filter', () => {
    const defaultProps = {
        pagingOption: {
            PageIndex: 1,
            PageSize: 20
        }
    }

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with is changing countdown', () => {
        const result = shallow(<Filter {...defaultProps} />);
        result.setState({ isChangingCountDown: true });

        expect(result).toMatchSnapshot();
    });

    it('componentWillUnmount - should call clearInterval', () => {
        window.clearInterval = jest.fn();
        const result = shallow(<Filter {...defaultProps} />);

        result.instance().componentWillUnmount();

        expect(window.clearInterval).toHaveBeenCalled();
    });

    it('_handleCountDown - Should only call setState', async () => {
        const result = shallow(<Filter {...defaultProps} />);
        const instance = result.instance();
        instance.setState({ countDown: 5 });
        instance.setState = jest.fn();
        instance._handleFetchData = jest.fn();

        await instance._handleCountDown();

        expect(instance.setState).toHaveBeenCalledWith({ countDown: 4, time: "00:04" });
        expect(instance._handleFetchData).not.toHaveBeenCalled();
    });

    it('_handleCountDown - Should call setState and _handleFetchData', async () => {
        const props = Object.assign({}, defaultProps, { getOnlineList: jest.fn() });
        const result = shallow(<Filter {...props} />);
        const instance = result.instance();
        instance.setState({ countDown: 0, selectedCountDown: 3600 });
        instance.setState = jest.fn();
        instance._handleFetchData = jest.fn();

        await instance._handleCountDown();

        expect(instance.setState).toHaveBeenCalledWith({ countDown: 3599, time: "59:59" });
        expect(instance._handleFetchData).toHaveBeenCalled();
    });

    it('_handleCountDown - Should call setState and not call _handleFetchData', async () => {
        const result = shallow(<Filter {...defaultProps} />);
        const instance = result.instance();
        instance.setState({ countDown: 0, selectedCountDown: 0 });
        instance.setState = jest.fn();
        instance._handleFetchData = jest.fn();

        await instance._handleCountDown();

        expect(instance.setState).toHaveBeenCalledWith({ "time": "" });
        expect(instance._handleFetchData).not.toHaveBeenCalled();
    });

    it('_handleFetchData - Should call getOnlineList', async () => {
        const props = Object.assign({}, defaultProps, { getOnlineList: jest.fn() });
        const result = shallow(<Filter {...props} />);

        await result.instance()._handleFetchData();

        expect(props.getOnlineList).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 20 });
    });

    it('_toggleChangingCountDown - Should be called when onBlur selected countdown', () => {
        const result = shallow(<Filter {...defaultProps} />);
        const instance = result.instance();
        instance._toggleChangingCountDown = jest.fn();

        result.find('select').simulate('blur')

        expect(instance._toggleChangingCountDown).toHaveBeenCalledWith(false);
    });

    it('_toggleChangingCountDown - Should be called when onBlur selected countdown', () => {
        const result = shallow(<Filter {...defaultProps} />);
        const instance = result.instance();
        instance._toggleChangingCountDown = jest.fn();

        result.find('Button').simulate('click')

        expect(instance._toggleChangingCountDown).toHaveBeenCalledWith(true);
    });

    it('_toggleChangingCountDown - Should call setState', () => {
        const result = shallow(<Filter {...defaultProps} />);
        const instance = result.instance();
        instance.setState = jest.fn((val, fn) => fn && fn());
        instance.countDownDropdown.current = jest.fn();
        instance.countDownDropdown.current.focus = jest.fn();

        instance._toggleChangingCountDown(true);

        expect(instance.setState).toHaveBeenCalledWith({ isChangingCountDown: true }, expect.any(Function));
    });

    it('_handleChangeCountDown - Should call setState and getOnlineList', async () => {
        const result = shallow(<Filter {...defaultProps} />);
        const instance = result.instance();
        instance.setState = jest.fn();
        instance._handleFetchData = jest.fn();

        await instance._handleChangeCountDown({ target: { value: 3600 } });

        expect(instance.setState).toHaveBeenCalledWith({ selectedCountDown: 3600, countDown: 3600 });
        expect(instance._handleFetchData).toHaveBeenCalled();
    });
});