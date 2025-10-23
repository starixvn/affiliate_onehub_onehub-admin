import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';
import { DatePicker } from '@9softstudio/react-datepicker';
import { defaultPagingOption } from '../../../../modules/constants';

describe('email history - components - Filter ', () => {
    const defaultProps = {
        today: "6/28/2019",
        pagingOption: defaultPagingOption
    }

    it('render correctly with SearchBy All', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with SearchBy Sender', () => {
        const event = { target: { name: 'searchBy', value: 1 } }
        const result = shallow(<Filter {...defaultProps} />);
        result.setState({ SearchById: 1 });

        result.find('Input[type="select"][name="searchBy"]').simulate('change', event);

        expect(result).toMatchSnapshot();
    });

    it('handleSearch - should be called when click Search Button', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ FromDate: "6/28/2019", IsGetAll: true, PageIndex: 1, PageSize: 20, SearchById: 0, SearchText: "", ToDate: "6/28/2019" });
    });

    it("should call handleChange when change Search By's value", () => {
        const mockedEvent = { target: { name: 'searchBy', value: 1 } }
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="select"][name="searchBy"]').simulate('change', mockedEvent);

        expect(wrapper.state('searchBy')).toBe(1);
    });

    it("should call handleChange when change Search Text's value", () => {
        const eventSearchBy = { target: { name: 'searchBy', value: 1 } }
        const eventSearchText = { target: { name: 'searchText', value: 'abc' } }
        const wrapper = shallow(<Filter {...defaultProps} />);


        wrapper.find('Input[type="select"][name="searchBy"]').simulate('change', eventSearchBy);
        wrapper.find('Input[type="text"][name="searchText"]').simulate('change', eventSearchText);

        expect(wrapper.state('searchText')).toEqual('abc');
    });

    it('handlePressEnter - should call hanldeSearch when press Enter', () => {
        const eventSearchBy = { target: { name: 'searchBy', value: 1 } }
        const eventSearchText = { charCode: 13, preventDefault: jest.fn() };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.handleSearch = jest.fn();

        wrapper.find('Input[type="select"][name="searchBy"]').simulate('change', eventSearchBy);
        wrapper.find('Input[type="text"][name="searchText"]').simulate('keyPress', eventSearchText);

        expect(instance.handleSearch).toHaveBeenCalled();
    });

    it('handlePressEnter - should not call hanldeSearch when press other keyboards', () => {
        const eventSearchBy = { target: { name: 'searchBy', value: 1 } }
        const eventSearchText = { charCode: 123 };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.handleSearch = jest.fn();

        wrapper.find('Input[type="select"][name="searchBy"]').simulate('change', eventSearchBy);
        wrapper.find('Input[type="text"][name="searchText"]').simulate('keyPress', eventSearchText);

        expect(instance.handleSearch).not.toHaveBeenCalled();
    });

    it('should call handleChange when click checkbox All Date', () => {
        const event = { target: { type: 'checkbox', name: 'isGetAll', checked: true }}
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="checkbox"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ isGetAll: true });
    });

    it('should call handleChangeFromDate when From change', () => {
        const monthDate = { format: jest.fn(() => "6/25/2019")};
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.setState = jest.fn(fn => fn && fn({toDate: "6/28/2019" }));

        wrapper.find(DatePicker).at(0).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should call handleChangeToDate when To change', () => {
        const monthDate = { format: jest.fn(() => "6/26/2019")};
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(1).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ toDate: "6/26/2019" });
    });
})