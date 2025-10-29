import React from 'react';
import { shallow } from 'enzyme';
import { Filter } from '../Filter';
import { DatePicker } from '@9softstudio/react-datepicker';

describe('marketing statistics - components - Filter', () => {
    const defaultProps = {
        today: '2024-01-31',
        affId: 123,
        languageList: { 'en-US': 'English', 'zh-CN': 'Chinese' },
        setParam: jest.fn()
    };

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('should render all form elements', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        expect(wrapper.find(DatePicker)).toHaveLength(2);
        expect(wrapper.find('Input[type="select"]')).toHaveLength(1);
        expect(wrapper.find('Input[type="checkbox"]')).toHaveLength(1);
        expect(wrapper.find('Button')).toHaveLength(1);
    });

    it('should call setParam with default values when search', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Button').simulate('click');

        expect(defaultProps.setParam).toHaveBeenCalledWith({
            affId: 123,
            fromDate: '01/01/2024',
            toDate: '01/31/2024',
            languageCodes: '',
            includedInActive: false
        });
    });

    it('should call setParam with selected values when search', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        // Change date
        wrapper.find(DatePicker).at(0).simulate('change', {
            format: () => '01/15/2024'
        });
        wrapper.find(DatePicker).at(1).simulate('change', {
            format: () => '01/20/2024'
        });

        // Change language
        wrapper.find('Input[type="select"]').simulate('change', {
            target: { value: 'en' }
        });

        // Change checkbox
        wrapper.find('Input[type="checkbox"]').simulate('change', {
            target: { checked: true }
        });

        // Click search
        wrapper.find('Button').simulate('click');

        expect(defaultProps.setParam).toHaveBeenCalledWith({
            affId: 123,
            fromDate: '01/15/2024',
            toDate: '01/20/2024',
            languageCodes: 'en',
            includedInActive: true
        });
    });
});
