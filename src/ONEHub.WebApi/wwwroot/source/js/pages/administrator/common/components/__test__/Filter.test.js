import React from 'react';
import Filter from '../Filter';
import { shallow } from 'enzyme';

describe('admin list - components - Filter ', () => {
    const defaultProps = {
        setParam: jest.fn(),
        fetchData: jest.fn()
    }

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly when is popup', () => {
        const props = Object.assign({}, defaultProps, { isPopup: true })
        const result = shallow(<Filter {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('_handleSearch - should be called when click Search Button', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Button').simulate('click');

        expect(defaultProps.setParam).toHaveBeenCalledWith({ userName: '', firstLetter: '' });
        expect(defaultProps.fetchData).toHaveBeenCalledWith({ userName: '', firstLetter: '' });
    });

    it('handleChange - should call setState', () => {
        const event = {
            target: { value: 'abc', name: 'userName' }
        };
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="text"][name="userName"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ userName: 'abc' });
    });

    it('handlePressEnter - should call handleSearch', () => {
        const event = {
            charCode: 13,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.handleSearch = jest.fn();

        instance.handlePressEnter(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(instance.handleSearch).toHaveBeenCalled();
    });

    it('handlePressEnter - should not call handleSearch', () => {
        const event = {
            charCode: 16,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.handleSearch = jest.fn();

        instance.handlePressEnter(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(instance.handleSearch).not.toHaveBeenCalled();
    });
})