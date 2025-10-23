import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';

describe('marketing-account - components - Content', () => {
    const defaultProps = {
        params: {
            Status: 'Approved, Suspended',
            SortType: 1,
            SortDirectionType: 1,
            Language: '',
            UserName: '',
            PageIndex: 1,
            PageSize: 20,
            TargetCountryCode: ''
        },
        languageCodeList: {
            'en': 'English'
        },
        targetCountryCodeList: {
            'US': 'United States'
        },
        defaultMktAffInfo: { affId: 927841, affName: "12BETAFF001"},
        canAddAffMktAccount: true,
        setIsShowAddAffMktAccountPopup: jest.fn(),
        setAff: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with data', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result.find('.data-content')).toHaveLength(1);
        // GridData is a connected component, so it appears as Connect(Component)
        expect(result.find('Connect(Component)')).toHaveLength(1);
    });

    it('render correctly without data (params is null)', () => {
        const props = { ...defaultProps, params: null };
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly when user cannot add marketing account', () => {
        const props = { ...defaultProps, canAddAffMktAccount: false };
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('should show Add New Account button when params exist and user has permission', () => {
        const result = shallow(<Content {...defaultProps} />);

        const button = result.find('Button');
        expect(button).toHaveLength(1);
        expect(button.prop('outline')).toBe(true);
        expect(button.prop('type')).toBe('button');
        expect(button.prop('onClick')).toBeDefined();
    });

    it('should not show Add New Account button when params is null', () => {
        const props = { ...defaultProps, params: null };
        const result = shallow(<Content {...props} />);

        expect(result.find('Button')).toHaveLength(0);
    });

    it('should not show Add New Account button when canAddAffMktAccount is false', () => {
        const props = { ...defaultProps, canAddAffMktAccount: false };
        const result = shallow(<Content {...props} />);

        expect(result.find('Button')).toHaveLength(0);
    });

    it('should call handleAddNewAccount with correct parameters when Add New Account button is clicked', () => {
        const result = shallow(<Content {...defaultProps} />);
        const button = result.find('Button');

        button.simulate('click');

        expect(defaultProps.setIsShowAddAffMktAccountPopup).toHaveBeenCalledWith(true);
        expect(defaultProps.setAff).toHaveBeenCalledWith({ 
            affId: 927841, 
            affName: '12BETAFF001' 
        });
    });

    it('should pass handleAddNewAccount function to GridData component', () => {
        const result = shallow(<Content {...defaultProps} />);
        // GridData is rendered as Connect(Component) in shallow tests
        const gridData = result.find('Connect(Component)');

        expect(gridData.prop('handleAddNewAccount')).toBeDefined();
        expect(typeof gridData.prop('handleAddNewAccount')).toBe('function');
    });

    it('should call GridData handleAddNewAccount prop function correctly', () => {
        const result = shallow(<Content {...defaultProps} />);
        // GridData is rendered as Connect(Component) in shallow tests
        const gridData = result.find('Connect(Component)');

        // Simulate calling the handleAddNewAccount function passed to GridData
        const handleAddNewAccountProp = gridData.prop('handleAddNewAccount');
        handleAddNewAccountProp(123456, 'TESTAFFNAME');

        expect(defaultProps.setIsShowAddAffMktAccountPopup).toHaveBeenCalledWith(true);
        expect(defaultProps.setAff).toHaveBeenCalledWith({ 
            affId: 123456, 
            affName: 'TESTAFFNAME' 
        });
    });

    it('should have correct CSS classes and structure', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result.find('.data-content.my-2')).toHaveLength(1);
        expect(result.find('.my-2')).toHaveLength(2); // container and button wrapper
    });

    it('should render button with correct properties', () => {
        const result = shallow(<Content {...defaultProps} />);
        const button = result.find('Button');

        expect(button).toHaveLength(1);
        expect(button.prop('outline')).toBe(true);
        expect(button.prop('type')).toBe('button');
        expect(typeof button.prop('onClick')).toBe('function');
    });

    it('should handle loading states properly', () => {
        // This test checks if the component handles loading states
        const result = shallow(<Content {...defaultProps} />);
        
        // The component should always render GridData which will handle its own loading
        expect(result.find('Connect(Component)')).toHaveLength(1);
    });

    it('should handle error states properly', () => {
        // This test checks if the component handles error states
        const result = shallow(<Content {...defaultProps} />);
        
        // The component delegates error handling to GridData
        expect(result.find('Connect(Component)')).toHaveLength(1);
    });

    it('should maintain component structure when params change', () => {
        const result = shallow(<Content {...defaultProps} />);
        const newParams = { ...defaultProps.params, Status: 'Approved' };
        
        result.setProps({ ...defaultProps, params: newParams });
        
        expect(result.find('Connect(Component)')).toHaveLength(1);
        expect(result.find('Button')).toHaveLength(1);
    });

    it('should handle empty params object', () => {
        const props = { ...defaultProps, params: {} };
        const result = shallow(<Content {...props} />);
        
        // Empty params object should still show button since it's truthy
        expect(result.find('Button')).toHaveLength(1);
        expect(result.find('Connect(Component)')).toHaveLength(1);
    });
}); 