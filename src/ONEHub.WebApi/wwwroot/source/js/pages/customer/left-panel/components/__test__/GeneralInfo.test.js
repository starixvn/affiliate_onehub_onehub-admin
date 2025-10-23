import React from 'react';
import { GeneralInfo } from '../GeneralInfo';
import { shallow } from 'enzyme';

describe('left panel - components - Content', () => {
    it('render correctly with affiliateInfo', () => {
        const affiliateInfo = {
            AffId: 1271808,
            AffLink: "http://localhost:55690/Auth/AdminLogin?chalengeStr=esh5u7&accKey=E16156C28&custName=12BETAFF226&accId=1000000026&accOnId=8405",
            ParentAffName: "12BETAFF001",
            AffName: "12BETAFF002",
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
        const result = shallow(<GeneralInfo affiliateInfo={affiliateInfo} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with affiliateInfo not has http in siteurl', () => {
        const affiliateInfo = {
            AffId: 927841,
            AffLink: "http://localhost:55690/Auth/AdminLogin?chalengeStr=640eh6&accKey=3F9ADA82AD&custName=12BETAFF001&accId=1000000026&accOnId=8405",
            ParentAffName: "12BETAFF001",
            AffName: "12BETAFF002",
            AffType: 2,
            ApprovedBy: 'sa',
            BalanceBf: 4953349.1635,
            CommGroupName: "CG22124",
            ContactApps: '[{"Name":"MSN/YM/QQ","Value":"@","Order":0}]',
            FirstName: "媒体册 获取以更新吧！",
            Gender: false,
            GroupId: 152,
            LastLoginDateText: "04/12/2019 04:11:00",
            LastLoginIp: "10.18.200.125",
            LastName: "媒体册 获取以更新吧！",
            MoreSiteUrls: "w",
            NoSiteDesc: "好",
            Phone: "123456",
            PreferredLanguage: "en-US",
            SiteUrl: "www.betwiki.net",
            Status: "Approved"
        }
        const result = shallow(<GeneralInfo affiliateInfo={affiliateInfo} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with affiliateInfo not has http in siteurl', () => {
        const affiliateInfo = {
            AffId: 927841,
            AffLink: "http://localhost:55690/Auth/AdminLogin?chalengeStr=640eh6&accKey=3F9ADA82AD&custName=12BETAFF001&accId=1000000026&accOnId=8405",
            ParentAffName: "12BETAFF001",
            AffName: "12BETAFF002",
            AffType: 2,
            ApprovedBy: 'sa',
            BalanceBf: 4953349.1635,
            CommGroupName: "CG22124",
            ContactApps: '[{"Name":"MSN/YM/QQ","Value":"@","Order":0}]',
            FirstName: "媒体册 获取以更新吧！",
            Gender: false,
            GroupId: 152,
            LastLoginDateText: "04/12/2019 04:11:00",
            LastLoginIp: "10.18.200.125",
            LastName: "媒体册 获取以更新吧！",
            MoreSiteUrls: "w",
            NoSiteDesc: "好",
            Phone: "123456",
            PreferredLanguage: "en-US",
            SiteUrl: "www.betwiki.net",
            Status: "Approved"
        }
        const result = shallow(<GeneralInfo affiliateInfo={affiliateInfo} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with affiliateInfo has status not approved and gender is null', () => {
        const affiliateInfo = {
            AffId: 1219631,
            AffLink: "http://localhost:55690/Auth/AdminLogin?chalengeStr=5omp0h&accKey=6B8465&custName=12BETAFF016&accId=1000000026&accOnId=8405",
            ParentAffName: "12BETAFF001",
            AffName: "12BETAFF002",
            AffType: 2,
            ApprovedBy: '',
            BalanceBf: 0,
            CommGroupName: "",
            ContactApps: '[{"Name":"MSN/YM/QQ","Value":"123123123","Order":0}]',
            FirstName: "",
            Gender: null,
            GroupId: 0,
            LastLoginDateText: "01/01/1900 00:00:00",
            LastLoginIp: "10.10.12.12",
            LastName: "",
            MoreSiteUrls: "",
            NoSiteDesc: "",
            Phone: "123456789",
            PreferredLanguage: "en-US",
            SiteUrl: "http://www.12345678.com",
            Status: "Disapproved"
        }
        const result = shallow(<GeneralInfo affiliateInfo={affiliateInfo} />);

        expect(result).toMatchSnapshot();
    });


    it('_handleClickParentAffiliate - should call setAffName and getAffiliateInfo', () => {
        const affiliateInfo = {
            AffId: 1219631,
            AffLink: "http://localhost:55690/Auth/AdminLogin?chalengeStr=5omp0h&accKey=6B8465&custName=12BETAFF016&accId=1000000026&accOnId=8405",
            ParentAffName: "12BETAFF001",
            AffName: "12BETAFF002",
            AffType: 2,
            ApprovedBy: '',
            BalanceBf: 0,
            CommGroupName: "",
            ContactApps: '[{"Name":"MSN/YM/QQ","Value":"123123123","Order":0}]',
            FirstName: "",
            Gender: null,
            GroupId: 0,
            LastLoginDateText: "01/01/1900 00:00:00",
            LastLoginIp: "10.10.12.12",
            LastName: "",
            MoreSiteUrls: "",
            NoSiteDesc: "",
            Phone: "123456789",
            PreferredLanguage: "en-US",
            SiteUrl: "http://www.12345678.com",
            Status: "Disapproved"
        }
        const props = { affiliateInfo, setAffName: jest.fn(), getAffiliateInfo: jest.fn() };
        const result = shallow(<GeneralInfo {...props} />);
        result._handleClickParentAffiliate = jest.fn();

        result.find('Button').at(0).simulate('click');

        expect(props.setAffName).toHaveBeenCalledWith("12BETAFF001");
        expect(props.getAffiliateInfo).toHaveBeenCalledWith("12BETAFF001");
    });
});