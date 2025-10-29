import React from 'react';
import { shallow } from 'enzyme';
import { Filter } from '../Filter';

import { DatePicker } from '@9softstudio/react-datepicker';
import MultipleSelect from '../../../../../components/multiple-select';

describe('player ggr report - component - Filter - ', () => {
    const now = new Date('10/27/2021');

    const baseCurrencyList = [
        {
            ExchangeId: 20,
            Code: 'VND'
        }
    ]

    const defaultProps = {
        productList: [],
        pagingOption: {
            PageIndex: 1,
            PageSize: 20,
            TotalItem: 0,
            PageList: [10, 20, 50, 100, 500]
        },
        today: now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear(),
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

    it('should call handleChangeProduct when change the selected product list', () => {
        const productList = [
            {
                key: 123,
                name: 'Test',
                checked: true
            },
            {
                key: 234,
                name: 'Abc',
                checked: true
            }
        ]
        const selectedProductList = '123';
        const props = { ...defaultProps, setProductList: jest.fn(), baseCurrencyList: [] };
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn(fn => fn && fn({ productList }));

        wrapper.find(MultipleSelect).simulate('change', null, selectedProductList);

        expect(instance.setState).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should call handleClickSearch when click Search button with select All product', () => {
        const productList = [
            {
                key: 123,
                name: 'Test',
                checked: true
            },
            {
                key: 234,
                name: 'Abc',
                checked: true
            }
        ]
        const props = Object.assign({}, defaultProps, { setParam: jest.fn(), productList, setReportTitle: jest.fn(), setProductList: jest.fn() })

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();

        instance.handleClickSearch();

        expect(props.setReportTitle).toHaveBeenCalledWith('PLAYER GGR REPORT  - All Products - FROM 10/01/2021 TO 10/27/2021 - Base Currency VND');
        expect(props.setParam).toHaveBeenCalled();
    });

    it('should call handleClickSearch when click Search button with not select All product', () => {
        const productList = [
            {
                key: 123,
                name: 'Test',
                checked: false
            },
            {
                key: 234,
                name: 'Abc',
                checked: true
            }
        ]
        const props = Object.assign({}, defaultProps, { setParam: jest.fn(), productList, setReportTitle: jest.fn(), setProductList: jest.fn() })

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.setState({ affName: 'aff', playerName: 'xyz', isFromAffReport: true });

        instance.handleClickSearch();

        expect(props.setReportTitle).toHaveBeenCalledWith("PLAYER GGR REPORT - Affiliate contains 'aff'- Player contains 'xyz' - Abc - FROM 10/01/2021 TO 10/27/2021 - Base Currency VND");
        expect(props.setParam).toHaveBeenCalled();
    });

    it('should render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call handleClickSearch', () => {
        document.cookie = 'paramFromAffReport={"affName":"12BETAFF001","baseCurrencyId":20,"fromDate":"10/1/2021","toDate":"10/1/2021","productIds":"1,2"}'

        const productList = [
            {
                key: 1,
                name: 'Test',
                checked: true
            },
            {
                key: 2,
                name: 'Abc',
                checked: true
            }
        ]

        const props = Object.assign({}, defaultProps, { setParam: jest.fn(), productList, setReportTitle: jest.fn(), setProductList: jest.fn() })
        shallow(<Filter {...props} />);

        expect(props.setReportTitle).toHaveBeenCalledWith("PLAYER GGR REPORT - Affiliate contains '12BETAFF001' - All Products - FROM 10/1/2021 TO 10/27/2021 - Base Currency VND");
        expect(props.setParam).toHaveBeenCalled();

        document.cookie = 'paramFromAffReport='
    });

    it('componentDidMount - should call handleClickSearch 2', () => {
        document.cookie = 'paramFromAffReport={"affName":"12BETAFF001","baseCurrencyId":20,"fromDate":"9/1/2021","toDate":"9/1/2021","productIds":"1,2"}'

        const productList = [
            {
                key: 1,
                name: 'Test',
                checked: true
            },
            {
                key: 2,
                name: 'Abc',
                checked: true
            }
        ]

        const props = Object.assign({}, defaultProps, { setParam: jest.fn(), productList, setReportTitle: jest.fn(), setProductList: jest.fn() })
        shallow(<Filter {...props} />);

        expect(props.setReportTitle).toHaveBeenCalledWith("PLAYER GGR REPORT - Affiliate contains '12BETAFF001' - All Products - FROM 9/1/2021 TO 9/30/2021 - Base Currency VND");
        expect(props.setParam).toHaveBeenCalled();

        document.cookie = 'paramFromAffReport='
    });
});