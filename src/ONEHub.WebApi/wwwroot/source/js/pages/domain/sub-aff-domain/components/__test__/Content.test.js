import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import NotificationPopup from '../../../../common/components/NotificationPopup';

describe('sub-affiliate domain - components - Content ', () => {
    const gridData = [
        {
            CreatedDateText: '4/19/2018',
            Creator: "sa",
            DomainName: "bet.go.com",
            DomainId: 2438,
            IsSSL: true
        },
        {
            CreatedDateText: '8/1/2018',
            Creator: "sa",
            DomainName: "abc.com",
            DomainId: 2437,
            IsSSL: false
        }
    ];

    const defaultProps = {
        shouldResetScrollPosition: true,
        gridData,
        fetchData: jest.fn()
    };

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ message: 'has NotificationPopup' });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is null', () => {
        const props = Object.assign({}, defaultProps, { gridData: null })
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is empty', () => {
        const props = Object.assign({}, defaultProps, { gridData: [] })
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

    it('_handleCloseNotificationPopup - should call setState and _deleteSubAffDomain', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ selectedSubAffDomainId: 123 });

        const instance = result.instance();
        result.setState = jest.fn();
        instance._deleteSubAffDomain = jest.fn();

        instance._handleCloseNotificationPopup(true);

        expect(result.setState).toHaveBeenCalledWith({ message: '' });
        expect(instance._deleteSubAffDomain).toHaveBeenCalledWith(123);
    });

    it('_handledeleteSubAffDomain - should be called when click delete button with sub-affiliate domain', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn() });

        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('Button').at(1).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(wrapper.setState).toHaveBeenCalledWith({ message: `Are you sure you want to delete this sub-affiliate domain?`, isConfirmPopup: true, selectedSubAffDomainId: 2438 });
    });

    it('_handleEditDomain - should be called when click edit button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setSelectedSubAffDomain: jest.fn() });

        const wrapper = shallow(<Content {...props} />);
        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setSelectedSubAffDomain).toHaveBeenCalledWith({ domainId: 2438, domainName: 'bet.go.com', isSSL: true });
    });

    it('_handleEditDomain - should be called when click add button', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setSelectedSubAffDomain: jest.fn() });

        const wrapper = shallow(<Content {...props} />);

        wrapper.find('Button').at(0).simulate('click');

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setSelectedSubAffDomain).toHaveBeenCalledWith({ domainId: 0, domainName: '', isSSL: true });
    });

    it('_deleteSubAffDomain - should call deleteSubAffDomain with delete successfully', async () => {
        const expectedResult = { IsSuccessful: true, Message: "" };
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), deleteSubAffDomain: jest.fn(() => expectedResult) });
        const wrapper = shallow(<Content {...props} />);

        await wrapper.instance()._deleteSubAffDomain(2438);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
        expect(props.deleteSubAffDomain).toHaveBeenCalledWith({ DomainId: 2438 });
        expect(props.fetchData).toHaveBeenCalled();
    });

    it('_deleteSubAffDomain - should call deleteSubAffDomain with delete is failed', async () => {
        const expectedResult = { IsSuccessful: false, Message: "Delete is failed!" };
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), deleteSubAffDomain: jest.fn(() => expectedResult) });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteSubAffDomain(2438);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
        expect(props.deleteSubAffDomain).toHaveBeenCalledWith({ DomainId: 2438 });
        expect(wrapper.setState).toHaveBeenCalledWith({ message: "Delete is failed!", isConfirmPopup: false });
    });

    it('_deleteSubAffDomain - should call deleteSubAffDomain with error', async () => {
        const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), deleteSubAffDomain: jest.fn() });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance()._deleteSubAffDomain(2438);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
        expect(props.deleteSubAffDomain).toHaveBeenCalledWith({ DomainId: 2438 });
        expect(wrapper.setState).not.toHaveBeenCalled();
    });
})