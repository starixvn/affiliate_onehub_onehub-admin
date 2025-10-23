import React from 'react';
import { Language } from '../Language';
import { shallow } from 'enzyme';

describe('left panel - components - general-info - Language', () => {
    const affiliateInfo = {
        AffId: 1271808,
        AffLink: "http://localhost:55690/Auth/AdminLogin?chalengeStr=esh5u7&accKey=E16156C28&custName=12BETAFF226&accId=1000000026&accOnId=8405",
        AffName: "12BETAFF226",
        AffType: 2,
        BalanceBf: 9802280.5446,
        CommGroupName: "NoCommission",
        ContactApps: '[{"Name":"MSN/YM/QQ","Value":"@123","Order":0}]',
        FirstName: "bb",
        Gender: true,
        GroupId: 102,
        LastLoginDateText: "04/11/2019 22:24:00",
        LastLoginIp: "10.18.200.125",
        LastName: "12BETAFF226",
        MoreSiteUrls: "www.sportsbookie.com;www.gzyyy.com;www.123.com",
        NoSiteDesc: "",
        Phone: "abc",
        PreferredLanguage: "vi-VN",
        SiteUrl: "https://aff-12b.nexdev.net/UserAsian/UserPanel/Main/#MyAccount",
        Status: "Approved"
    };

    const languageList = [
        {
            LanguageCode: "en-US",
            LanguageName: "English"
        },
        {
            LanguageCode: "vi-VN",
            LanguageName: "Vietnamese"
        }
    ]

    const defaultProps = {
        affiliateInfo,
        languageList,
        affName: '12BETAFF226'
    }

    it('render correctly with isChangingLanguage is false', () => {
        const result = shallow(<Language {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with isChangingLanguage is true', () => {
        const result = shallow(<Language {...defaultProps} />);

        result.setState({ isChangingLanguage: true });

        expect(result).toMatchSnapshot();
    });

    it('toggleChangingLanguage - should call setState when click button', () => {
        const wrapper = shallow(<Language {...defaultProps} />);
        wrapper.setState = jest.fn((val, fn) => fn());
        wrapper.instance().languageDropdown.current = jest.fn();
        wrapper.instance().languageDropdown.current.focus = jest.fn();

        wrapper.find('Button').simulate('click', true);

        expect(wrapper.setState).toHaveBeenCalledWith({ isChangingLanguage: true }, expect.any(Function));
    });

    it('toggleChangingLanguage - should call setState when onBlur select', () => {
        const wrapper = shallow(<Language {...defaultProps} />);
        wrapper.setState({ isChangingLanguage: true });
        wrapper.setState = jest.fn();

        wrapper.find('select').simulate('blur', false);

        expect(wrapper.setState).toHaveBeenCalledWith({ isChangingLanguage: false }, expect.any(Function));
    });

    it('_handleChangeLanguage - should call setState when change language select', () => {
        const wrapper = shallow(<Language {...defaultProps} />);
        wrapper.setState({ isChangingLanguage: true });
        wrapper.setState = jest.fn();

        wrapper.find('select').simulate('change', { target: { value: 'en-US' } });

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: "Are you sure you want to change language for this affiliate?", isConfirmPopup: true, preferredLanguage: 'en-US' });
    });

    it('_changeLanguage - should call updateLanguage and setState when change language select', async () => {
        const data = { IsSuccessful: false, Message: 'Change language is failed!' };
        const updateLanguage = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { updateLanguage });
        const wrapper = shallow(<Language {...props} />);
        wrapper.setState({ isChangingLanguage: true });
        wrapper.setState = jest.fn();

        await wrapper.instance()._changeLanguage('en-US');

        expect(props.updateLanguage).toHaveBeenCalledWith({ AffId: 1271808, PreferredLanguage: "en-US" });
        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: 'Change language is failed!', isConfirmPopup: false });
    });

    it('handleChangeLanguage - should call updateLanguage, setState and getAffiliateInfo when change language successfully', async () => {
        const data = { IsSuccessful: true, Message: '' };
        const updateLanguage = jest.fn(() => data);
        const getAffiliateInfo = jest.fn();
        const props = Object.assign({}, defaultProps, { updateLanguage, getAffiliateInfo });
        const wrapper = shallow(<Language {...props} />);
        wrapper.setState({ isChangingLanguage: true });
        wrapper.setState = jest.fn();

        await wrapper.instance()._changeLanguage('en-US');

        expect(props.updateLanguage).toHaveBeenCalledWith({ AffId: 1271808, PreferredLanguage: "en-US" });
        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: 'The Language has been updated successfully!', isConfirmPopup: false });
        expect(props.getAffiliateInfo).toHaveBeenCalledWith('12BETAFF226');
    });

    it('handleCloseNotificationPopup - should call setState and _changeLanguage', async () => {
        const wrapper = shallow(<Language {...defaultProps} />);
        wrapper.setState({ preferredLanguage: 'en-US' });
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._changeLanguage = jest.fn();

        await instance.handleCloseNotificationPopup(true);

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: '' });
        expect(instance._changeLanguage).toHaveBeenCalledWith('en-US');
    });

    it('handleCloseNotificationPopup - should call setState but not call _changeLanguage', async () => {
        const wrapper = shallow(<Language {...defaultProps} />);
        wrapper.setState = jest.fn();
        const instance = wrapper.instance();
        instance._changeLanguage = jest.fn();

        await instance.handleCloseNotificationPopup(false);

        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: '' });
        expect(instance._changeLanguage).not.toHaveBeenCalled();
    });
});