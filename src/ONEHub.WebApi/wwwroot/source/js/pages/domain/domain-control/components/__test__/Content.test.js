import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import NotificationPopup from '../../../../common/components/NotificationPopup';

describe('domain control - components - Content ', () => {
    const affDomainList = [
        {
            DomainId: 21,
            DomainName: "10.18.200.209:7613/Go"
        },
        {
            DomainId: 34,
            DomainName: "go.test.com"
        }
    ]

    const redirectDomainList = [
        {
            DomainId: 46,
            DomainName: "smart.123.vn"
        },
        {
            DomainId: 60,
            DomainName: "12liammobile"
        }
    ]

    const gridData = [
        {
            AffDomain: "10.18.200.209:7613/Go",
            AffDomainId: 21,
            CreatedDateText: "05/02/2018",
            Creator: "AAjenny",
            DomainControlId: 89,
            IsUsed: true,
            TargetCountry: "Chinese Simplified",
            TargetCountryCode: "zh-CN",
            RedirectDomain: "www.want.to",
            RedirectDomainId: 58
        },
        {
            AffDomain: "go.liam.com",
            AffDomainId: 47,
            CreatedDateText: "05/02/2018",
            Creator: "AAjenny",
            DomainControlId: 92,
            IsUsed: true,
            TargetCountry: "Chinese Simplified",
            TargetCountryCode: "zh-CN",
            RedirectDomain: "12liampc.com",
            RedirectDomainId: 59
        }
    ];

    const targetCountryList = [
        {
            TargetCountryCode: "en-GB",
            TargetCountryName: "English (Euro)"
        },
        {
            TargetCountryCode: "vi-VN",
            TargetCountryName: "VietNamese"
        }
    ]

    const defaultProps = {
        shouldResetScrollPosition: true,
        selectedTargetCountry: '',
        gridData,
        affDomainList,
        redirectDomainList,
        targetCountryList,
        affSubDomainList: [
            {
                columnKey: "test",
                columnName: "test",
                checked: true
            }
        ]
    };

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ message: 'has NotificationPopup' });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is null', () => {
        const props = Object.assign({}, defaultProps, { gridData: null, affDomainList: null, redirectDomainList: null, fetchDomain: jest.fn() })
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is empty', () => {
        const props = Object.assign({}, defaultProps, { gridData: [], isAffDomain: false })
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('_handleCloseNotificationPopup - should be called when close NotificationPopup', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ message: 'has NotificationPopup' });
        result.setState = jest.fn();

        result.find(NotificationPopup).props().onClose(false);

        expect(result.setState).toHaveBeenCalledWith({ message: '' });
    });

    it('_handleCloseNotificationPopup - should call setState and _deleteDomain', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ selectedDomainId: 123 });

        const instance = result.instance();
        result.setState = jest.fn();
        instance._deleteDomain = jest.fn();

        instance._handleCloseNotificationPopup(true);

        expect(result.setState).toHaveBeenCalledWith({ message: '' });
        expect(instance._deleteDomain).toHaveBeenCalledWith(123);
    });

    it('_handleDeleteDomain - should be called when click delete button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });

        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('Button').at(1).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ message: `Are you sure you want to delete this domain setting?`, isConfirmPopup: true, selectedDomainId: 89 });
    });

    it('_handleEditDomain - should be called when click edit button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setSelectedDomainId: jest.fn() });

        const wrapper = shallow(<Content {...props} />);
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setSelectedDomainId).toHaveBeenCalledWith(89);
    });

    it('_handleEditDomain - should be called when click add button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setSelectedDomainId: jest.fn() });

        const wrapper = shallow(<Content {...props} />);

        wrapper.find('Button').at(0).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setSelectedDomainId).toHaveBeenCalledWith(0);
    });

    it('_deleteDomain - should call deleteDomain with delete successfully', async () => {
        const expectedResult = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), fetchData: jest.fn(), deleteDomain: jest.fn(() => expectedResult) });
        const wrapper = shallow(<Content {...props} />);

        await wrapper.instance()._deleteDomain(2438);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
        expect(props.deleteDomain).toHaveBeenCalledWith({ DomainControlId: 2438 });
        expect(props.fetchData).toHaveBeenCalledWith('', defaultProps.affSubDomainList);
    });

    it('_deleteDomain - should call deleteDomain with delete is failed', async () => {
        const expectedResult = { IsSuccessful: false, Message: "Delete is failed!" };
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), deleteDomain: jest.fn(() => expectedResult) });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteDomain(2438);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
        expect(props.deleteDomain).toHaveBeenCalledWith({ DomainControlId: 2438 });
        expect(wrapper.setState).toHaveBeenCalledWith({ message: "Delete is failed!", isConfirmPopup: false });
    });

    it('_deleteDomain - should call deleteDomain with error', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), deleteDomain: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteDomain(2438);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
        expect(props.deleteDomain).toHaveBeenCalledWith({ DomainControlId: 2438 });
        expect(wrapper.setState).not.toHaveBeenCalled();
    });
})