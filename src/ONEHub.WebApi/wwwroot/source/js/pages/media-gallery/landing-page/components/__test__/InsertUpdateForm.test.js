import React from 'react';
import { InsertUpdateForm } from '../InsertUpdateForm';
import { shallow } from 'enzyme';

describe('landing page list - components - InsertUpdateForm ', () => {
    const targetCountryList = [
        {
            TargetCountryCode: 'en-US',
            TargetCountryName: 'English',
            Status: 0
        },
        {
            TargetCountryCode: 'th-TH',
            TargetCountryName: 'Thailand',
            Status: 1
        },
        {
            TargetCountryCode: 'zh-CN',
            TargetCountryName: 'Chinese',
            Status: 0
        }
    ];

    const landingPageInfo = {
        PageCode: "numbergame",
        PageId: 22,
        PageName: "Number Game"
    };


    const defaultProps = {
        selectedLandingPageId: 22,
        getTargetCountryListByLandingPage: jest.fn(() => targetCountryList),
        toggleLoader: jest.fn(),
        fetchData: jest.fn()
    };

    it('render correctly with insert', () => {
        const result = shallow(<InsertUpdateForm {...defaultProps} />);
        result.setState({ pageName: '123 @abc', pageCode: '123 @abc' });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with update', () => {
        const props = Object.assign({}, defaultProps, { selectedLandingPageId: 22, getLandingPageDetail: jest.fn() });
        const result = shallow(<InsertUpdateForm {...props} />);
        result.setState({ isSuccess: false, pageName: '123', pageCode: 'abc', isClickedSubmit: true });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with not show popup', () => {
        const props = Object.assign({}, defaultProps, { selectedLandingPageId: null });
        const result = shallow(<InsertUpdateForm {...props} />);
        result.setState({ pageName: '123456789012345678901234567890123456789012345678901', pageCode: '123456789012345678901234567890123456789012345678901' });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate should call setState', () => {
        const props = Object.assign({}, defaultProps, { selectedLandingPageId: 1, getLandingPageDetail: jest.fn(() => landingPageInfo) });
        const result = shallow(<InsertUpdateForm {...props} />);

        result.setState = jest.fn();

        result.instance().componentDidUpdate(defaultProps);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: false });
    });

    it('componentDidUpdate should call setState and _handleUpdateState', () => {
        const props = Object.assign({}, defaultProps, { selectedLandingPageId: 1, getLandingPageDetail: jest.fn(() => landingPageInfo) });
        const result = shallow(<InsertUpdateForm {...props} />);
        result.setState = jest.fn();

        const instance = result.instance();
        instance._handleUpdateState = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(result.setState).toHaveBeenCalledWith({ isInsert: false });
        expect(instance._handleUpdateState).toHaveBeenCalledWith(1);
    });

    it('componentDidUpdate should not call setState and _handleUpdateState', () => {
        const result = shallow(<InsertUpdateForm {...defaultProps} />);
        result.setState = jest.fn();

        const instance = result.instance();
        instance._handleUpdateState = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(result.setState).not.toHaveBeenCalled();
        expect(instance._handleUpdateState).not.toHaveBeenCalled();
    });

    it('_handleUpdateState should call getLandingPageDetail and setState', async () => {
        const selectedLandingPageId = 22;
        const props = Object.assign({}, defaultProps, { getLandingPageDetail: jest.fn(() => landingPageInfo) });
        const result = shallow(<InsertUpdateForm {...props} />);

        result.setState = jest.fn();

        await result.instance()._handleUpdateState(selectedLandingPageId);

        expect(props.getLandingPageDetail).toHaveBeenCalledWith(selectedLandingPageId);
        expect(result.setState).toHaveBeenCalledWith({
            isBlockAllTargetCountries: false,
            isInsert: false,
            selectedLandingPage: {
                pageCode: "numbergame",
                pageName: "Number Game",
                blockTargetCountry: 'th-TH'
            },
            targetCountryList
        });
    });

    it('_handleChange should be called when change pageName input', () => {
        const event = {
            target: {
                name: 'pageName',
                value: 'Bonus'
            }
        };

        const result = shallow(<InsertUpdateForm {...defaultProps} />);

        result.setState = jest.fn();

        result.find('Input[type="text"][name="pageName"]').simulate('change', event);

        expect(result.setState).toHaveBeenCalledWith({ selectedLandingPage: { blockTargetCountry: '', pageCode: '', pageName: 'Bonus' } });
    });

    it('_handleChange should be called when change pageCode input', () => {
        const event = {
            target: {
                name: 'pageCode',
                value: 'test'
            }
        };

        const result = shallow(<InsertUpdateForm {...defaultProps} />);

        result.setState = jest.fn();

        result.find('Input[type="text"][name="pageCode"]').simulate('change', event);

        expect(result.setState).toHaveBeenCalledWith({ selectedLandingPage: { blockTargetCountry: '', pageCode: 'test', pageName: '' } });
    });

    it('_handleKeyPress - should call handleSubmit when press Enter in pageName input', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        wrapper.find('Input[type="text"][name="pageName"]').simulate('keyPress', event);

        expect(instance._handleSubmit).toHaveBeenCalled();
    });

    it('_handleKeyPress - should call handleSubmit when press Enter in pageCode input', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        wrapper.find('Input[type="text"][name="pageCode"]').simulate('keyPress', event);

        expect(instance._handleSubmit).toHaveBeenCalled();
    });

    it('_handleKeyPress - should not call handleSubmit when press others key', () => {
        const event = { charCode: 35, preventDefault: jest.fn() };
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        wrapper.find('Input[type="text"][name="pageCode"]').simulate('keyPress', event);

        expect(instance._handleSubmit).not.toHaveBeenCalled();
    });

    it('_handleSubmit - should be called when click submit button', () => {
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);

        const instance = wrapper.instance();
        instance._handleSubmit = jest.fn();

        wrapper.find('Button').at(0).simulate('click');

        expect(instance._handleSubmit).toHaveBeenCalledWith(false);
    });

    it('_handleSubmit - should call toggleLoader and setState when insert with not valid', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit(false);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(instance._handleShowAlert).not.toHaveBeenCalled();
    });

    it('_handleSubmit - insertLandingPage is errored', async () => {
        const props = Object.assign({}, defaultProps, { insertLandingPage: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit(true);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(props.insertLandingPage).toHaveBeenCalledWith({ "pageCode": "", "pageId": 22, "pageName": "", blockTargetCountry: '' });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Add Failed!");
    });

    it('_handleSubmit - insertLandingPage is failed', async () => {
        const result = { IsSuccessful: false, Message: "Adding has a error" };
        const props = Object.assign({}, defaultProps, { insertLandingPage: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit(true);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(props.insertLandingPage).toHaveBeenCalledWith({ "pageCode": "", "pageId": 22, "pageName": "", blockTargetCountry: '' });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Adding has a error");
    });

    it('_handleSubmit - insertLandingPage is successful', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { insertLandingPage: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState = jest.fn();

        await instance._handleSubmit(true);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(props.insertLandingPage).toHaveBeenCalledWith({ "pageCode": "", "pageId": 22, "pageName": "", blockTargetCountry: '' });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Add Successfully!");
    });

    it('_handleSubmit - updateLandingPage is errored', async () => {
        const props = Object.assign({}, defaultProps, { selectedLandingPageId: 22, updateLandingPage: jest.fn(), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState({ isInsert: false });
        instance.setState = jest.fn();

        await instance._handleSubmit(true);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(props.updateLandingPage).toHaveBeenCalledWith({ "pageCode": "", "pageId": 22, "pageName": "", blockTargetCountry: '' });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Update Failed!");
    });

    it('_handleSubmit - updateLandingPage is failed', async () => {
        const result = { IsSuccessful: false, Message: "Updating has a error" };
        const props = Object.assign({}, defaultProps, { selectedLandingPageId: 22, updateLandingPage: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState({ isInsert: false });
        instance.setState = jest.fn();

        await instance._handleSubmit(true);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(props.updateLandingPage).toHaveBeenCalledWith({ "pageCode": "", "pageId": 22, "pageName": "", blockTargetCountry: '' });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(false, "Updating has a error");
    });

    it('_handleSubmit - updateLandingPage is successful', async () => {
        const result = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { selectedLandingPageId: 22, updateLandingPage: jest.fn(() => result), toggleLoader: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();

        instance._handleShowAlert = jest.fn();
        instance.setState({ isInsert: false });
        instance.setState = jest.fn();

        await instance._handleSubmit(true);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
        expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        expect(instance.setState).toHaveBeenCalledWith({ isClickedSubmit: true });
        expect(props.updateLandingPage).toHaveBeenCalledWith({ "pageCode": "", "pageId": 22, "pageName": "", blockTargetCountry: '' });
        expect(instance._handleShowAlert).toHaveBeenCalledWith(true, "Update Successfully!");
    });

    it('_handleShowAlert - should call setState, setTimeout and _hideMessage', async () => {
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        const instance = wrapper.instance();
        instance._handleShowAlert(false, 'Updated failed!');

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: 'Updated failed!' }, expect.any(Function)]);
    });

    it('_hideMessage - should call setState and _handleClosePopup', async () => {
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(instance._handleClosePopup).toHaveBeenCalled();
    });

    it('_hideMessage - should call setState and not call _handleClosePopup', async () => {
        const wrapper = shallow(<InsertUpdateForm {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._handleClosePopup = jest.fn();

        instance._hideMessage(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isShowMessage: false });
        expect(instance._handleClosePopup).not.toHaveBeenCalled();
    });

    it('_handleClosePopup - should call setselectedLandingPageId and setState', async () => {
        const props = Object.assign({}, defaultProps, { setSelectedLandingPageId: jest.fn() });
        const wrapper = shallow(<InsertUpdateForm {...props} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        instance._handleClosePopup();

        expect(props.setSelectedLandingPageId).toHaveBeenCalledWith(null);
        expect(instance.setState).toHaveBeenCalledWith({
            isClickedSubmit: false,
            isInsert: true,
            isShowMessage: false,
            isSuccess: true,
            message: '',
            isBlockAllTargetCountries: false,
            selectedLandingPage: {
                pageCode: "",
                pageName: "",
                blockTargetCountry: ''
            },
            targetCountryList: null
        });
    });
})