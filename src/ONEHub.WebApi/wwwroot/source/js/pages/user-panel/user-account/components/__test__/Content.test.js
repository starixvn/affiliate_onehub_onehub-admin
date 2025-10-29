import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import { async } from 'regenerator-runtime';

describe('user account - components - Content', () => {
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
        SiteUrl: "abc.com",
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
        ContactAppList: [{ Name: "MSN/YM/QQ", Value: "@123 Lê Văn", Order: 0 }],
        HasWebSite: true
    };

    const paymentMethod = {
        PaymentMethods: [
            { Key: 'Player', Value: 'Bwing Player Account' },
            { key: 'Moneybookers', value: 'Moneybookers' },
            { key: 'Wire', value: 'Bank Transfer' }
        ],
        MinAmount: 23000
    };

    const defaultProps = {
        affId: 1271808,
        affName: "12BETAFF226",
        userAccountInfo,
        moreSiteUrlsList: ["www.sportsbookie.com", "www.gzyyy.com", "www.123.com"],
        getUserAccountInfo: jest.fn(() => userAccountInfo),
        claimsPrincipal: { hasReadClaim: jest.fn(() => true), hasWriteClaim: jest.fn(() => true), hasClaim: jest.fn(() => true) },
        getPaymentMethod: jest.fn(() => paymentMethod, () => paymentMethod),
        licenseeName: '12Bet'
    }

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with isSuccess is false', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call getUserAccountInfo', async () => {
        const result = shallow(<Content {...defaultProps} />);
        const instance = result.instance();
        instance.setState = jest.fn();

        await instance.componentDidMount();

        expect(defaultProps.getUserAccountInfo).toHaveBeenCalledWith(1271808);
        expect(instance.setState).toHaveBeenCalled();
    });

    it('componentDidMount - should call getUserAccountInfo, but getPaymentMethod return empty', async () => {
        const props = { ...defaultProps, getPaymentMethod: jest.fn() }
        const result = shallow(<Content {...props} />);
        const instance = result.instance();
        instance.setState = jest.fn();

        await instance.componentDidMount();

        expect(defaultProps.getUserAccountInfo).toHaveBeenCalledWith(1271808);
        expect(instance.setState).not.toHaveBeenCalled();
    });

    it('handleGetMoreSiteUrls - should return correct data', () => {
        const result = shallow(<Content {...defaultProps} />);

        const siteUrlList = result.instance().handleGetMoreSiteUrls(defaultProps.moreSiteUrlsList);

        expect(siteUrlList).toEqual('www.sportsbookie.com;www.gzyyy.com;www.123.com');
    });

    it('handleTrimObject - should return correct data with Has Website', () => {
        const newUserAccountInfo = Object.assign({}, userAccountInfo, { AffName: "    12BETAFF226    " });
        const props = Object.assign({}, defaultProps, { userAccountInfo: newUserAccountInfo });
        const result = shallow(<Content {...props} />);

        const objectAfterTrim = result.instance().handleTrimObject(newUserAccountInfo);

        expect(objectAfterTrim).toEqual(userAccountInfo);
    });

    it('handleTrimObject - should return correct data with Do not Has Website', () => {
        const newUserAccountInfo = Object.assign({}, userAccountInfo, { AffName: "    12BETAFF226    ", HasWebSite: false });
        const props = Object.assign({}, defaultProps, { userAccountInfo: newUserAccountInfo });
        const result = shallow(<Content {...props} />);

        const objectAfterTrim = result.instance().handleTrimObject(newUserAccountInfo);

        expect(objectAfterTrim).toEqual({ ...userAccountInfo, HasWebSite: false, SiteUrl: '' });
    });

    it('handleSubmit - should update successfully', async () => {
        const expectedResponse = { IsSuccessful: true, }
        const props = Object.assign({}, defaultProps, { updateUserAccount: jest.fn(() => expectedResponse), getAffiliateInfo: jest.fn() });
        const result = shallow(<Content {...props} />);
        const instance = result.instance();
        instance.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn && fn());
        window.scrollTo = jest.fn();

        await instance.handleSubmit();

        expect(instance.setState).toHaveBeenCalledTimes(2);
        expect(instance.setState.mock.calls[0][0]).toEqual({
            "minimumPayment": 23000,
            "paymentMethodList": paymentMethod.PaymentMethods
        });
        expect(instance.setState.mock.calls[0][1]).toEqual();

        expect(props.updateUserAccount).toHaveBeenCalled();
    });

    it('handleSubmit - should update failed', async () => {
        const expectedResponse = { IsSuccessful: false, Message: "Failed!" }
        const props = Object.assign({}, defaultProps, { updateUserAccount: jest.fn(() => expectedResponse), getAffiliateInfo: jest.fn() });
        const result = shallow(<Content {...props} />);
        const instance = result.instance();
        instance.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn && fn());
        window.scrollTo = jest.fn();

        await instance.handleSubmit();

        expect(instance.setState).toHaveBeenCalledTimes(2);
        expect(instance.setState.mock.calls[1][0]).toEqual({ isShowMessage: true, isSuccess: false, message: 'Failed!' });
        expect(instance.setState.mock.calls[1][1]).toEqual(expect.any(Function));

        expect(props.updateUserAccount).toHaveBeenCalled();
        expect(props.getAffiliateInfo).not.toHaveBeenCalled();
    });

    it('handleSubmit - should has error', async () => {
        const props = Object.assign({}, defaultProps, { updateUserAccount: jest.fn() });
        const result = shallow(<Content {...props} />);
        const instance = result.instance();
        instance.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn && fn());
        window.scrollTo = jest.fn();

        await instance.handleSubmit();

        expect(instance.setState).toHaveBeenCalledTimes(2);
        expect(instance.setState.mock.calls[1][0]).toEqual({ isShowMessage: true, isSuccess: false, message: 'Update is failed!' });
        expect(instance.setState.mock.calls[1][1]).toEqual(expect.any(Function));

        expect(props.updateUserAccount).toHaveBeenCalled();
    });

    it('handleSubmit - invalid data', async () => {
        const newUserAccountInfo = Object.assign({}, userAccountInfo, { Country: 'abc', Gender: null, Email: "abc", PlayerUsername: "" });
        const props = Object.assign({}, defaultProps, { updateUserAccount: jest.fn(), userAccountInfo: newUserAccountInfo, moreSiteUrlsList: ["www.sportsbookie.com", "", "www.123.com"] });
        const result = shallow(<Content {...props} />);
        const instance = result.instance();
        instance.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn && fn());
        window.scrollTo = jest.fn();

        await instance.handleSubmit();

        expect(instance.setState).toHaveBeenCalledTimes(2);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isShowMessage: true, isSuccess: false, message: 'Gender is empty, Please Check!<br />Please select country<br />Website URL 3 is required<br />User Name is required<br />' });
        expect(instance.setState.mock.calls[0][1]).toEqual(expect.any(Function));

        expect(props.updateUserAccount).not.toHaveBeenCalled();
    });

    it('handleSubmit - invalid Moneybookers PreferredPayment', async () => {
        const newUserAccountInfo = Object.assign({}, userAccountInfo, { PreferredPayment: 'Moneybookers', MoneybookersEmail: "", HasWebSite: false });
        const props = Object.assign({}, defaultProps, { updateUserAccount: jest.fn(), userAccountInfo: newUserAccountInfo, moreSiteUrlsList: null });
        const result = shallow(<Content {...props} />);
        const instance = result.instance();
        instance.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn && fn());
        window.scrollTo = jest.fn();

        await instance.handleSubmit();

        expect(instance.setState).toHaveBeenCalledTimes(2);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isShowMessage: true, isSuccess: false, message: "Please describe how you would like to promote 12Bet if you don't have the URL is required<br />Moneybookers Email is required<br />" });
        expect(instance.setState.mock.calls[0][1]).toEqual(expect.any(Function));

        expect(props.updateUserAccount).not.toHaveBeenCalled();
    });

    it('handleSubmit - invalid Wire PreferredPayment', async () => {
        const newUserAccountInfo = Object.assign({}, userAccountInfo, { PreferredPayment: 'Wire', BankAccountNumber: "", });
        const props = Object.assign({}, defaultProps, { updateUserAccount: jest.fn(), userAccountInfo: newUserAccountInfo });
        const result = shallow(<Content {...props} />);
        const instance = result.instance();
        instance.setState = jest.fn((obj, fn) => fn && fn());
        window.setTimeout = jest.fn((fn, time) => fn && fn());
        window.scrollTo = jest.fn();

        await instance.handleSubmit();

        expect(instance.setState).toHaveBeenCalledTimes(2);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isShowMessage: true, isSuccess: false, message: 'Bank Account Number is required<br />' });
        expect(instance.setState.mock.calls[0][1]).toEqual(expect.any(Function));

        expect(props.updateUserAccount).not.toHaveBeenCalled();
    });

    it('hideMessage - should call setState', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState = jest.fn();

        result.instance().hideMessage();

        expect(result.setState).toHaveBeenCalledWith({ isShowMessage: false });
    });
});