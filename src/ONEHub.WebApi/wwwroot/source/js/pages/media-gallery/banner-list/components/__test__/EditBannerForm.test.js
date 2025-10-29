import React from 'react';
import { EditBannerForm } from '../EditBannerForm';
import { shallow } from 'enzyme';
import InputFile from '../../../../common/components/InputFile';
import NotificationPopup from '../../../../common/components/NotificationPopup';

describe('banner list - components - EditBannerForm ', () => {
    const bannerInfo = {
        BannerId: 2485,
        Categories: ["Casino"],
        SubCategories: ["Baccarat"],
        Currencies: ["EURO"],
        DeviceTypes: ["1"],
        AffTypes: ["2"],
        FileName: "CategoryMedia/giphy.gif",
        ImageType: "Image",
        Language: "Chinese Simplified",
        Size: "500x500",
        UserType: 1
    };

    const param = {
        AffType: 2,
        Category: "",
        Currency: "",
        DeviceType: 0,
        ImageType: "",
        Language: "",
        PageIndex: 1,
        PageSize: 20,
        Size: "",
        SubCategory: "",
        userType: ''
    };
    const deviceTypeList = [
        {
            key: 0, name: "PC / Laptop", checked: true
        },
        {
            key: 1, name: "Mobile", checked: true
        }
    ];

    const defaultProps = {
        selectedBannerId: 0,
        param,
        playerCategoryList: [
            { categoryName: "Casino", key: "Casino", name: "Casino", checked: true },
            { categoryName: "Sportsbook", key: "Sportsbook", name: "Sportsbook", checked: true }
        ],
        subAffiliateCategoryList: [
            { categoryName: "Sign up", key: "Sign up", name: "Sign up", checked: true }
        ],
        subCategoryList: [
            { parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true },
            { parentCategoryName: "Sportsbook", key: "Basketball", name: "Basketball", checked: true }
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
            { key: "EURO", name: "EURO", checked: true },
            { key: "VND", name: "VND", checked: true }
        ],
        sizeList: [
            { key: "300x250", name: "300x250", checked: true },
            { key: "500x350", name: "500x350", checked: true }
        ],
        affTypeList: [
            { key: "Asian", name: "Asian", checked: true },
            { key: "Media", name: "Media", checked: true }
        ],
        deviceTypeList,
        defaultLanguage: 'Vietnamese'
    };

    it('render correctly with insert', () => {
        const result = shallow(<EditBannerForm {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with update', () => {
        const props = Object.assign({}, defaultProps, { selectedBannerId: 2485, getBannerDetail: jest.fn() });
        const result = shallow(<EditBannerForm {...props} />);
        result.setState({
            isInsert: false, messageNotificationPopup: 'abc', categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: false }], isSuccess: false, inputFileNames: ["test.gif"]
        });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with not show popup', () => {
        const props = Object.assign({}, defaultProps, { selectedBannerId: null });
        const result = shallow(<EditBannerForm {...props} />);
        result.setState({ category: "" })

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate should call setState', () => {
        const props = Object.assign({}, defaultProps, { selectedBannerId: 2485, getBannerDetail: jest.fn(() => bannerInfo) });
        const result = shallow(<EditBannerForm {...props} />);

        result.setState = jest.fn();

        result.instance().componentDidUpdate(defaultProps);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: false });
    });

    it('componentDidUpdate should call setState and _handleGetBannerDetail', () => {
        const props = Object.assign({}, defaultProps, { selectedBannerId: 2485, getBannerDetail: jest.fn(() => bannerInfo) });
        const result = shallow(<EditBannerForm {...props} />);
        result.setState = jest.fn();

        const instance = result.instance();
        instance._handleGetBannerDetail = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: false });
        expect(instance._handleGetBannerDetail).toHaveBeenCalledWith(2485);
    });

    it('componentDidUpdate should not call setState and _handleGetBannerDetail', () => {
        const props = Object.assign({}, defaultProps, { selectedBannerId: 2485 });
        const result = shallow(<EditBannerForm {...defaultProps} />);
        result.setState = jest.fn();

        const instance = result.instance();
        instance._handleGetBannerDetail = jest.fn();

        instance.componentDidUpdate(props);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: true });
        expect(instance._handleGetBannerDetail).not.toHaveBeenCalled();
    });

    it('_handleGetBannerDetail should call getBannerDetail and setState', async () => {
        const selectedBannerId = 2485;
        const props = Object.assign({}, defaultProps, { getBannerDetail: jest.fn(() => bannerInfo) });
        const result = shallow(<EditBannerForm {...props} />);

        result.setState = jest.fn();

        await result.instance()._handleGetBannerDetail(selectedBannerId);

        expect(props.getBannerDetail).toHaveBeenCalledWith(selectedBannerId, '');
        expect(result.setState).toHaveBeenCalledWith({ "affTypeList": [{ "checked": false, "key": "Asian", "name": "Asian" }, { "checked": false, "key": "Media", "name": "Media" }], "categoryList": [{ "categoryName": "Casino", "checked": true, "key": "Casino", "name": "Casino" }, { "categoryName": "Sportsbook", "checked": false, "key": "Sportsbook", "name": "Sportsbook" }], "currencyList": [{ "checked": true, "key": "EURO", "name": "EURO" }, { "checked": false, "key": "VND", "name": "VND" }], "deviceTypeList": [{ "checked": false, "key": 0, "name": "PC / Laptop" }, { "checked": true, "key": 1, "name": "Mobile" }], "iniatalFileName": "giphy.gif", "inputFileNames": ["giphy.gif"], "isDisableCurrency": false, "language": "Chinese Simplified", "subCategoryList": [{ "checked": false, "key": "Slot", "name": "Slot" }], "userType": 1 });
    });

    it('_handleGetBannerDetail should call getBannerDetail and not call setState', async () => {
        const selectedBannerId = 2485;
        const props = Object.assign({}, defaultProps, { getBannerDetail: jest.fn(() => null) });
        const result = shallow(<EditBannerForm {...props} />);

        result.setState = jest.fn();

        await result.instance()._handleGetBannerDetail(selectedBannerId);

        expect(props.getBannerDetail).toHaveBeenCalledWith(selectedBannerId, '');
        expect(result.setState).not.toHaveBeenCalled();
    });

    it('_handleGetBannerDetail should call getBannerDetail and setState  with casino category', async () => {
        const selectedBannerId = 2485;
        const banner = Object.assign({}, bannerInfo, { Category: 'Slot' })
        const props = Object.assign({}, defaultProps, { getBannerDetail: jest.fn(() => banner) });
        const result = shallow(<EditBannerForm {...props} />);

        result.setState = jest.fn();

        await result.instance()._handleGetBannerDetail(selectedBannerId);

        expect(props.getBannerDetail).toHaveBeenCalledWith(selectedBannerId, '');
        expect(result.setState).toHaveBeenCalledWith({ "affTypeList": [{ "checked": false, "key": "Asian", "name": "Asian" }, { "checked": false, "key": "Media", "name": "Media" }], "categoryList": [{ "categoryName": "Casino", "checked": true, "key": "Casino", "name": "Casino" }, { "categoryName": "Sportsbook", "checked": false, "key": "Sportsbook", "name": "Sportsbook" }], "currencyList": [{ "checked": true, "key": "EURO", "name": "EURO" }, { "checked": false, "key": "VND", "name": "VND" }], "deviceTypeList": [{ "checked": false, "key": 0, "name": "PC / Laptop" }, { "checked": true, "key": 1, "name": "Mobile" }], "iniatalFileName": "giphy.gif", "inputFileNames": ["giphy.gif"], "isDisableCurrency": false, "language": "Chinese Simplified", "subCategoryList": [{ "checked": false, "key": "Slot", "name": "Slot" }], "userType": 1 });
    });

    it('_handleGetBannerDetail should call getBannerDetail and setState with sportsbook category', async () => {
        const selectedBannerId = 2485;
        const banner = Object.assign({}, bannerInfo, { Category: 'Basketball' })
        const props = Object.assign({}, defaultProps, { getBannerDetail: jest.fn(() => banner) });
        const result = shallow(<EditBannerForm {...props} />);

        result.setState = jest.fn();

        await result.instance()._handleGetBannerDetail(selectedBannerId);

        expect(props.getBannerDetail).toHaveBeenCalledWith(selectedBannerId, '');
        expect(result.setState).toHaveBeenCalledWith({ "affTypeList": [{ "checked": false, "key": "Asian", "name": "Asian" }, { "checked": false, "key": "Media", "name": "Media" }], "categoryList": [{ "categoryName": "Casino", "checked": true, "key": "Casino", "name": "Casino" }, { "categoryName": "Sportsbook", "checked": false, "key": "Sportsbook", "name": "Sportsbook" }], "currencyList": [{ "checked": true, "key": "EURO", "name": "EURO" }, { "checked": false, "key": "VND", "name": "VND" }], "deviceTypeList": [{ "checked": false, "key": 0, "name": "PC / Laptop" }, { "checked": true, "key": 1, "name": "Mobile" }], "iniatalFileName": "giphy.gif", "inputFileNames": ["giphy.gif"], "isDisableCurrency": false, "language": "Chinese Simplified", "subCategoryList": [{ "checked": false, "key": "Slot", "name": "Slot" }], "userType": 1 });
    });

    it('_handleGetBannerDetail should call getBannerDetail and setState with userType is sub-aff', async () => {
        const selectedBannerId = 2485;
        const banner = Object.assign({}, bannerInfo, { Category: 'Sign up', SubCategories: [], UserType: 2 })
        const props = Object.assign({}, defaultProps, { getBannerDetail: jest.fn(() => banner) });
        const result = shallow(<EditBannerForm {...props} />);

        result.setState = jest.fn();

        await result.instance()._handleGetBannerDetail(selectedBannerId);

        expect(props.getBannerDetail).toHaveBeenCalledWith(selectedBannerId, '');
        expect(result.setState).toHaveBeenCalledWith({ "affTypeList": [{ "checked": false, "key": "Asian", "name": "Asian" }, { "checked": false, "key": "Media", "name": "Media" }], "categoryList": [{ "categoryName": "Sign up", "checked": false, "key": "Sign up", "name": "Sign up" }], "currencyList": [{ "checked": true, "key": "EURO", "name": "EURO" }, { "checked": false, "key": "VND", "name": "VND" }], "deviceTypeList": [{ "checked": false, "key": 0, "name": "PC / Laptop" }, { "checked": true, "key": 1, "name": "Mobile" }], "iniatalFileName": "giphy.gif", "inputFileNames": ["giphy.gif"], "isDisableCurrency": true, "language": "Chinese Simplified", "subCategoryList": [{ "checked": false, "key": "Slot", "name": "Slot" }], "userType": 2 });
    });

    it('_handleFile should be called when change file', () => {
        const event = {
            target: {
                files: [{ name: 'test.jpg' }]
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);

        result.setState = jest.fn();

        result.find(InputFile).props().handleOnChangeFiles(event);

        expect(result.setState).toHaveBeenCalledWith({ "files": [{ "name": "test.jpg" }], "inputFileNames": ["test.jpg"], "isDisabled": false });
    });

    it('_handleFile should be called when change file but chose invalid file', () => {
        const event = {
            target: {
                files: [{ name: 'abc.pdf' }]
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);
        result.instance()._handleShowAlert = jest.fn();

        result.setState = jest.fn();

        result.find(InputFile).props().handleOnChangeFiles(event);

        expect(result.setState).toHaveBeenCalledWith({ "files": [{ "name": "abc.pdf" }], "inputFileNames": ["abc.pdf"], "isDisabled": true });
        expect(result.instance()._handleShowAlert).toHaveBeenCalledWith(false, "Sorry! We just support these file types : '.jpg', '.gif' , '.png','.jpeg'");
    });

    it('_handleFile should be called when change file but file name empty', () => {
        const event = {
            target: {
                files: [{ name: '' }]
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);
        result.instance()._handleShowAlert = jest.fn();

        result.setState = jest.fn();

        result.find(InputFile).props().handleOnChangeFiles(event);

        expect(result.setState).toHaveBeenCalledWith({ "files": [{ "name": "" }], "inputFileNames": [""], "isDisabled": true });
        expect(result.instance()._handleShowAlert).toHaveBeenCalledWith(false, "Sorry! We just support these file types : '.jpg', '.gif' , '.png','.jpeg'");
    });

    it('_handleFile should be called when change file but not select file', () => {
        const event = {
            target: {
                files: null
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);
        result.instance()._handleShowAlert = jest.fn();

        result.setState = jest.fn();

        result.find(InputFile).props().handleOnChangeFiles(event);

        expect(result.setState).not.toHaveBeenCalled();
        expect(result.instance()._handleShowAlert).not.toHaveBeenCalled();
    });

    it('_handleChange should be called when change language select', () => {
        const event = {
            target: {
                name: 'language',
                value: 'English'
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);

        result.setState = jest.fn();

        result.find('Input[type="select"][id="language"]').simulate('change', event);

        expect(result.setState).toHaveBeenCalledTimes(1);
        expect(result.setState).toHaveBeenCalledWith({ language: 'English' });
    });

    it('_handleChange should be called when change userType select player', () => {
        const event = {
            target: {
                name: 'userType',
                value: '1'
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);

        result.setState = jest.fn();

        result.find('Input[type="select"][id="userType"]').simulate('change', event);

        expect(result.setState).toHaveBeenCalledTimes(2);
        expect(result.setState.mock.calls[0][0]).toEqual({ userType: '1' });
        expect(result.setState.mock.calls[1][0]).toEqual({ isDisableCurrency: false, categoryList: defaultProps.playerCategoryList });
    });

    it('_handleChange should be called when change userType select sub-aff', () => {
        const event = {
            target: {
                name: 'userType',
                value: '2'
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);

        result.setState = jest.fn();

        result.find('Input[type="select"][id="userType"]').simulate('change', event);

        expect(result.setState).toHaveBeenCalledTimes(2);
        expect(result.setState.mock.calls[0][0]).toEqual({ userType: '2' });
        expect(result.setState.mock.calls[1][0]).toEqual({ isDisableCurrency: true, categoryList: defaultProps.subAffiliateCategoryList });
    });

    it('_handleChangeInputFileName should be called when insert', () => {
        const event = {
            target: {
                value: 'Casino***'
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);
        result.setState({ inputFileNames: ["Casino"] });
        result.instance()._handleChangeInputFileName = jest.fn();
        result.setState = jest.fn();

        result.find('Input[type="text"][id="inputFileName0"]').simulate('change', event);

        expect(result.instance()._handleChangeInputFileName).toHaveBeenCalledWith(event, 0);
    });

    it('_handleChangeInputFileName should be called when update', () => {
        const event = {
            target: {
                value: 'Casino***'
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);
        result.setState({ isInsert: false, inputFileNames: ["Casino"] });
        result.instance()._handleChangeInputFileName = jest.fn();
        result.setState = jest.fn();

        result.find('Input[type="text"][id="inputFileName"]').simulate('change', event);

        expect(result.instance()._handleChangeInputFileName).toHaveBeenCalledWith(event, 0);
    });

    it('_handleChangeInputFileName - should call _handleShowAlert', () => {
        const event = {
            target: {
                value: 'Casino\\**'
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);
        const instance = result.instance();
        instance._handleShowAlert = jest.fn();

        instance._handleChangeInputFileName(event, 0);

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, `A File Name can't contain any of the following characters: \\/:*?"<>|#%&+`);
    });

    it('_handleChangeInputFileName - should call setState', () => {
        const event = {
            target: {
                value: 'Casino123'
            }
        };

        const result = shallow(<EditBannerForm {...defaultProps} />);
        result.setState({ inputFileNames: ["Casino"] });
        const instance = result.instance();
        instance.setState = jest.fn()

        instance._handleChangeInputFileName(event, 0);

        expect(instance.setState).toHaveBeenCalledWith({ inputFileNames: ["Casino123"] });
    });

    it('_handleSubmit - should be called', () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);

        const instance = wrapper.instance();

        instance._handleSubmit = jest.fn();

        wrapper.find('Button').at(1).simulate('click');

        expect(instance._handleSubmit).toHaveBeenCalledWith(true);
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert when not select category', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: false }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }]
        });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit(false);

        expect(props.toggleLoader).toHaveBeenCalledTimes(1);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Please select Category.");
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert when not select casino sub category', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: false }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }]
        });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit(true);

        expect(props.toggleLoader).toHaveBeenCalledTimes(1);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Please select Sub Category.");
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert when not select sportsbook sub category', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Sportsbook", key: "Sportsbook", name: "Sportsbook", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: false }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }]
        });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit(true);

        expect(props.toggleLoader).toHaveBeenCalledTimes(1);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Please select Sub Category.");
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert when not select currency', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: false }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }]
        });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit(false);

        expect(props.toggleLoader).toHaveBeenCalledTimes(1);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Please select Currency.");
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert when not select Affiliate Type', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: false }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }]
        });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit(false);

        expect(props.toggleLoader).toHaveBeenCalledTimes(1);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Please select Affiliate Type.");
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert when not select Device', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: false }]
        });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit(false);

        expect(props.toggleLoader).toHaveBeenCalledTimes(1);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Please select Device.");
    });

    it('_handleSubmit - should call toggleLoader and _save', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }],
            inputFileNames: ['abc.png', 'xyz.png']
        });
        const instance = wrapper.instance();
        const resultValidateInputFileName = {
            isOK: true,
            message: ''
        }
        instance._validateInputFileName = jest.fn(() => resultValidateInputFileName);
        instance._save = jest.fn();

        await instance._handleSubmit(false);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._save).toHaveBeenCalledWith(false);
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert when invalid input file name', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }]
        });
        const instance = wrapper.instance();
        const resultValidateInputFileName = {
            isOK: false,
            message: 'Input file name is invalid'
        }
        instance._validateInputFileName = jest.fn(() => resultValidateInputFileName);
        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit(false);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, resultValidateInputFileName.message);
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert when inputFileNames > 10', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }],
            inputFileNames: ['','','','','','','','','','','','']
        });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit(false);

        expect(props.toggleLoader).toHaveBeenCalledTimes(1);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Can't upload exceed 10 images one time");
    });

    it('_handleSubmit - should call toggleLoader and _handleShowAlert when inputFileNames has duplicated', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }],
            inputFileNames: ['abc.png', 'abc.png']
        });
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleSubmit(false);

        expect(props.toggleLoader).toHaveBeenCalledTimes(1);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "File Name is unique, please enter other file name!");
    });

    it('_validateInputFileName - should valid input file name when insert', () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ inputFileNames: ['abc.png'] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: true, message: '' });
    });

    it('_validateInputFileName - should valid input file name when insert', () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ inputFileNames: ['abc.123'] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: false, message: "File Name 1 incorrect.<br />Sorry! We just support these file types : '.jpg', '.gif' , '.png','.jpeg'" });
    });

    it('_validateInputFileName - should valid file when insert', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ inputFileNames: [''], files: [{ name: 'abc123.jpg' }] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: true, message: '' });
    });

    it('_validateInputFileName - should invalid file when insert', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ inputFileNames: [''], files: [{ name: 'abc123abc123abc123abc123abc123abc123abc123abc123abc123abc123.jpg' }] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: false, message: 'The maximum length of file name is 50. Please choose another name.' });
    });

    it('_validateInputFileName - should return error when insert', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ inputFileNames: [''], files: [] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: false, message: 'You must browse a banner.' });
    });

    it('_validateInputFileName - should valid input file name when update', () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ isInsert: false, inputFileNames: ['abc.png'] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: true, message: '' });
    });

    it('_validateInputFileName - should valid input file name when update', () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ isInsert: false, inputFileNames: ['abc.123'] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: false, message: "Sorry! We just support these file types : '.jpg', '.gif' , '.png','.jpeg'" });
    });

    it('_validateInputFileName - should valid file when update', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ isInsert: false, inputFileNames: [''], files: [{ name: 'abc123.jpg' }] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: true, message: '' });
    });

    it('_validateInputFileName - should invalid file when update', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ isInsert: false, inputFileNames: [''], files: [{ name: 'abc123abc123abc123abc123abc123abc123abc123abc123abc123abc123.jpg' }] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: false, message: 'The maximum length of file name is 50. Please choose another name.' });
    });

    it('_validateInputFileName - should return error when update', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ isInsert: false, inputFileNames: [''], files: [] })

        const result = wrapper.instance()._validateInputFileName();

        expect(result).toEqual({ isOK: false, message: 'You must either enter a file name for banner or browse other banner.' });
    });

    it('_save - should call insertBanner and _handleAfterSave', async () => {
        const expectedResult = { IsSuccessful: true, Message: '' };
        const props = Object.assign({}, defaultProps, { insertBanner: jest.fn(() => expectedResult) });
        const wrapper = shallow(<EditBannerForm {...props} />);
        const instance = wrapper.instance();
        instance._handleAfterSave = jest.fn();

        await instance._save();

        expect(props.insertBanner).toHaveBeenCalledWith({ "affTypes": "Asian,Media", "bannerId": 0, "categories": "Casino,Sportsbook", "currencies": "EURO,VND", "deviceTypes": "0,1", "files": [], "inputFileNames": "", "language": "Vietnamese", userType: 1, "subCategories": "" });
        expect(instance._handleAfterSave).toHaveBeenCalledWith(true, expectedResult);
    });

    it('_save - should call updateBanner and _handleAfterSave', async () => {
        const expectedResult = { IsSuccessful: true, Message: '' };
        const props = Object.assign({}, defaultProps, { updateBanner: jest.fn(() => expectedResult) });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState({ isInsert: false });
        const instance = wrapper.instance();
        instance._handleAfterSave = jest.fn();

        await instance._save();

        expect(props.updateBanner).toHaveBeenCalledWith({ "affTypes": "Asian,Media", "bannerId": 0, "categories": "Casino,Sportsbook", "currencies": "EURO,VND", "deviceTypes": "0,1", "files": [], "inputFileNames": "", "language": "Vietnamese", userType: 1, "subCategories": "" });
        expect(instance._handleAfterSave).toHaveBeenCalledWith(false, expectedResult);
    });

    it('_save - should call setState', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({ isInsert: false, inputFileNames: ["abc.png"], iniatalFileName: "abc.png", files: [{ name: "abc.png" }] });
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance._save();

        expect(instance.setState).toHaveBeenCalledWith({ messageNotificationPopup: 'This file name exists already. Do you want to overwrite the current file?' });
    });

    it('_getParam - should return correct data', () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }]
        });

        const result = wrapper.instance()._getParam(false);

        expect(result).toEqual({ bannerId: 0, files: [], inputFileNames: '', categories: 'Casino', subCategories: '', language: 'Vietnamese', userType: 1, currencies: 'EURO', affTypes: 'Asian', deviceTypes: '0' });
    });

    it('_getParam - should return correct data with has SubCategory', () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }],
            inputFileNames: ["abc  "]
        });

        const result = wrapper.instance()._getParam(true);

        expect(result).toEqual({ bannerId: 0, files: [], inputFileNames: 'abc', categories: 'Casino', subCategories: 'Slot', language: 'Vietnamese', userType: 1, currencies: 'EURO', affTypes: 'Asian', deviceTypes: '0' });
    });

    it('_getParam - should return correct data with update', () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({
            categoryList: [{ categoryName: "Casino", key: "Casino", name: "Casino", checked: true }],
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }],
            currencyList: [{ key: "EURO", name: "EURO", checked: true }],
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }],
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }],
            inputFileNames: ["abc  "],
            isDisableCurrency: true
        });

        const result = wrapper.instance()._getParam(true);

        expect(result).toEqual({ bannerId: 0, files: [], inputFileNames: 'abc', categories: 'Casino', subCategories: 'Slot', language: 'Vietnamese', userType: 1, currencies: '', affTypes: 'Asian', deviceTypes: '0' });
    });

    it('handleChangeCategory - should call setState', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }]
        });
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance.handleChangeCategory(null, 'Casino');

        expect(instance.setState).toHaveBeenCalledWith({ "categoryList": [{ "categoryName": "Casino", "checked": true, "key": "Casino", "name": "Casino" }, { "categoryName": "Sportsbook", "checked": false, "key": "Sportsbook", "name": "Sportsbook" }], "subCategoryList": [{ "checked": true, "key": "Slot", "name": "Slot", "parentCategoryName": "Casino" }] });
    });

    it('handleChangeCategory - should call setState without sub category', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState({ userType: 2 });
        instance.setState = jest.fn();

        await instance.handleChangeCategory(null, 'Sign up');

        expect(instance.setState).toHaveBeenCalledWith({ "categoryList": [{ "categoryName": "Sign up", "checked": true, "key": "Sign up", "name": "Sign up" }], "subCategoryList": [] });
    });

    it('handleChangeSubCategory - should call setState', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({
            subCategoryList: [{ parentCategoryName: "Casino", key: "Slot", name: "Slot", checked: true }]
        });
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance.handleChangeSubCategory(null, 'Slot');

        expect(instance.setState).toHaveBeenCalledWith({ "subCategoryList": [{ "checked": true, "key": "Slot", "name": "Slot" }] });
    });

    it('handleChangeCurrency - should call setState', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({
            currencyList: [{ key: "EURO", name: "EURO", checked: true }]
        });
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance.handleChangeCurrency(null, 'EURO');

        expect(instance.setState).toHaveBeenCalledWith({ "currencyList": [{ "checked": true, "key": "EURO", "name": "EURO" }] });
    });

    it('handleChangeAffType - should call setState', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({
            affTypeList: [{ key: "Asian", name: "Asian", checked: true }]
        });
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance.handleChangeAffType(null, 'Asian');

        expect(instance.setState).toHaveBeenCalledWith({ "affTypeList": [{ "checked": true, "key": "Asian", "name": "Asian" }] });
    });

    it('handleChangeDevice - should call setState', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        wrapper.setState({
            deviceTypeList: [{ key: 0, name: "PC / Laptop", checked: true }]
        });
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance.handleChangeDevice(null, 'PC / Laptop');

        expect(instance.setState).toHaveBeenCalledWith({ "deviceTypeList": [{ "checked": false, "key": 0, "name": "PC / Laptop" }] });
    });

    it('_handleAfterSave - should call _handleShowAlert with the add is error', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleAfterSave(true, null);

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "The add is failed!");
    });

    it('_handleAfterSave - should call _handleShowAlert with the update is error', async () => {
        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleAfterSave(false, null);

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "The update is failed!");
    });

    it('_handleAfterSave - should call _handleShowAlert with add successfully', async () => {
        const result = { IsSuccessful: true, Message: '' };

        const props = Object.assign({}, defaultProps, { getSizeList: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleAfterSave(true, result);

        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Your banner has been added successfully!");
    });

    it('_handleAfterSave - should call _handleShowAlert with update successfully', async () => {
        const result = { IsSuccessful: true, Message: '' };

        const props = Object.assign({}, defaultProps, { getSizeList: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleAfterSave(false, result);

        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Your banner has been updated successfully!");
    });

    it('_handleAfterSave - should call _handleShowAlert with the add is failed', async () => {
        const result = { IsSuccessful: false, Message: 'the add is failed!' };

        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleAfterSave(true, result);

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, 'the add is failed!');
    });

    it('_handleAfterSave - should call _handleShowAlert with the update is failed', async () => {
        const result = { IsSuccessful: false, Message: 'the update is failed!' };

        const wrapper = shallow(<EditBannerForm {...defaultProps} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();

        await instance._handleAfterSave(false, result);

        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, 'the update is failed!');
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance._hideMessage = jest.fn();
        instance.modalRef.current = jest.fn();
        instance.modalRef.current.scrollTo = jest.fn();

        instance._handleShowAlert(false, 'Updated failed!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Updated failed!' }, expect.any(Function)]);
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage with isSuccess', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance._hideMessage = jest.fn();
        instance.modalRef.current = jest.fn();
        instance.modalRef.current.scrollTo = jest.fn();

        instance._handleShowAlert(true, 'Updated Successfully!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: true, message: 'Updated Successfully!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState, fetchData and _handleClosePopup', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(props.fetchData).toHaveBeenCalledWith(param);
        expect(instance._handleClosePopup).toHaveBeenCalled();
    });

    it('_hideMessage - should call setState and not call _handleFetchData', async () => {
        const props = Object.assign({}, defaultProps, { fetchData: jest.fn() });
        const wrapper = shallow(<EditBannerForm {...props} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(props.fetchData).not.toHaveBeenCalled();
        expect(instance._handleClosePopup).not.toHaveBeenCalled();
    });

    it('_handleClosePopup - should call setSelectedBannerId and setState', async () => {
        const props = Object.assign({}, defaultProps, { setSelectedBannerId: jest.fn(), defaultLanguage: '' });
        const wrapper = shallow(<EditBannerForm {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance._handleClosePopup();

        expect(props.setSelectedBannerId).toHaveBeenCalledWith(null);
        expect(instance.setState).toHaveBeenCalledWith({ "affTypeList": [{ "checked": true, "key": "Asian", "name": "Asian" }, { "checked": true, "key": "Media", "name": "Media" }], "categoryList": [{ "categoryName": "Casino", "checked": true, "key": "Casino", "name": "Casino" }, { "categoryName": "Sportsbook", "checked": true, "key": "Sportsbook", "name": "Sportsbook" }], "currencyList": [{ "checked": true, "key": "EURO", "name": "EURO" }, { "checked": true, "key": "VND", "name": "VND" }], "deviceTypeList": [{ "checked": true, "key": 0, "name": "PC / Laptop" }, { "checked": true, "key": 1, "name": "Mobile" }], "files": [], "inputFileNames": [""], "isDisableCurrency": false, "isDisabled": true, "isInsert": true, "isShowMessage": false, "isSuccess": true, "language": "English", "message": "", "messageNotificationPopup": "", "subCategoryList": [{ "checked": true, "key": "Slot", "name": "Slot", "parentCategoryName": "Casino" }, { "checked": true, "key": "Basketball", "name": "Basketball", "parentCategoryName": "Sportsbook" }], "userType": 1 });
    });

    it('_handleCloseNotificationPopup - should call setState, _getParam and _updateBanner', () => {
        const banner = { "AffTypes": ["2"], "BannerId": 2485, "Categories": ["Casino"], "Currencies": ["EURO"], "DeviceTypes": ["1"], "FileName": "CategoryMedia/giphy.gif", "ImageType": "Image", "Language": "Chinese Simplified", "Size": "500x500", "SubCategories": ["Baccarat"], "UserType": 1 };
        const result = shallow(<EditBannerForm {...defaultProps} />);
        const instance = result.instance();
        instance.setState({ isDisableCurrency: true, messageNotificationPopup: 'Abc' })
        instance.setState = jest.fn();
        instance._getParam = jest.fn(() => bannerInfo);
        instance._updateBanner = jest.fn();

        result.find(NotificationPopup).props().onClose(true)

        expect(instance.setState).toHaveBeenCalledWith({ messageNotificationPopup: '' });
        expect(instance._getParam).toHaveBeenCalledWith(true);
        expect(instance._updateBanner).toHaveBeenCalledWith(banner);
    });

    it('_handleCloseNotificationPopup - - should call setState and not call _getParam and _updateBanner', () => {
        const result = shallow(<EditBannerForm {...defaultProps} />);
        const instance = result.instance();
        instance.setState = jest.fn();
        instance._getParam = jest.fn();
        instance._updateBanner = jest.fn();

        instance.handleCloseNotificationPopup(false, false)

        expect(instance.setState).toHaveBeenCalledWith({ messageNotificationPopup: '' });
        expect(instance._getParam).not.toHaveBeenCalled();
        expect(instance._updateBanner).not.toHaveBeenCalled();
    });

    it('_handlePressEnter - should call _handleSubmit', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const result = shallow(<EditBannerForm {...defaultProps} />);
        const instance = result.instance();
        instance._handleSubmit = jest.fn();

        instance._handlePressEnter(event)

        expect(instance._handleSubmit).toHaveBeenCalled();
    });

    it('_handlePressEnter - should not call _handleSubmit', () => {
        const event = { charCode: 123, preventDefault: jest.fn() };
        const result = shallow(<EditBannerForm {...defaultProps} />);
        const instance = result.instance();
        instance._handleSubmit = jest.fn();

        instance._handlePressEnter(event)

        expect(instance._handleSubmit).not.toHaveBeenCalled();
    });

    it('_handleRemoveImageAt - should remove successfully', () => {
        const result = shallow(<EditBannerForm {...defaultProps} />);
        const instance = result.instance();
        instance.setState({ inputFileNames: ['Abc.png'], files: [{ name: 'Abc.png' }] })
        instance.setState = jest.fn();

        result.find('Button[type="button"]').at(0).simulate('click', true)

        expect(instance.setState).toHaveBeenCalledWith({ inputFileNames: [''], files: [], isDisabled: true });
    });

    it('_handleRemoveImageAt - with invalid index', () => {
        const result = shallow(<EditBannerForm {...defaultProps} />);
        const instance = result.instance();
        instance.setState({ inputFileNames: ['Abc.png'], files: [{ name: 'Abc.png' }] })
        instance.setState = jest.fn();

        instance._handleRemoveImageAt(1)

        expect(instance.setState).not.toHaveBeenCalled();
    });

    it('_handleRemoveImageAt - with invalid extension', () => {
        const result = shallow(<EditBannerForm {...defaultProps} />);
        const instance = result.instance();
        instance.setState({ inputFileNames: ['Abc.pdf', 'Abc.png'], files: [{ name: 'Abc.pdf' }, { name: 'Abc.png' }] })
        instance.setState = jest.fn();
        instance._handleShowAlert = jest.fn();

        instance._handleRemoveImageAt(1)

        expect(instance.setState).toHaveBeenCalledWith({ "files": [{ "name": "Abc.pdf" }], "inputFileNames": ["Abc.pdf"], "isDisabled": true });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Sorry! We just support these file types : '.jpg', '.gif' , '.png','.jpeg'");
    });

    it('_handleRemoveImageAt - should remove successfully with valid extension', () => {
        const result = shallow(<EditBannerForm {...defaultProps} />);
        const instance = result.instance();
        instance.setState({ inputFileNames: ['Abc.png', 'Xyz.png'], files: [{ name: 'Abc.png' }, { name: 'Xyz.png' }] })
        instance.setState = jest.fn();
        instance._handleShowAlert = jest.fn();

        instance._handleRemoveImageAt(1)

        expect(instance.setState).toHaveBeenCalledWith({ "files": [{ "name": "Abc.png" }], "inputFileNames": ["Abc.png"], "isDisabled": false });
        expect(instance._handleShowAlert).not.toHaveBeenCalled();
    });
})