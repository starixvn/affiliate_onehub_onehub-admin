import React from 'react';
import { ApprovedStatusInfo } from '../ApprovedStatusInfo';
import { shallow } from 'enzyme';
import ChangePasswordForm from '../../../../../common/components/ChangePasswordForm';

describe('left panel - components - general-info - ApprovedStatusInfo', () => {
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
    const props = {
        affiliateInfo,
        claimsPrincipal: { hasReadClaim: jest.fn(() => true)},
        affName: '12BETAFF226'
    }

    it('render correctly with affiliateInfo is not null ', () => {
        const result = shallow(<ApprovedStatusInfo {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('toggleChangingPassword - should call setChangingPassword when button change', () => {
        const wrapper = shallow(<ApprovedStatusInfo {...props} />);

        wrapper.find('Button').simulate('click', true);

        expect(wrapper.find(ChangePasswordForm).props().showPopupPassword).toBe(true);
    });
});