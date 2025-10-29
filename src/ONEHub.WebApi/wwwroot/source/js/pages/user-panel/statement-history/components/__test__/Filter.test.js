import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';
import { DatePicker } from '@9softstudio/react-datepicker';

describe('statement history - components - Filter', () => {
    const today = '03/12/2020';
    const defaultProps = {
        today
    };

    it('render correctly', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        expect(wrapper).toMatchSnapshot();
    });

    it('componentDidMount - should call setState', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.instance().componentDidMount();

        expect(props.setParam).toHaveBeenCalledWith({ fromDate: "01/01/2020", isGetAll: false, toDate: "3/12/2020", isBack: false, scrollTop: 0 });
    });

    it('handleChecked - should call setState when click GetAll checkbox', () => {
        const event = {
            target: {
                checked: true,
                name: 'isGetAll'
            }
        };
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="checkbox"][name="isGetAll"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ isGetAll: true });
    });

    it('handleChangeFromDate - should be called when From change', () => {
        const monthDate = { format: jest.fn(() => "01/11/2020") };
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(0).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ fromDate: "01/11/2020", toDate: "3/12/2020" });
    });

    it('handleChangeToDate - should be called when To change', () => {
        const monthDate = { format: jest.fn(() => "7/10/2019") };
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(1).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ toDate: "7/10/2019" });
    });

    it('handleSearch - should be called when click Search Button', () => {
        const event = {
            target: {
                checked: true,
                name: 'isGetAll'
            }
        };
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Input[type="checkbox"][name="isGetAll"]').simulate('change', event);
        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ fromDate: "01/01/2020", isGetAll: false, toDate: "3/12/2020", isBack: false, scrollTop: 0 });
    });
});