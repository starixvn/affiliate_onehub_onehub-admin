import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';

describe('marketing-account - components - Filter', () => {
    const defaultProps = {
        languageCodeList: {
            'en': 'English',
            'fr': 'French'
        },
        targetCountryCodeList: {
            'US': 'United States',
            'FR': 'France'
        },
        setParam: jest.fn(),
        setIsShowAddAffMktAccountPopup: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with empty lists', () => {
        const props = {
            ...defaultProps,
            languageCodeList: {},
            targetCountryCodeList: {}
        };
        const result = shallow(<Filter {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('should render all form elements', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        expect(wrapper.find('Input[name="targetCountry"]')).toHaveLength(1);
        expect(wrapper.find('Input[name="language"]')).toHaveLength(1);
        expect(wrapper.find('Input[name="status"]')).toHaveLength(1);
        expect(wrapper.find('Input[name="affiliate"]')).toHaveLength(1);
        expect(wrapper.find('Button')).toHaveLength(1);
    });

    it('should have correct initial values', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        expect(wrapper.find('Input[name="targetCountry"]').prop('value')).toBe('');
        expect(wrapper.find('Input[name="language"]').prop('value')).toBe('');
        expect(wrapper.find('Input[name="status"]').prop('value')).toBe('Approved, Suspended');
        expect(wrapper.find('Input[name="affiliate"]').prop('value')).toBe('');
    });

    it('should handle target country selection change', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const targetCountrySelect = wrapper.find('Input[name="targetCountry"]');

        targetCountrySelect.simulate('change', { target: { value: 'US' } });
        wrapper.update();

        expect(wrapper.find('Input[name="targetCountry"]').prop('value')).toBe('US');
    });

    it('should handle language selection change', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const languageSelect = wrapper.find('Input[name="language"]');

        languageSelect.simulate('change', { target: { value: 'en' } });
        wrapper.update();

        expect(wrapper.find('Input[name="language"]').prop('value')).toBe('en');
    });

    it('should handle status selection change', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const statusSelect = wrapper.find('Input[name="status"]');

        statusSelect.simulate('change', { target: { value: 'Approved' } });
        wrapper.update();

        expect(wrapper.find('Input[name="status"]').prop('value')).toBe('Approved');
    });

    it('should handle username input change', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const usernameInput = wrapper.find('Input[name="affiliate"]');

        usernameInput.simulate('change', { target: { value: 'testuser' } });
        wrapper.update();

        expect(wrapper.find('Input[name="affiliate"]').prop('value')).toBe('testuser');
    });

    it('should call setParam with correct parameters when search button is clicked', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        // Set some values first
        wrapper.find('Input[name="targetCountry"]').simulate('change', { target: { value: 'US' } });
        wrapper.find('Input[name="language"]').simulate('change', { target: { value: 'en' } });
        wrapper.find('Input[name="status"]').simulate('change', { target: { value: 'Approved' } });
        wrapper.find('Input[name="affiliate"]').simulate('change', { target: { value: 'testuser' } });

        // Click search button
        wrapper.find('Button').simulate('click');

        expect(defaultProps.setParam).toHaveBeenCalledWith({
            Status: 'Approved',
            SortType: 1,
            SortDirectionType: 1,
            Language: 'en',
            UserName: 'testuser',
            PageIndex: 1,
            PageSize: 20,
            TargetCountryCode: 'US'
        });
    });

    it('should call setParam with empty status when "All Statuses" is selected', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        // Keep default status (allStatuses) and click search
        wrapper.find('Button').simulate('click');

        expect(defaultProps.setParam).toHaveBeenCalledWith({
            Status: '',
            SortType: 1,
            SortDirectionType: 1,
            Language: '',
            UserName: '',
            PageIndex: 1,
            PageSize: 20,
            TargetCountryCode: ''
        });
    });

    it('should handle Enter key press in username input', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const usernameInput = wrapper.find('Input[name="affiliate"]');

        // Simulate Enter key press (charCode 13)
        usernameInput.simulate('keyPress', { 
            charCode: 13, 
            preventDefault: jest.fn() 
        });

        expect(defaultProps.setParam).toHaveBeenCalledWith({
            Status: '',
            SortType: 1,
            SortDirectionType: 1,
            Language: '',
            UserName: '',
            PageIndex: 1,
            PageSize: 20,
            TargetCountryCode: ''
        });
    });

    it('should not trigger search on non-Enter key press', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const usernameInput = wrapper.find('Input[name="affiliate"]');

        // Simulate other key press (charCode 65 = 'A')
        usernameInput.simulate('keyPress', { 
            charCode: 65,
            preventDefault: jest.fn() 
        });

        expect(defaultProps.setParam).not.toHaveBeenCalled();
    });

    it('should have proper form styling and structure', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);

        expect(wrapper.find('.filter-container')).toHaveLength(1);
        expect(wrapper.find('Form').prop('inline')).toBe(true);
        expect(wrapper.find('Form').prop('tag')).toBe('div');
    });

    it('should render search button with correct styling and icon', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const searchButton = wrapper.find('Button');

        expect(searchButton.prop('outline')).toBe(true);
        expect(searchButton.prop('color')).toBe('primary');
        expect(searchButton.prop('type')).toBe('button');
        expect(searchButton.find('span.oi-magnifying-glass')).toHaveLength(1);
    });
}); 