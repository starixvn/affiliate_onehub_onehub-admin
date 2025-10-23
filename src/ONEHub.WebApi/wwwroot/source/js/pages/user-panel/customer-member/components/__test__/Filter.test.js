import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';
import { DatePicker } from '@9softstudio/react-datepicker';

describe('customer member - components - Filter', () => {
    const today = '03/12/2020';
    const defaultProps = {
        today
    };

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('handleChangeInput - should call setState when change memberType select', () => {
        const event = {
            target: {
                type: 'select',
                value: 'Deposit',
                name: 'memberType'
            }
        }
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="select"][name="memberType"][id="memberType"]').simulate('change', event)

        expect(wrapper.setState).toHaveBeenCalledWith({ memberType: 'Deposit' });
    });

    it('handleChangeInput - should call setState when click GetAll checkbox', () => {
        const event = {
            target: {
                type: 'checkbox',
                checked: true,
                name: 'isGetAll'
            }
        }
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="checkbox"][name="isGetAll"]').simulate('change', event)

        expect(wrapper.setState).toHaveBeenCalledWith({ isGetAll: true });
    });

    it('handleChangeFromDate - should be called when From change', () => {
        const monthDate = { format: jest.fn(() => "6/25/2019") };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(0).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ "fromDate": "6/25/2019", "toDate": "3/12/2020" });
    });

    it('handleChangeToDate - should be called when To change', () => {
        const monthDate = { format: jest.fn(() => "7/10/2019") };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(1).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ toDate: "7/10/2019" });
    });

    it('handleSearch - should be called when click Search Button', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ "fromDate": "3/01/2020", "isGetAll": false, "memberType": "0", "toDate": "3/12/2020" });
    });
});