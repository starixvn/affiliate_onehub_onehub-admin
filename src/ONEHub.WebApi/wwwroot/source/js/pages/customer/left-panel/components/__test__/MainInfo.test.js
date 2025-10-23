import React from 'react';
import { MainInfo } from '../MainInfo';
import { shallow } from 'enzyme';

describe('left panel - components - MainInfo', () => {
    it('render correctly with affiliateInfo is null', () => {
        const result = shallow(<MainInfo />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with affiliateInfo is not null', () => {
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
        }
        const result = shallow(<MainInfo affiliateInfo={affiliateInfo} />);

        expect(result).toMatchSnapshot();
    });
});