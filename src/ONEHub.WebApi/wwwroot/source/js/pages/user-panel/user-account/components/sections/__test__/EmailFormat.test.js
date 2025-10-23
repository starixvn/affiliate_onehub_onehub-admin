import React from 'react';
import { EmailFormat } from '../EmailFormat';
import { shallow } from 'enzyme';

describe('user account - components - sections - EmailFormat', () => {
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
        ContactAppList: [{ Name: "MSN/YM/QQ", Value: "@123 Lê Văn", Order: 0 }]
    };
    const defaultProps = {
        userAccountInfo,
        setUserAccountInfo: jest.fn()
    }

    it('render correctly', () => {
        const result = shallow(<EmailFormat {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('handleChange - should be called when check Plain Text Format', () => {
        const result = shallow(<EmailFormat {...defaultProps} />);

        result.find('Input[type="radio"]').at(0).simulate('change');

        expect(defaultProps.setUserAccountInfo).toHaveBeenCalledWith({ ...userAccountInfo, MailOption: true });
    });

    it('handleChange - should be called when check Html Format', () => {
        const result = shallow(<EmailFormat {...defaultProps} />);

        result.find('Input[type="radio"]').at(1).simulate('change');

        expect(defaultProps.setUserAccountInfo).toHaveBeenCalledWith({ ...userAccountInfo, MailOption: false });
    });
});