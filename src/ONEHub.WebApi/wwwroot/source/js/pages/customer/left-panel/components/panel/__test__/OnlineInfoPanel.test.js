import React from 'react';
import { OnlineInfoPanel } from '../OnlineInfoPanel';
import { shallow } from 'enzyme';

describe('left panel - components - panel - OnlineInfoPanel', () => {
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

    const onlineInfoList = [
        {
            Ip: "10.19.10.55",
            ReloadTimeText: "07/09/2019 03:43:00"
        }
    ]
    const affName = '12BETAFF226';
    const defaultProps = {
        affiliateInfo,
        affName
    }

    it('render correctly with onlineInfoList is null', () => {
        const toggleLoaderLeftPanel = jest.fn();
        const getOnLineList = jest.fn(() => onlineInfoList);
        const props = Object.assign({}, defaultProps, { toggleLoaderLeftPanel, getOnLineList });
        const result = shallow(<OnlineInfoPanel {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with onlineInfoList is not null', () => {
        const toggleLoaderLeftPanel = jest.fn();
        const getOnLineList = jest.fn(() => onlineInfoList);
        const props = Object.assign({}, defaultProps, { toggleLoaderLeftPanel, getOnLineList });
        const result = shallow(<OnlineInfoPanel {...props} />);

        result.setState({ onlineInfoList });

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call handleGetOnLineList', async () => {
        const toggleLoaderLeftPanel = jest.fn();
        const getOnLineList = jest.fn(() => onlineInfoList);
        const props = Object.assign({}, defaultProps, { toggleLoaderLeftPanel, getOnLineList });
        const wrapper = shallow(<OnlineInfoPanel {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance().componentDidMount();

        expect(props.toggleLoaderLeftPanel).toHaveBeenCalledTimes(4);
        expect(props.toggleLoaderLeftPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderLeftPanel.mock.calls[1][0]).toBe(true);
        expect(props.toggleLoaderLeftPanel.mock.calls[2][0]).toBe(false);
        expect(props.toggleLoaderLeftPanel.mock.calls[3][0]).toBe(false);
        expect(props.getOnLineList).toHaveBeenCalledWith(affName);
        expect(wrapper.setState).toHaveBeenCalledWith({ onlineInfoList });
    });

    it('componentDidUpdate - should call handleGetOnLineList', async () => {
        const toggleLoaderLeftPanel = jest.fn();
        const getOnLineList = jest.fn(() => onlineInfoList);
        const props = Object.assign({}, defaultProps, { toggleLoaderLeftPanel, getOnLineList });
        const wrapper = shallow(<OnlineInfoPanel {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance().componentDidUpdate({ affiliateInfo, affName: '123abc' });

        expect(props.toggleLoaderLeftPanel).toHaveBeenCalledTimes(4);
        expect(props.toggleLoaderLeftPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderLeftPanel.mock.calls[1][0]).toBe(true);
        expect(props.toggleLoaderLeftPanel.mock.calls[2][0]).toBe(false);
        expect(props.toggleLoaderLeftPanel.mock.calls[3][0]).toBe(false);
        expect(props.getOnLineList).toHaveBeenCalledWith(affName);
        expect(wrapper.setState).toHaveBeenCalledWith({ onlineInfoList });
    });

    it('handleGetOnLineList - should call toggleLoaderLeftPanel, getOnLineList and setState', async () => {
        const toggleLoaderLeftPanel = jest.fn();
        const getOnLineList = jest.fn(() => onlineInfoList);
        const props = Object.assign({}, defaultProps, { toggleLoaderLeftPanel, getOnLineList });
        const wrapper = shallow(<OnlineInfoPanel {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance().handleGetOnLineList(affName);

        expect(props.toggleLoaderLeftPanel).toHaveBeenCalledTimes(4);
        expect(props.toggleLoaderLeftPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderLeftPanel.mock.calls[1][0]).toBe(true);
        expect(props.toggleLoaderLeftPanel.mock.calls[2][0]).toBe(false);
        expect(props.toggleLoaderLeftPanel.mock.calls[3][0]).toBe(false);
        expect(props.getOnLineList).toHaveBeenCalledWith(affName);
        expect(wrapper.setState).toHaveBeenCalledWith({ onlineInfoList });
    });
});