import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';

import { defaultPagingOption } from '../../../../../modules/constants';

describe('banner list - components - Filter ', () => {
    const deviceTypeList = [
        {
            key: 0, name: "PC / Laptop", checked: false
        },
        {
            key: 1, name: "Mobile", checked: false
        }
    ];

    const defaultProps = {
        pagingOption: defaultPagingOption,
        categoryList: [
            { categoryName: "Casino", key: "Casino", name: "Casino", checked: false },
            { categoryName: "Sportsbook", key: "Sportsbook", name: "Sportsbook", checked: false }
        ],
        subCategoryList: [
            { parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: false },
            { parentCategoryName: "Sportsbook", key: "Basketball", name: "Basketball", checked: false }
        ],
        subCategoryCasinoList: [
            { CategoryName: "Casino Bonus" },
            { CategoryName: "Slot" }
        ],
        subCategorySportsbookList: [
            { CategoryName: "Basketball" },
            { CategoryName: "SB Bonus" }
        ],
        languageList: [
            { LanguageName: "English" },
            { LanguageName: "Vietnamese" }
        ],
        currencyList: [
            { key: "EURO", name: "EURO", checked: false },
            { key: "VND", name: "VND", checked: false }
        ],
        imageTypeList: [
            { Id: 0, Name: "Image" },
            { Id: 1, Name: "Flash" }
        ],
        sizeList: [
            { key: "300x250", name: "300x250", checked: false },
            { key: "500x350", name: "500x350", checked: false }
        ],
        affTypeList: [
            { key: "Asian", name: "Asian", checked: false },
            { key: "Media", name: "Media", checked: false }
        ],
        deviceTypeList,
        paramFromHome: {
            IsFromHome: false
        }
    }

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it("render correctly with Casino's subcategory", () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ category: 'Casino' });

        expect(wrapper).toMatchSnapshot();
    });

    it("render correctly with Sportbook's subcategory", () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ category: 'Sportsbook' });

        expect(wrapper).toMatchSnapshot();
    });

    it('_handleSearch - should be called when click Search Button', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ "PageIndex": 1, "PageSize": 20, "affType": 2, "category": "", "currency": "", "deviceType": "", "language": "", "size": "", "subCategory": "", userType: 0 });
    });

    it('_handleChangeCategory - should change category when change category select', () => {
        const event = {
            target: { value: 'Casino' }
        };
        const props = Object.assign({}, defaultProps, { getSizeList: jest.fn() });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Input[type="select"][id="category"]').simulate('change', event);

        expect(wrapper.find('Input[type="select"][id="category"]').prop('value')).toEqual('Casino');
        expect(props.getSizeList).toHaveBeenCalledWith({ "affType": 2, "category": "Casino", "currency": "", "deviceType": "", "language": "", "size": "", "subCategory": "", userType: 0 });
    });

    it('_handleChangeCategory - should change category when change category select', () => {
        const event = {
            target: { value: 'Sportsbook' }
        };
        const props = Object.assign({}, defaultProps, { getSizeList: jest.fn() });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Input[type="select"][id="category"]').simulate('change', event);

        expect(wrapper.find('Input[type="select"][id="category"]').prop('value')).toEqual('Sportsbook');
        expect(props.getSizeList).toHaveBeenCalledWith({ "affType": 2, "category": "Sportsbook", "currency": "", "deviceType": "", "language": "", "size": "", "subCategory": "", userType: 0 });
    });

    it("_handleChange - should call setDisableCurrency, getCategoryList, getSizeList and setState", () => {
        const event = {
            target: { name: 'userType', value: '1' }
        };
        const props = Object.assign({}, defaultProps, { getSizeList: jest.fn(), setDisableCurrency: jest.fn(), getCategoryList: jest.fn() });
        const wrapper = shallow(<Filter {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleChange(event)

        expect(wrapper.setState).toHaveBeenCalledWith({ "affType": 2, "category": "", "currency": "", "deviceType": "", "language": "", "size": "", "subCategory": "", "userType": '1' });
        expect(props.setDisableCurrency).toHaveBeenCalledWith(false);
        expect(props.getCategoryList).toHaveBeenCalledWith('1');
        expect(props.getSizeList).toHaveBeenCalledWith({ "affType": 2, "category": "", "currency": "", "deviceType": "", "language": "", "size": "", "subCategory": "", "userType": '1' });
    });

    it("_handleChange - should call getSizeList and setState", () => {
        const event = {
            target: { name: 'currency', value: 'USD' }
        };
        const props = Object.assign({}, defaultProps, { getSizeList: jest.fn() });
        const wrapper = shallow(<Filter {...props} />);
        wrapper.setState = jest.fn();

        wrapper.instance()._handleChange(event)
        expect(wrapper.setState).toHaveBeenCalledWith({ "affType": 2, "category": "", "currency": "USD", "deviceType": "", "language": "", "size": "", "subCategory": "", "userType": 0 });
        expect(props.getSizeList).toHaveBeenCalledWith({ "affType": 2, "category": "", "currency": "USD", "deviceType": "", "language": "", "size": "", "subCategory": "", "userType": 0 });
    });

    it('setSize - should change category when change size select', () => {
        const event = {
            target: { value: '300x250' }
        };
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="select"][id="size"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ "size": "300x250" });
    });

    it('componentDidMount - should call setParamFromHome amd _handleSearch', () => {
        const props = Object.assign({}, defaultProps, { paramFromHome: { IsFromHome: true, UserType: 1 }, setParamFromHome: jest.fn(), setParam: jest.fn(), setDisableCurrency: jest.fn() });

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();

        instance.componentDidMount();

        expect(props.setParamFromHome).toHaveBeenCalledWith({ IsFromHome: false });
        expect(props.setParam).toHaveBeenCalledWith({ "PageIndex": 1, "PageSize": 20, "affType": 2, "category": "", "currency": "", deviceType: "", userType: 1, "language": "", "size": "", "subCategory": "" });
    });

    it('componentDidMount - should not call setParamFromHome and _handleSearch', () => {
        const props = Object.assign({}, defaultProps, { setParamFromHome: jest.fn(), setParam: jest.fn() });

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();

        instance.componentDidMount();

        expect(props.setParamFromHome).not.toHaveBeenCalled();
        expect(props.setParam).not.toHaveBeenCalled();
    });
})