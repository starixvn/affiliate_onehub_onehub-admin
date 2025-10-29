import React from 'react';
import { shallow } from 'enzyme';
import { Filter } from '../Filter';

import { DatePicker } from '@9softstudio/react-datepicker';
import MultipleSelect from '../../../../../components/multiple-select';

describe('transfer report - component - Filter - ', () => {
    const now = new Date('10/27/2021');

    const baseCurrencyList = [
        {
            ExchangeId: 20,
            Code: 'VND'
        }
    ]

    const defaultProps = {
        pagingOption: {
            PageIndex: 1,
            PageSize: 20,
            TotalItem: 0,
            PageList: [10, 20, 50, 100, 500]
        },
        today: now.getMonth() + '/' + now.getDate() + '/' + now.getFullYear(),
        param: {},
        baseCurrencyList
    };

    it('should call handlePressEnter when press Enter', () => {
        const mockedEvent = { charCode: 13, preventDefault: jest.fn() };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.handleClickSearch = jest.fn();

        instance.handlePressEnter(mockedEvent);

        expect(instance.handleClickSearch).toHaveBeenCalled();
    });

    it('not call handlePressEnter when press keyboard which is not Enter', () => {
        const mockedEvent = { charCode: 11 };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.handleClickSearch = jest.fn();

        instance.handlePressEnter(mockedEvent);

        expect(instance.handleClickSearch).not.toHaveBeenCalled();
    });

    it('should call setState when call handleChange', () => {
        const event = { target: { name: "userName", value: "abc" } }

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();

        instance.handleChange(event);

        expect(instance.setState).toHaveBeenCalledWith({ userName: event.target.value });
    });

    it('should call setState when call handleChangeTransId', () => {
        const event = { target: { value: "123" } }

        const props = { ...defaultProps, baseCurrencyList: [] }
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();

        instance.handleChangeTransId(event);

        expect(instance.setState).toHaveBeenCalledWith({ transId: '123' });
    });

    it('should not call setState when call handleChangeTransId', () => {
        const event = { target: { value: "123a" } }

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();

        instance.handleChangeTransId(event);

        expect(instance.setState).not.toHaveBeenCalled();
    });

    it('handleChangeFromDate - should be called when From > To', () => {
        const monthDate = { format: jest.fn(() => "10/27/2021") };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.setState = jest.fn(fn => (fn instanceof Function) && fn({ toDate: "10/01/2021" }));

        wrapper.find(DatePicker).at(0).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('handleChangeToDate - should be called when To < From', () => {
        const monthDate = { format: jest.fn(() => "10/01/2021") };
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn(fn => (fn instanceof Function) && fn({ fromDate: "10/27/2020" }));

        wrapper.find(DatePicker).at(1).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should call handleClickSearch when click Search button', () => {
        const props = Object.assign({}, defaultProps, { setParam: jest.fn(), setReportTitle: jest.fn() })

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();

        instance.handleClickSearch();

        expect(props.setReportTitle).toHaveBeenCalledWith('TRANSFER BALANCE FOR PLAYER REPORT - Base Currency VND - FROM 9/01/2021 TO 9/27/2021');
        expect(props.setParam).toHaveBeenCalled();
    });

    it('should call handleClickSearch when click Search button 2', () => {
        const props = Object.assign({}, defaultProps, { setParam: jest.fn(), setReportTitle: jest.fn() })

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.setState({ transId: 123, affName: 'aff', playerName: 'xyz' })

        instance.handleClickSearch();

        expect(props.setReportTitle).toHaveBeenCalledWith("TRANSFER BALANCE FOR PLAYER REPORT - Trans. Id '123'- Affiliate contains 'aff'- Player contains 'xyz'- Base Currency VND - FROM 9/01/2021 TO 9/27/2021");
        expect(props.setParam).toHaveBeenCalled();
    });

    it('should render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });
});