import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';
import { DatePicker } from '@9softstudio/react-datepicker';

describe('payment request - components - Filter ', () => {
    const defaultProps = {
        today: "6/27/2019",
        param: {}
    }

    const param = {
        FromDate: "6/25/2019",
        IsGetAll: false,
        PageIndex: 1,
        PageSize: 20,
        SearchBy: 2,
        Status: null,
        ToDate: "6/26/2019",
        Username: null
    }

    it('render correctly with SearchBy Username', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with SearchBy Others', () => {
        const props = Object.assign({}, defaultProps, { param })
        const result = shallow(<Filter {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call handleSearch', () => {
        const props = Object.assign({}, defaultProps, { setParam: jest.fn(), param: { IsFromHome: true } });

        shallow(<Filter {...props} />);

        expect(props.setParam).toHaveBeenCalledWith({ "FromDate": "6/26/2019", "IsFromHome": true, "IsGetAll": false, "SearchBy": 1, "Status": undefined, "ToDate": "6/27/2019", "Username": "" });
    });

    it('handleSearch - should be called when click Search Button', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ FromDate: "6/26/2019", IsGetAll: false, SearchBy: 1, Status: undefined, ToDate: "6/27/2019", Username: "" });
    });

    it("handleChange - should be called when change Search By's value", () => {
        const mockedEvent = { target: { name: 'searchBy', value: 1 } }
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="select"][name="searchBy"]').simulate('change', mockedEvent);

        expect(wrapper.state('searchBy')).toBe(1);
    });

    it('handlePressEnter - should call hanldeSearch when press Enter', () => {
        const mockedEvent = { charCode: 13, preventDefault: jest.fn() };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.handleSearch = jest.fn();

        wrapper.find('Input[type="text"][name="userName"]').simulate('keyPress', mockedEvent);

        expect(instance.handleSearch).toHaveBeenCalled();
    });

    it('handlePressEnter - should not call hanldeSearch when press other keyboards', () => {
        const mockedEvent = { charCode: 123 };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();
        instance.handleSearch = jest.fn();

        wrapper.find('Input[type="text"][name="userName"]').simulate('keyPress', mockedEvent);

        expect(instance.handleSearch).not.toHaveBeenCalled();
    });

    it("handleChange - should be called when change Status's value", () => {
        const mockedEvent = { target: { name: 'status', value: 1 } }
        const props = Object.assign({}, defaultProps, { param })
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Input[type="select"][name="status"]').simulate('change', mockedEvent);

        expect(wrapper.state('status')).toBe(1);
    });

    it('handleChange - should be called when click checkbox Get All', () => {
        const event = { target: { type: 'checkbox', name: 'isGetAll', checked: true } }
        const props = Object.assign({}, defaultProps, { param })
        const wrapper = shallow(<Filter {...props} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="checkbox"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ isGetAll: true });
    });

    it('handleChangeFromDate - should be called when From change', () => {
        const monthDate = { format: jest.fn(() => "6/25/2019") };
        const props = Object.assign({}, defaultProps, { param })
        const wrapper = shallow(<Filter {...props} />);

        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(0).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ fromDate: "6/25/2019", toDate: "6/27/2019" });
    });

    it('handleChangeToDate - should be called when To change', () => {
        const monthDate = { format: jest.fn(() => "6/26/2019") };
        const props = Object.assign({}, defaultProps, { param })
        const wrapper = shallow(<Filter {...props} />);

        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(1).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ toDate: "6/26/2019" });
    });
})