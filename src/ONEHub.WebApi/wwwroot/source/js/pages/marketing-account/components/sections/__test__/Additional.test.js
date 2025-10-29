import React from 'react';
import { Additional } from '../Additional';
import { shallow } from 'enzyme';

describe('marketing-account - sections - Additional', () => {
    const defaultProps = {
        additionalInfo: {
            address: '',
            city: '',
            state: '',
            postcode: '',
            country: '',
            question: 'What is your favorite color?',
            answer: 'Blue'
        },
        setAdditionalInfo: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        const result = shallow(<Additional {...defaultProps} />);
        expect(result).toMatchSnapshot();
    });

    it('should render all form fields correctly', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);

        // Check for fieldset and legend
        expect(wrapper.find('fieldset')).toHaveLength(1);
        expect(wrapper.find('legend h6').text()).toBe('Additional Information');

        // Check for all RowField components
        const rowFields = wrapper.find('RowField');
        expect(rowFields).toHaveLength(7);

        // Check field labels
        expect(rowFields.at(0).prop('label')).toBe('Address');
        expect(rowFields.at(1).prop('label')).toBe('City');
        expect(rowFields.at(2).prop('label')).toBe('State');
        expect(rowFields.at(3).prop('label')).toBe('Postcode/Zip');
        expect(rowFields.at(4).prop('label')).toBe('Country');
        expect(rowFields.at(5).prop('label')).toBe('Security Question');
        expect(rowFields.at(6).prop('label')).toBe('Answer');
    });

    it('should pass correct props to each RowField', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        const rowFields = wrapper.find('RowField');

        // Address field
        expect(rowFields.at(0).prop('name')).toBe('address');
        expect(rowFields.at(0).prop('value')).toBe('');
        expect(typeof rowFields.at(0).prop('onChange')).toBe('function');

        // City field
        expect(rowFields.at(1).prop('name')).toBe('city');
        expect(rowFields.at(1).prop('value')).toBe('');

        // State field
        expect(rowFields.at(2).prop('name')).toBe('state');
        expect(rowFields.at(2).prop('value')).toBe('');

        // Postcode field
        expect(rowFields.at(3).prop('name')).toBe('postcode');
        expect(rowFields.at(3).prop('value')).toBe('');

        // Country field should have selectOptions
        expect(rowFields.at(4).prop('name')).toBe('country');
        expect(rowFields.at(4).prop('selectOptions')).toBeDefined();
        expect(Array.isArray(rowFields.at(4).prop('selectOptions'))).toBe(true);
    });

    it('should render with filled data', () => {
        const filledProps = {
            ...defaultProps,
            additionalInfo: {
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                postcode: '10001',
                country: 'US',
                question: 'What is your favorite color?',
                answer: 'Blue'
            }
        };

        const wrapper = shallow(<Additional {...filledProps} />);
        const rowFields = wrapper.find('RowField');

        expect(rowFields.at(0).prop('value')).toBe('123 Main St');
        expect(rowFields.at(1).prop('value')).toBe('New York');
        expect(rowFields.at(2).prop('value')).toBe('NY');
        expect(rowFields.at(3).prop('value')).toBe('10001');
        expect(rowFields.at(4).prop('value')).toBe('US');
    });

    it('should handle address field change', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        const addressField = wrapper.find('RowField').at(0);

        addressField.prop('onChange')({ target: { name: 'address', value: '456 Oak St' } });

        expect(defaultProps.setAdditionalInfo).toHaveBeenCalledWith({
            ...defaultProps.additionalInfo,
            address: '456 Oak St'
        });
    });

    it('should handle city field change', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        const cityField = wrapper.find('RowField').at(1);

        cityField.prop('onChange')({ target: { name: 'city', value: 'Los Angeles' } });

        expect(defaultProps.setAdditionalInfo).toHaveBeenCalledWith({
            ...defaultProps.additionalInfo,
            city: 'Los Angeles'
        });
    });

    it('should handle state field change', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        const stateField = wrapper.find('RowField').at(2);

        stateField.prop('onChange')({ target: { name: 'state', value: 'CA' } });

        expect(defaultProps.setAdditionalInfo).toHaveBeenCalledWith({
            ...defaultProps.additionalInfo,
            state: 'CA'
        });
    });

    it('should handle postcode field change', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        const postcodeField = wrapper.find('RowField').at(3);

        postcodeField.prop('onChange')({ target: { name: 'postcode', value: '90210' } });

        expect(defaultProps.setAdditionalInfo).toHaveBeenCalledWith({
            ...defaultProps.additionalInfo,
            postcode: '90210'
        });
    });

    it('should handle country field change', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        const countryField = wrapper.find('RowField').at(4);

        countryField.prop('onChange')({ target: { name: 'country', value: 'FR' } });

        expect(defaultProps.setAdditionalInfo).toHaveBeenCalledWith({
            ...defaultProps.additionalInfo,
            country: 'FR'
        });
    });

    it('should handle answer field change', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        const answerField = wrapper.find('RowField').at(6);

        answerField.prop('onChange')({ target: { name: 'answer', value: 'Red' } });

        expect(defaultProps.setAdditionalInfo).toHaveBeenCalledWith({
            ...defaultProps.additionalInfo,
            answer: 'Red'
        });
    });

    it('should have country select options with proper format', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        const countryField = wrapper.find('RowField').at(4);
        const selectOptions = countryField.prop('selectOptions');

        expect(selectOptions).toBeDefined();
        expect(Array.isArray(selectOptions)).toBe(true);
        expect(selectOptions.length).toBeGreaterThan(0);

        // Check option format
        if (selectOptions.length > 0) {
            expect(selectOptions[0]).toHaveProperty('label');
            expect(selectOptions[0]).toHaveProperty('value');
        }
    });

    it('should render security question and answer as read-only components', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        const questionField = wrapper.find('RowField').at(5);
        const answerField = wrapper.find('RowField').at(6);

        // Security question should have colComponent (read-only display)
        expect(questionField.prop('colComponent')).toBeDefined();
        expect(answerField.prop('colComponent')).toBeDefined();
    });

    it('should handle null additionalInfo gracefully', () => {
        const nullProps = {
            ...defaultProps,
            additionalInfo: null
        };

        expect(() => {
            shallow(<Additional {...nullProps} />);
        }).not.toThrow();
    });

    it('should handle missing additionalInfo properties', () => {
        const incompleteProps = {
            ...defaultProps,
            additionalInfo: {
                address: '123 Main St'
                // Missing other properties
            }
        };

        const wrapper = shallow(<Additional {...incompleteProps} />);
        const rowFields = wrapper.find('RowField');

        expect(rowFields.at(0).prop('value')).toBe('123 Main St');
        expect(rowFields.at(1).prop('value')).toBeUndefined();
    });

    it('should maintain component structure when props update', () => {
        const wrapper = shallow(<Additional {...defaultProps} />);
        
        const newAdditionalInfo = {
            ...defaultProps.additionalInfo,
            address: 'Updated Address'
        };

        wrapper.setProps({ 
            ...defaultProps, 
            additionalInfo: newAdditionalInfo 
        });

        expect(wrapper.find('RowField')).toHaveLength(7);
        expect(wrapper.find('RowField').at(0).prop('value')).toBe('Updated Address');
    });
}); 