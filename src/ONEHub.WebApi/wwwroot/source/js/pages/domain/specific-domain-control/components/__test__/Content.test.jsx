import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import NotificationPopup from '../../../../common/components/NotificationPopup';
import { Table } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

describe('Content Component', () => {
    const mockGridData = [
        {
            SpecificDomainControlId: 1,
            AffUsername: 'testuser',
            AffDomain: 'test.com',
            RedirectDomain: 'redirect.com',
            Creator: 'creator',
            CreatedDate: '2024-01-01',
            Status: true,
            Editor: 'editor',
            UpdatedDate: '2024-01-02'
        },
        {
            SpecificDomainControlId: 2,
            AffUsername: 'testuser2',
            AffDomain: 'test2.com',
            RedirectDomain: 'redirect2.com',
            Creator: 'creator2',
            CreatedDate: '2024-01-02',
            Status: false,
            Editor: 'editor2',
            UpdatedDate: '2024-01-03'
        }
    ];

    const defaultProps = {
        shouldResetScrollPosition: true,
        gridData: mockGridData,
        param: 'test',
        pagingOption: { PageIndex: 1, PageSize: 10 },
        fetchData: jest.fn(),
        deleteSpecificDomain: jest.fn(),
        toggleLoader: jest.fn(),
        setSelectedDomainId: jest.fn(),
        setShouldResetScrollPosition: jest.fn(),
        setParam: jest.fn(),
        setPagingOption: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render correctly with grid data', () => {
            const wrapper = shallow(<Content {...defaultProps} />);
            wrapper.setState({ message: 'has NotificationPopup' });
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly with null grid data', () => {
            const props = { ...defaultProps, gridData: null };
            const wrapper = shallow(<Content {...props} />);
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly with empty grid data', () => {
            const props = { ...defaultProps, gridData: [] };
            const wrapper = shallow(<Content {...props} />);
            expect(wrapper).toMatchSnapshot();
        });

        it('should render table with correct props', () => {
            const wrapper = shallow(<Content {...defaultProps} />);
            const table = wrapper.find(Table);
            
            expect(table.exists()).toBe(true);
            expect(table.prop('minWidth')).toBe(1000);
            expect(table.prop('autoWidth')).toBe(true);
            expect(table.prop('bodyHeight')).toBe(300);
            expect(table.prop('isPaging')).toBe(true);
            expect(table.prop('shouldResetScrollPosition')).toBe(true);
        });
    });

    describe('Event Handlers', () => {
        it('should handle add new domain button click', () => {
            const wrapper = shallow(<Content {...defaultProps} />);
            const addButton = wrapper.find(Button).first();
            
            addButton.simulate('click');
            
            expect(defaultProps.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
            expect(defaultProps.setSelectedDomainId).toHaveBeenCalledWith(0);
        });

        it('should handle edit domain button click', () => {
            const wrapper = shallow(<Content {...defaultProps} />);
            const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(mockGridData)}</div>);
            const editButton = dataRow.find(Button).first();
            
            editButton.simulate('click');
            
            expect(defaultProps.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
            expect(defaultProps.setSelectedDomainId).toHaveBeenCalledWith(1);
        });

        it('should handle delete domain button click', () => {
            const wrapper = shallow(<Content {...defaultProps} />);
            wrapper.setState = jest.fn();
            const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(mockGridData)}</div>);
            const deleteButton = dataRow.find(Button).at(1);
            
            deleteButton.simulate('click');
            
            expect(defaultProps.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
            expect(wrapper.setState).toHaveBeenCalledWith({
                message: 'Are you sure you want to delete this specific domain setting?',
                isConfirmPopup: true,
                selectedDomainId: 1
            });
        });

        it('should handle notification popup close without confirmation', () => {
            const wrapper = shallow(<Content {...defaultProps} />);
            wrapper.setState({ message: 'test message' });
            wrapper.setState = jest.fn();
            
            wrapper.find(NotificationPopup).props().onClose(false);
            
            expect(wrapper.setState).toHaveBeenCalledWith({ message: '' });
        });

        it('should handle notification popup close with confirmation', async () => {
            const wrapper = shallow(<Content {...defaultProps} />);
            wrapper.setState({ selectedDomainId: 1 });
            wrapper.setState = jest.fn();
            const instance = wrapper.instance();
            instance._deleteDomain = jest.fn();
            
            instance._handleCloseNotificationPopup(true);
            
            expect(wrapper.setState).toHaveBeenCalledWith({ message: '' });
            expect(instance._deleteDomain).toHaveBeenCalledWith(1);
        });
    });

    describe('Domain Deletion', () => {
        it('should handle successful domain deletion', async () => {
            const mockResult = { IsSuccessful: true, Message: '' };
            const props = {
                ...defaultProps,
                deleteSpecificDomain: jest.fn().mockResolvedValue(mockResult)
            };
            const wrapper = shallow(<Content {...props} />);
            
            await wrapper.instance()._deleteDomain(1);
            
            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
            expect(props.toggleLoader.mock.calls[1][0]).toBe(false);
            expect(props.deleteSpecificDomain).toHaveBeenCalledWith({ SpecificDomainControlId: 1 });
            expect(props.fetchData).toHaveBeenCalledWith('test');
        });

        it('should handle failed domain deletion', async () => {
            const mockResult = { IsSuccessful: false, Message: 'Delete failed' };
            const props = {
                ...defaultProps,
                deleteSpecificDomain: jest.fn().mockResolvedValue(mockResult)
            };
            const wrapper = shallow(<Content {...props} />);
            wrapper.setState = jest.fn();
            
            await wrapper.instance()._deleteDomain(1);
            
            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(wrapper.setState).toHaveBeenCalledWith({
                message: 'Delete failed',
                isConfirmPopup: false
            });
        });

        it('should handle domain deletion error', async () => {
            const props = {
                ...defaultProps,
                deleteSpecificDomain: jest.fn().mockRejectedValue(new Error('API Error'))
            };
            const wrapper = shallow(<Content {...props} />);
            wrapper.setState = jest.fn();
            
            await wrapper.instance()._deleteDomain(1);
            
            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(wrapper.setState).toHaveBeenCalledWith({
                message: 'An error occurred while deleting the domain',
                isConfirmPopup: false
            });
        });
    });

    describe('Paging', () => {
        it('should handle paging changes', () => {
            const wrapper = shallow(<Content {...defaultProps} />);
            const table = wrapper.find(Table);
            
            table.prop('onPaging')(2, 20);
            
            expect(defaultProps.setPagingOption).toHaveBeenCalledWith({
                PageIndex: 2,
                PageSize: 20
            });
            expect(defaultProps.setParam).toHaveBeenCalledWith({
                ...defaultProps.param,
                PageIndex: 2,
                PageSize: 20
            });
        });
    });
}); 