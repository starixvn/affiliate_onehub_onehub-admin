import React from 'react';
import { WebSite } from '../WebSite';
import { shallow } from 'enzyme';
import NotificationPopup from '../../../../../common/components/NotificationPopup';

describe('user account - components - sections - WebSite', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const userAccountInfo = {
        AffId: 1271808,
        AffName: "12BETAFF226",
        FirstName: "Hinh",
        LastName: "Lê Văn",
        Gender: false,
        Email: "hubert.duong_1@nexcel.vn",
        Phone: "abc",
        Address: "lê thị hồng",
        City: "Hồ Chí Minh",
        State: "700000",
        Postcode: "700000",
        Country: "Viet Nam",
        SiteUrl: "https://aff-12b.nexdev.net/UserAsian/UserPanel/Main/#MyAccount",
        MoreSiteUrls: "www.sportsbookie.com;www.gzyyy.com;www.123.com",
        NoSiteDesc: "",
        PreferredPayment: "Player",
        PlayerUsername: "bettingexp",
        NetellerAccountId: "1",
        MoneybookersEmail: "duong@gmail.com",
        BankName: "Bank Name",
        BankAddress: "Bank Address",
        BankCode: "Bank ABA/Swift/Sort Code",
        BankAccountName: "Bank Account Name",
        BankAccountNumber: "Bank Account Number",
        Question: "What?",
        Answer: "What?",
        MailOption: false,
        HasWebSite: true,
        ContactAppList: [{ Name: "MSN/YM/QQ", Value: "@123 Lê Văn", Order: 0 }]
    };
    const defaultProps = {
        userAccountInfo,
        moreSiteUrlsList: ["www.sportsbookie.com", "www.gzyyy.com", "www.123.com"],
        setUserAccountInfo: jest.fn(),
        setMoreSiteUrlsList: jest.fn()
    }

    it('render correctly', () => {
        const result = shallow(<WebSite {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly when has NotificationPopup', () => {
        const result = shallow(<WebSite {...defaultProps} />);
        result.setState({ messageNotification: 'abc' });

        expect(result).toMatchSnapshot();
    });

    it('setState - should be called when call onClose in NotificationPopup', () => {
        const result = shallow(<WebSite {...defaultProps} />);
        result.setState({ messageNotification: 'abc' });
        result.setState = jest.fn();

        result.find(NotificationPopup).props().onClose();

        expect(result.setState).toHaveBeenCalledWith({ messageNotification: '' });
    });

    it('handleChange - should call setUserAccountInfo', () => {
        const result = shallow(<WebSite {...defaultProps} />);

        result.instance().handleChange({ target: { name: 'siteUrl', value: 'abc.com' } });

        expect(defaultProps.setUserAccountInfo).toHaveBeenCalledWith({ ...userAccountInfo, SiteUrl: 'abc.com' });
    });

    it('handleChangeMoreUrl - should call setMoreSiteUrlsList', () => {
        const result = shallow(<WebSite {...defaultProps} />);

        result.instance().handleChangeMoreUrl({ target: { name: '0', value: 'www.abc.com' } });

        expect(defaultProps.setMoreSiteUrlsList).toHaveBeenCalledWith(["www.abc.com", "www.gzyyy.com", "www.123.com"]);
    });

    it('handleAddUrl - when moreSiteUrlsList has item empty', () => {
        const props = Object.assign({}, defaultProps, { moreSiteUrlsList: ["www.abc.com", "   ", "www.123.com"] });
        const result = shallow(<WebSite {...props} />);
        result.setState = jest.fn();
        result.instance().moreSiteUrlsRefs[1].current = jest.fn();
        result.instance().moreSiteUrlsRefs[1].current.focus = jest.fn();

        result.instance().handleAddUrl();

        expect(result.setState).toHaveBeenCalledWith({ messageNotification: `Please input Website URL 3` });
    });

    it('handleAddUrl - when moreSiteUrlsList has not item empty', () => {
        const result = shallow(<WebSite {...defaultProps} />);

        result.instance().handleAddUrl();

        expect(defaultProps.setMoreSiteUrlsList).toHaveBeenCalledWith(["www.abc.com", "www.gzyyy.com", "www.123.com", ""]);
    });

    it('handleAddUrl - when SiteUrl is empty', () => {
        const item = { ...userAccountInfo, SiteUrl: '' }
        const props = { ...defaultProps, userAccountInfo: item }
        const result = shallow(<WebSite {...props} />);
        result.setState = jest.fn();

        result.instance().handleAddUrl();

        expect(result.setState).toHaveBeenCalledWith({ messageNotification: `Please input Website URL` });
    });

    it('handleDeleteUrl - should be called when click Del button', () => {
        const result = shallow(<WebSite {...defaultProps} />);

        result.find('Button[color="danger"]').at(0).simulate('click');

        expect(defaultProps.setMoreSiteUrlsList).toHaveBeenCalledWith(["www.gzyyy.com", "www.123.com", ""]);
    });

    it('handleChangeHasWebSite - should be called when click Have Website input', () => {
        const item = { ...userAccountInfo, HasWebSite: false }
        const props = { ...defaultProps, userAccountInfo: item, setUserAccountInfo: jest.fn() }
        const result = shallow(<WebSite {...props} />);

        result.find('Input[type="radio"]').at(0).simulate('change');

        expect(props.setUserAccountInfo).toHaveBeenCalledWith(userAccountInfo);
    });

    it('handleChangeHasWebSite - should be called when click Do Not Have Website input', () => {
        const expectedResult = { ...userAccountInfo, HasWebSite: false }
        const props = { ...defaultProps, setUserAccountInfo: jest.fn() }
        const result = shallow(<WebSite {...props} />);

        result.find('Input[type="radio"]').at(1).simulate('change');

        expect(props.setUserAccountInfo).toHaveBeenCalledWith(expectedResult);
    });
});