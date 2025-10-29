import React from 'react';
import { shallow } from 'enzyme';
import { Filter } from '../Filter';
import { statusFilter } from '../../libs/constants';

import MonthPicker from '@9softstudio/react-monthpicker';
import MultipleSelect from '../../../../../components/multiple-select';

describe('affiliate report - Filter ', () => {
    const mainView = 1;
    const monthOnMonth = 2;
    const now = new Date('12/24/2018');
    const isCheckedAllProduct = true;
    const fromMonth = {
        month: now.getMonth(),
        year: now.getFullYear()
    };

    const baseCurrencyList = [
        {
            ExchangeId: 20,
            Code: 'VND'
        }
    ]

    const currencyList = [
        {
            key: 20,
            name: 'UUS',
            checked: true
        }
    ]

    const commGroupList = [
        { key: 1, name: 'Abc', checked: true }
    ]

    const paymentCurrencyList = [
        {
            key: 21,
            name: 'MYR',
            checked: true
        }
    ]

    const earningByList = {
        All: 'all',
        Winloss: 'Winloss',
        Turnover: 'Turnover'
    };

    const defaultProps = {
        productList: [],
        pagingOption: {
            PageIndex: 1,
            PageSize: 20,
            TotalItem: 0,
            PageList: [10, 20, 50, 100, 500]
        },
        languageList: {},
        today: now.getMonth() + '/' + now.getDate() + '/' + now.getFullYear(),
        currentViewLevel: mainView,
        param: {},
        selectedEarning: 'all',
        currencyList,
        commGroupList,
        baseCurrencyList,
        paymentCurrencyList,
        selectedStatus: statusFilter.Approved,
        earningByList
    };

    it('componentDidUpdate - should call setParam, setState and setReportTitle when currentViewLevel change to Main view', () => {
        const cachedMainReportParam = {
            UserName: '',
            PreferredLanguage: '',
            FromDate: '12/24/2018',
            ToDate: '12/24/2018',
            SortType: 1,
            SortDirectionType: '',
            ProductIds: '1,2',
            BaseCurrencyId: "",
            CurrencyIds: "",
            PaymentCurrencyIds: "",
            GroupIds: ""
        };
        const state = {
            userName: '',
            selectedLanguage: '',
            fromMonth: { month: now.getMonth() + 1, year: now.getFullYear() },
            toMonth: { month: now.getMonth() + 1, year: now.getFullYear() },
            sortBy: 1,
            isSortAscending: false,
            selectedProductList: '1,2',
            isGetAll: false,
            isExcludeNegvBBF: false,
            isExcludeNegvCurrentBBF: false,
            isCheckedDatePicker: false,
            selectedBaseCurrency: "",
            selectedCurrencyList: "",
            selectedPaymentCurrencyList: "",
            selectedCommGroupList: ""
        };

        const props = Object.assign({}, defaultProps, { setParam: jest.fn() });
        const componentInstance = new Filter(props);

        componentInstance.cachedMainReportParam = cachedMainReportParam;
        componentInstance.setState = jest.fn();
        componentInstance._updateReportTitle = jest.fn();
        componentInstance.componentDidUpdate({ currentViewLevel: monthOnMonth });

        expect(componentInstance.setState.mock.calls[0][0]).toEqual(state);
        componentInstance.setState.mock.calls[0][1]();

        expect(componentInstance._updateReportTitle).toHaveBeenCalled();
        expect(props.setParam).toHaveBeenCalledWith(componentInstance.cachedMainReportParam);
    });

    it('componentDidUpdate - should call setParam, setState and setReportTitle when currentViewLevel change to Month on Month view', () => {
        const state = {
            userName: 'Month on Month view',
            sortBy: 1,
            isSortAscending: false,
            isCheckedDatePicker: false
        };
        const selectedProductList = '1,2';
        const productList = [
            { key: 1, name: 'test', checked: true },
            { key: 2, name: 'abc', checked: false },
        ];
        const props = Object.assign({}, defaultProps, { productList, param: { UserName: 'Month on Month view' }, currentViewLevel: monthOnMonth });

        const componentInstance = new Filter(props);
        componentInstance.state.selectedProductList = selectedProductList;

        componentInstance.setState = jest.fn();
        componentInstance._updateReportTitle = jest.fn();
        componentInstance.componentDidUpdate({ currentViewLevel: mainView });

        expect(componentInstance.setState.mock.calls[0][0]).toEqual(state);
        componentInstance.setState.mock.calls[0][1]();

        expect(componentInstance._updateReportTitle).toHaveBeenCalled();
    });

    it('_isMainView - return true with Main view', () => {
        const componentInstance = new Filter(defaultProps);
        const result = componentInstance._isMainView();

        expect(result).toBeTruthy();
    });

    it('_isMainView - return true with Month on Month view', () => {
        const props = Object.assign({}, defaultProps, { currentViewLevel: monthOnMonth })
        const componentInstance = new Filter(props);
        const result = componentInstance._isMainView();

        expect(result).toBeFalsy();
    });

    it('should call handlePressEnter when press Enter', () => {
        const mockedEvent = { charCode: 13, preventDefault: jest.fn() };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.handleClickSearch = jest.fn();

        wrapper.find('Input[type="text"][id="Affiliate"]').simulate('keyPress', mockedEvent);

        expect(instance.handleClickSearch).toHaveBeenCalled();
    });

    it('not call handlePressEnter when press keyboard which is not Enter', () => {
        const mockedEvent = { charCode: 11 };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.handleClickSearch = jest.fn();

        wrapper.find('Input[type="text"][id="Affiliate"]').simulate('keyPress', mockedEvent);

        expect(instance.handleClickSearch).not.toHaveBeenCalled();
    });

    it('should call handleChangeAffiliate when Affiliate change', () => {
        const event = { target: { name: "userName", value: "abc" } }

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();

        wrapper.find('Input[type="text"][id="Affiliate"]').simulate('change', event);

        expect(instance.setState).toHaveBeenCalledWith({ userName: event.target.value });
    });

    it('should call handleChangeLanguage when Language change', () => {
        const event = { target: { name: 'selectedLanguage', value: "English" } }

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();

        wrapper.find('Input[type="select"][name="selectedLanguage"]').simulate('change', event);

        expect(instance.setState).toHaveBeenCalledWith({ selectedLanguage: event.target.value });
    });

    it('should call handleSelectFromMonth when From Month change with correct parameters currentMainView is Main view', () => {
        const toMonthRange = {
            min: { month: now.getMonth(), year: now.getFullYear() },
            max: { month: now.getMonth(), year: now.getFullYear() }
        };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();
        instance._getToMonthRange = jest.fn(() => toMonthRange);

        wrapper.find(MonthPicker).at(0).simulate('select', now.getMonth(), now.getFullYear());

        expect(instance._getToMonthRange).toHaveBeenCalledWith(fromMonth);
        expect(instance.setState).toHaveBeenCalledWith({ fromMonth });
    });

    it('should call handleSelectFromMonth when From Month change with incorrect parameters pacurrentMainView is Main view', () => {
        const toMonthRange = {
            min: { month: now.getMonth() + 1, year: now.getFullYear() },
            max: { month: now.getMonth(), year: now.getFullYear() }
        };

        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();
        instance._getToMonthRange = jest.fn(() => toMonthRange);

        wrapper.find(MonthPicker).at(0).simulate('select', now.getMonth(), now.getFullYear());

        expect(instance._getToMonthRange).toHaveBeenCalledWith(fromMonth);
        expect(instance.setState).toHaveBeenCalledWith({ fromMonth, toMonth: fromMonth });
    });

    it('should call handleSelectFromMonth when From Month change with currentMainView is Month on Month view', () => {
        const props = Object.assign({}, defaultProps, { currentViewLevel: monthOnMonth })
        const wrapper = shallow(<Filter {...props} />);

        wrapper.setState = jest.fn();

        wrapper.find(MonthPicker).at(0).simulate('select', now.getMonth(), now.getFullYear());

        expect(wrapper.setState).toHaveBeenCalledWith({ fromMonth });
    });

    it('should call handleSelectToMonth when To Month change', () => {
        const toMonth = {
            month: now.getMonth(),
            year: now.getFullYear()
        };
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();

        wrapper.find(MonthPicker).at(1).simulate('select', now.getMonth(), now.getFullYear());

        expect(instance.setState).toHaveBeenCalledWith({ toMonth });
    });

    it('should call handleChangeCurrency when change the selected currency list', () => {
        const item = {
            key: 20,
            name: 'UUS',
            checked: true
        };
        const selectedCurrencyList = '20';
        const props = { ...defaultProps, setCurrencyList: jest.fn() }
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();

        instance.handleChangeCurrency(item, selectedCurrencyList);

        expect(instance.setState).toHaveBeenCalledWith({ selectedCurrencyList });
        expect(props.setCurrencyList).toHaveBeenCalledWith([item]);
    });

    it('should call handleChangeProduct when change the selected product list', () => {
        const item = {
            Checked: false,
            ProductId: 1,
            ProductName: "Sportsbook"
        };
        const selectedProductList = '3,4,5,6,7,8,9,12';
        const props = { ...defaultProps, setProductList: jest.fn() };
        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();

        wrapper.find(MultipleSelect).at(2).simulate('change', item, selectedProductList);

        expect(instance.setState).toHaveBeenCalledWith({ selectedProductList });
        expect(props.setProductList).toHaveBeenCalled();
    });

    it('should call handleChangeSortAscending when checkbox Get All change with currentMainView is Main view', () => {
        const event = { target: { name: "isGetAll" } };
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ isGetAll: true });

        wrapper.find('Input[type="checkbox"]').at(0).simulate('change', event);

        expect(wrapper.state('isGetAll')).toEqual(false);
    });

    it('should call handleChangeSortBy when Sort By change', () => {
        const event = { target: { name: "sortBy", value: 2 } };
        const wrapper = shallow(<Filter {...defaultProps} />);
        const instance = wrapper.instance();

        instance.setState = jest.fn();

        wrapper.find('Input[type="select"][id="SortBy"]').simulate('change', event);

        expect(instance.setState).toHaveBeenCalledWith({ sortBy: event.target.value });
    });

    it('should call handleChangeGetAll when checkbox A-Z change', () => {
        const event = { target: { name: "isSortAscending" } };
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ isSortAscending: true });

        wrapper.find('Input[type="checkbox"]').at(1).simulate('change', event);

        expect(wrapper.state('isSortAscending')).toEqual(false);
    });

    it('should call handleClickSearch when click Search button with selectedProductList is empty', () => {
        const props = Object.assign({}, defaultProps, { setParam: jest.fn() })

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();

        wrapper.setState({ selectedProductList: '' });
        instance._updateReportTitle = jest.fn();

        wrapper.find('Button').simulate('click');

        expect(instance._updateReportTitle).not.toHaveBeenCalled();
        expect(props.setParam).not.toHaveBeenCalled();
    });

    it('should call handleClickSearch when click Search button with currentMainView is Main view', () => {
        const param = {
            BaseCurrencyId: 20,
            CurrencyIds: '20',
            Statuses: 'Approved',
            UserName: '',
            FromDate: now.getMonth() + '/1/' + now.getFullYear(),
            ToDate: now.getMonth() + '/1/' + now.getFullYear(),
            PreferredLanguage: '',
            ProductIds: '1,2',
            SortType: 1,
            SortDirectionType: 0,
            PageIndex: 1,
            PageSize: 20,
            GroupIds: 'all',
            IsGetMonthly: true,
            IsExcludeNegvBBF: false,
            IsExcludeNegvCurrentBBF: false,
            PaymentCurrencyIds: "21",
            IsGetAll: false
        };

        const props = Object.assign({}, defaultProps, { setParam: jest.fn(), setIsCheckedDatePicker: jest.fn() })

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.setState({ selectedProductList: '1,2' });

        instance._updateReportTitle = jest.fn();
        instance._isMainView = jest.fn(() => true);

        wrapper.find('Button').simulate('click');

        expect(instance._updateReportTitle).toHaveBeenCalledWith();
        expect(instance._isMainView).toHaveBeenCalled();
        expect(instance.cachedMainReportParam).toEqual(param);
        expect(props.setParam).toHaveBeenCalledWith(param);
    });

    it('should call handleClickSearch when click Search button with currentMainView is Month on Month view', () => {
        const param = {
            BaseCurrencyId: 20,
            CurrencyIds: '20',
            Statuses: 'Approved',
            UserName: '',
            FromDate: now.getMonth() + '/1/' + now.getFullYear(),
            ToDate: now.getMonth() + '/1/' + now.getFullYear(),
            PreferredLanguage: '',
            ProductIds: '1,2',
            SortType: 1,
            SortDirectionType: 1,
            PageIndex: 1,
            PageSize: 20,
            GroupIds: 'all',
            IsGetMonthly: true,
            IsExcludeNegvBBF: false,
            IsExcludeNegvCurrentBBF: false,
            PaymentCurrencyIds: "21",
            IsGetAll: false
        };
        const selectedProductList = '1,2';
        const productList = [
            { key: 1, name: 'abc', checked: true },
            { key: 2, name: 'xyz', checked: true }
        ];
        const props = Object.assign({}, defaultProps, { productList, setParam: jest.fn(), currentViewLevel: monthOnMonth })

        const wrapper = shallow(<Filter {...props} />);
        wrapper.setState({ selectedProductList, isSortAscending: false });
        const instance = wrapper.instance();

        instance._updateReportTitle = jest.fn();
        instance._isMainView = jest.fn(() => false);

        wrapper.find('Button').simulate('click');

        expect(instance._updateReportTitle).toHaveBeenCalled();
        expect(instance._isMainView).toHaveBeenCalled();
        expect(instance.cachedMainReportParam).toBeNull;
        expect(props.setParam).toHaveBeenCalledWith(param);
    });

    it('should call handleClickSearch when click Search button with selectedProductList not equal productList', () => {
        const param = {
            BaseCurrencyId: 20,
            CurrencyIds: '20',
            Statuses: 'Approved',
            UserName: '',
            FromDate: now.getMonth() + '/1/' + now.getFullYear(),
            ToDate: now.getMonth() + '/1/' + now.getFullYear(),
            PreferredLanguage: '',
            ProductIds: '1,2',
            SortType: 1,
            SortDirectionType: 1,
            PageIndex: 1,
            PageSize: 20,
            GroupIds: 'all',
            IsGetMonthly: true,
            IsExcludeNegvBBF: false,
            IsExcludeNegvCurrentBBF: false,
            PaymentCurrencyIds: "21",
            IsGetAll: false
        };
        const selectedProductList = '1,2';
        const productList = [
            { key: 1, name: 'test', checked: true },
            { key: 2, name: 'abc', checked: true },
            { key: 3, name: 'xyz', checked: true },
        ];
        const props = Object.assign({}, defaultProps, { productList, setParam: jest.fn(), currentViewLevel: monthOnMonth })

        const wrapper = shallow(<Filter {...props} />);
        wrapper.setState({ selectedProductList, isSortAscending: false });
        const instance = wrapper.instance();

        instance._updateReportTitle = jest.fn();
        instance._isMainView = jest.fn(() => false);

        wrapper.find('Button').simulate('click');

        expect(instance._updateReportTitle).toHaveBeenCalled();
        expect(instance._isMainView).toHaveBeenCalled();
        expect(instance.cachedMainReportParam).toBeNull;
        expect(props.setParam).toHaveBeenCalledWith(param);
    });

    it('_updateReportTitle - return Main Report Title with correct parameter and currentMainView is Main view', () => {
        const props = { ...defaultProps, setReportTitle: jest.fn() };
        const componentInstance = new Filter(props);
        componentInstance._isMainView = jest.fn(() => true);

        componentInstance._updateReportTitle();

        expect(componentInstance._isMainView).toHaveBeenCalled();
        expect(props.setReportTitle).toHaveBeenCalledWith('AFFILIATE REPORT - Base Currency VND - All Linked Acc. Currencies - All languages - All Products - All Revenue Group - Approved - FROM 11/2018 TO 11/2018');
    });

    it('_updateReportTitle - return Main Report Title with correct parameter and currentMainView is Month on Month view', () => {
        const props = Object.assign({}, defaultProps, { currentViewLevel: monthOnMonth, setReportTitle: jest.fn() });
        const componentInstance = new Filter(props);
        componentInstance._isMainView = jest.fn(() => false);

        componentInstance._updateReportTitle();

        expect(componentInstance._isMainView).toHaveBeenCalled();
        expect(props.setReportTitle).toHaveBeenCalledWith('MONTH ON MONTH - Base Currency VND - All Products - FROM 11/2018 TO 11/2018');
    });

    it('_buildMainReportTitle - return corrected value with correct parameter', () => {
        const componentInstance = new Filter(defaultProps);

        const result = componentInstance._buildMainReportTitle(isCheckedAllProduct);

        expect(result).toEqual('AFFILIATE REPORT - Base Currency VND - All Linked Acc. Currencies - All languages - All Products - All Revenue Group - Approved - FROM ' + now.getMonth() + '/' + now.getFullYear() + ' TO ' + now.getMonth() + '/' + now.getFullYear());
    });

    it('_buildMainReportTitle - return corrected value with incorrect parameter', () => {
        const productList = [
            { key: 1, name: 'Sportsbook', checked: true },
            { key: 2, name: 'abc', checked: false },
            { key: 3, name: 'xyz', checked: false },
        ];
        const props = { ...defaultProps, productList }
        const componentInstance = new Filter(props);
        componentInstance.state.userName = 'Bwing';
        componentInstance.state.selectedCommGroup = 1;

        const result = componentInstance._buildMainReportTitle(!isCheckedAllProduct);

        expect(result).toEqual("AFFILIATE REPORT - Affiliate contains 'Bwing' - Base Currency VND - All Linked Acc. Currencies - All languages - Sportsbook - All Revenue Group - Approved - FROM " + now.getMonth() + '/' + now.getFullYear() + ' TO ' + now.getMonth() + '/' + now.getFullYear());
    });

    it('_buildMonthOnMonthReportTile - return corrected value with correct parameter', () => {
        const componentInstance = new Filter(defaultProps);

        const result = componentInstance._buildMonthOnMonthReportTile(isCheckedAllProduct);

        expect(result).toEqual('MONTH ON MONTH - Base Currency VND - All Products - FROM ' + now.getMonth() + '/' + now.getFullYear() + ' TO ' + now.getMonth() + '/' + now.getFullYear());
    });

    it('_buildMonthOnMonthReportTile - return corrected value with incorrect parameter', () => {
        const productList = [
            { key: 1, name: "Sportsbook", checked: true },
            { key: 2, name: "Abc", checked: false }
        ]

        const props = { ...defaultProps, productList }
        const componentInstance = new Filter(props);
        componentInstance.state.userName = 'Bwing';
        componentInstance.state.isGetAll = true;

        const result = componentInstance._buildMonthOnMonthReportTile(!isCheckedAllProduct);

        expect(result).toEqual('MONTH ON MONTH - Bwing - Base Currency VND - Sportsbook - Get All Dates');
    });


    it('_getToMonthRange - return corrected value with correct parameter and currentMainView is Main view', () => {
        const toMonthRange = {
            min: { month: 1, year: 2018 },
            max: { month: 6, year: 2018 }
        };

        const componentInstance = new Filter(defaultProps);

        const result = componentInstance._getToMonthRange({ month: 1, year: 2018 });

        expect(result).toEqual(toMonthRange);
    });

    it('_getToMonthRange - return corrected value with maxToYear is nowYear, actualMaxMonth bigger nowMonth and currentMainView is Main view', () => {
        const date = new Date('5/24/2018');
        const today = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
        const toMonthRange = {
            min: { month: 2, year: 2018 },
            max: { month: 4, year: 2018 }
        };
        const props = Object.assign({}, defaultProps, { today })
        const componentInstance = new Filter(props);

        const result = componentInstance._getToMonthRange({ month: 2, year: 2018 });

        expect(result).toEqual(toMonthRange);
    });

    it('_getToMonthRange - return corrected value with correct parameter and currentMainView is Month on Month view', () => {
        const toMonthRange = {
            min: { month: 1, year: 2018 },
            max: { month: now.getMonth(), year: now.getFullYear() }
        };

        const props = Object.assign({}, defaultProps, { currentViewLevel: monthOnMonth });
        const componentInstance = new Filter(props);

        const result = componentInstance._getToMonthRange({ month: 1, year: 2018 });

        expect(result).toEqual(toMonthRange);
    });

    it('should render correctly when currentMainView is Main view', () => {
        const languageList = [{ English: 'English' }];
        const props = Object.assign({}, defaultProps, { languageList });
        const result = shallow(<Filter {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('should render correctly when currentMainView is Month on Month view', () => {
        const props = Object.assign({}, defaultProps, { currentViewLevel: monthOnMonth });
        const result = shallow(<Filter {...props} />);

        expect(result).toMatchSnapshot();
    });
});