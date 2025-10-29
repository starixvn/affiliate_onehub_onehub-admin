import React from 'react';
import { shallow } from 'enzyme';
import { Filter } from '../Filter';
import MultipleSelect from '../../../../components/multiple-select';

describe('affiliate info - Filter ', () => {
    const targetCountryList = {
        'MY': 'Malaysia',
        'TH': 'Thailand',
        'CN': 'China'
    };

    const defaultProps = {
        languageList: {},
        targetCountryList,
        commGroupList: [{ key: 1, name: 'Abc', checked: true }],
        param: {},
        groupId: 0,
        columnList: []
    };

    it('componentDidMount - should call handleClickSearch if initial group Id different 0', () => {
        const mockSetReportTitle = jest.fn();
        const mockSetParam = jest.fn();
        const props = Object.assign({}, defaultProps, { groupId: 123, setReportTitle: mockSetReportTitle, setParam: mockSetParam });
        const componentInstance = new Filter(props);
        componentInstance.handleClickSearch = jest.fn();
        componentInstance.componentDidMount();

        expect(componentInstance.handleClickSearch).toHaveBeenCalled();
    });


    it("should call handleChange when change Username's value", () => {
        const mockedEvent = { target: { name: 'userName', value: "abc" } }

        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="text"][id="username"]').simulate('change', mockedEvent);

        expect(wrapper.state('userName')).toEqual("abc");
    });

    it("should call handleChange when change Email's value", () => {
        const mockedEvent = { target: { name: 'email', value: "abc@gmail.com" } }

        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="email"][id="email"]').simulate('change', mockedEvent);

        expect(wrapper.state('email')).toEqual("abc@gmail.com");
    });

    it("should call handleChange when change Search By's value", () => {
        const props = { ...defaultProps, setCommGroupList: jest.fn() };
        const wrapper = shallow(<Filter {...props} />);
        wrapper.setState = jest.fn();

        wrapper.find(MultipleSelect).at(0).props().onChange([{ key: 1, name: 'Abc', checked: false }], '1');

        expect(wrapper.setState).toHaveBeenCalledWith({ selectedCommGroupList: '1' });
        expect(props.setCommGroupList).toHaveBeenCalledWith([{ "checked": true, "key": 1, "name": "Abc" }]);
    });

    it("should call handleChange when change Language's value", () => {
        const mockedEvent = { target: { name: 'language', value: 'English' } }
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="select"][id="language"]').simulate('change', mockedEvent);

        expect(wrapper.state('language')).toEqual('English');
    });

    it("should call handleChange when change Status's value", () => {
        const mockedEvent = { target: { name: 'status', value: 'Username' } }
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="select"][id="status"]').simulate('change', mockedEvent);

        expect(wrapper.state('status')).toEqual('Username');
    });

    it("should call handleChange when change Sort By's value", () => {
        const mockedEvent = { target: { name: 'sortBy', value: 'Favorite' } }
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="select"][id="SortBy"]').simulate('change', mockedEvent);

        expect(wrapper.state('sortBy')).toEqual('Favorite');
    });

    it('should call handlePressEnter when press Enter', () => {
        const mockedEvent = { charCode: 13, preventDefault: jest.fn() };
        const mockSetReportTitle = jest.fn();
        const mockSetParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setReportTitle: mockSetReportTitle, setParam: mockSetParam });

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.handleClickSearch = jest.fn();

        wrapper.find('Input[type="text"][id="parentAffName"]').simulate('keyPress', mockedEvent);
        wrapper.find('Input[type="text"][id="username"]').simulate('keyPress', mockedEvent);
        wrapper.find('Input[type="email"][id="email"]').simulate('keyPress', mockedEvent);
        wrapper.find('Input[type="text"][id="affCode"]').simulate('keyPress', mockedEvent);

        expect(instance.handleClickSearch).toHaveBeenCalled();
    });

    it('should call handlePressEnter when press keyboard different Enter', () => {
        const mockedEvent = { charCode: 11 };
        const mockSetReportTitle = jest.fn();
        const mockSetParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setReportTitle: mockSetReportTitle, setParam: mockSetParam });

        const wrapper = shallow(<Filter {...props} />);
        const instance = wrapper.instance();
        instance.handleClickSearch = jest.fn();

        wrapper.find('Input[type="text"][id="parentAffName"]').simulate('keyPress', mockedEvent);
        wrapper.find('Input[type="text"][id="username"]').simulate('keyPress', mockedEvent);
        wrapper.find('Input[type="email"][id="email"]').simulate('keyPress', mockedEvent);
        wrapper.find('Input[type="text"][id="affCode"]').simulate('keyPress', mockedEvent);

        expect(instance.handleClickSearch).not.toHaveBeenCalled();
    });

    it('should call handleChangeSortAscending when click checkbox A-Z', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ isSortAscending: true });

        wrapper.find('Input[type="checkbox"]').at(0).simulate('change');

        expect(wrapper.state('isSortAscending')).toEqual(false);
    });

    it('should call handleClickSearch when click search button', () => {
        const mockSetReportTitle = jest.fn();
        const mockSetParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setReportTitle: mockSetReportTitle, setParam: mockSetParam });

        const wrapper = shallow(<Filter {...props} />);
        wrapper.find('Button').simulate('click');

        const reportTitle = 'AFFILIATE REPORT - ALL REVENUE GROUPS - ALL TARGET COUNTRIES - ALL LANGUAGES - ALL STATUSES';
        const param = {
            AffCategoryIds: '1',
            AffCode: '',
            AffPlayer: '',
            Email: '',
            GroupIds: 'all',
            Language: '',
            "ParentAffName": "",
            "SortBy": 1,
            "SortDirectionType": false,
            "Status": "",
            "TargetCountryCode": "",
            "UserName": "",
        }
        expect(props.setReportTitle).toHaveBeenCalledWith(reportTitle);
        expect(props.setParam).toHaveBeenCalledWith(param);
    });

    it('should call handleChangeColumn when change Displayed Columns', () => {
        const mockItem = { columnKey: "Status", columnName: "Status", checked: false };
        const mockColumnList = [
            { columnKey: "Index", columnName: "#", checked: true },
            { columnKey: "Status", columnName: "Status", checked: true },
            { columnKey: "FirstName", columnName: "First Name", checked: true }];
        const mockSelectedColumn = 'Index,FirstName';

        const expectedResult = [
            { columnKey: "Index", columnName: "#", checked: true },
            { columnKey: "Status", columnName: "Status", checked: false },
            { columnKey: "FirstName", columnName: "First Name", checked: true }];

        const mockSetSelectedColumn = jest.fn();
        const props = Object.assign({}, defaultProps, { setSelectedColumn: mockSetSelectedColumn, columnList: mockColumnList });

        const wrapper = shallow(<Filter {...props} />);

        wrapper.find(MultipleSelect).at(1).props().onChange(mockItem, mockSelectedColumn);

        expect(props.setSelectedColumn).toHaveBeenCalledWith(expectedResult);
    });

    it('buildReportTitle - should return correct string with parameters are empty', () => {
        const componentInstance = new Filter(defaultProps);
        const result = componentInstance._buildReportTitle('', '', '', '', '', '', '', true);

        expect(result).toEqual('AFFILIATE REPORT - ALL REVENUE GROUPS - ALL TARGET COUNTRIES - ALL LANGUAGES - ALL STATUSES');
    });

    it('buildReportTitle - should return correct string with correct parameter', () => {
        const componentInstance = new Filter(defaultProps);
        const result = componentInstance._buildReportTitle('', '', '', '12BETAFF001', 'walter.tran1@starixsoft.com', 927841, 'test01', true);

        expect(result).toEqual(`AFFILIATE REPORT - ALL REVENUE GROUPS - ALL TARGET COUNTRIES - ALL LANGUAGES - ALL STATUSES - USERNAME CONTAINS '12BETAFF001' - EMAIL CONTAINS 'walter.tran1@starixsoft.com' - AFFILIATE CODE '927841' - AFFILIATE PLAYER CONTAINS 'test01'`);
    });

    it('should render correctly', () => {
        const props = Object.assign({}, defaultProps, {
            languageList: { 133: 'NewGroup' }
        });

        const result = shallow(<Filter {...props} />);

        expect(result).toMatchSnapshot();
    });
})