import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';

import { DatePicker } from '@9softstudio/react-datepicker';
import { defaultPagingOption } from '../../../../modules/constants';

describe('message - components - Filter ', () => {
    const defaultProps = {
        today: "09/19/2019",
        pagingOption: defaultPagingOption
    }

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('_handleSearch - should be called when click Search Button', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ FromDate: "9/19/2019", IsGetAll: true, PageIndex: 1, PageSize: 20, SearchById: '0', ToDate: "9/19/2019" });
    });

    it('_handleSearch - should be called when click Search Button with important', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Input[type="select"][name="searchBy"]').simulate('change', { target: { value: '1' } });
        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ FromDate: "9/19/2019", IsGetAll: true, PageIndex: 1, PageSize: 20, SearchById: '1', ToDate: "9/19/2019" });
    });

    it('setSearch - should change category when change searchBy select', () => {
        const event = {
            target: { value: '0' }
        };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="select"][name="searchBy"]').simulate('change', event);

        expect(wrapper.find('Input[type="select"][name="searchBy"]').prop('value')).toEqual('0');
    });

    it('setGetAll - should change category when checked AllDate checkbox', () => {
        const event = {
            target: { checked: true }
        };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="checkbox"][name="isGetAll"]').simulate('change', event);

        expect(wrapper.find('Input[type="checkbox"][name="isGetAll"]').prop('checked')).toEqual(true);
    });

    it('_handleChangeFromDate - should be called when change From DatePicker', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find(DatePicker).at(0).simulate('change', { format: jest.fn(() => '09/09/2019') });

        expect(wrapper.find(DatePicker).at(0).prop('date')).toEqual('09/09/2019');
        expect(wrapper.find(DatePicker).at(1).prop('date')).toEqual('9/19/2019');
    });

    it('_handleChangeToDate - should be called when change From DatePicker', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find(DatePicker).at(1).simulate('change', { format: jest.fn(() => '26/09/2019') });

        expect(wrapper.find(DatePicker).at(0).prop('date')).toEqual('9/19/2019');
        expect(wrapper.find(DatePicker).at(1).prop('date')).toEqual('26/09/2019');
    });
})