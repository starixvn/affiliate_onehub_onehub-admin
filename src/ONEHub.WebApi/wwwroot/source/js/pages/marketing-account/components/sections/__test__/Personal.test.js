import React from 'react';
import { Personal } from '../Personal';
import { shallow } from 'enzyme';

describe('marketing-account - sections - Personal', () => {
    const defaultProps = {
        personalInfo: {
            firstName: '',
            lastName: '',
            gender: '',
            email: '',
            phone: ''
        },
        setPersonalInfo: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        const result = shallow(<Personal {...defaultProps} />);
        expect(result).toMatchSnapshot();
    });

    it('should render all form fields correctly', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);

        // Check for fieldset and legend
        expect(wrapper.find('fieldset')).toHaveLength(1);
        expect(wrapper.find('legend h6').text()).toBe('Personal Information');

        // Check for RowField components
        const rowFields = wrapper.find('RowField');
        expect(rowFields).toHaveLength(4);

        // Check field labels
        expect(rowFields.at(0).prop('label')).toBe('First Name');
        expect(rowFields.at(1).prop('label')).toBe('Last Name');
        expect(rowFields.at(2).prop('label')).toBe('Email Address');
        expect(rowFields.at(3).prop('label')).toBe('Contact Number');
    });

    it('should render gender radio buttons correctly', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const genderRadios = wrapper.find('Input[name="gender"]');

        expect(genderRadios).toHaveLength(2);
        expect(genderRadios.at(0).prop('value')).toBe(true);
        expect(genderRadios.at(1).prop('value')).toBe(false);
    });

    it('should handle first name change', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const firstNameField = wrapper.find('RowField').at(0);

        firstNameField.prop('onChange')({ target: { name: 'firstName', value: 'John' } });

        expect(defaultProps.setPersonalInfo).toHaveBeenCalledWith({
            ...defaultProps.personalInfo,
            firstName: 'John'
        });
    });

    it('should handle last name change', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const lastNameField = wrapper.find('RowField').at(1);

        lastNameField.prop('onChange')({ target: { name: 'lastName', value: 'Doe' } });

        expect(defaultProps.setPersonalInfo).toHaveBeenCalledWith({
            ...defaultProps.personalInfo,
            lastName: 'Doe'
        });
    });

    it('should handle email change', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const emailField = wrapper.find('RowField').at(2);

        emailField.prop('onChange')({ target: { name: 'email', value: 'john@example.com' } });

        expect(defaultProps.setPersonalInfo).toHaveBeenCalledWith({
            ...defaultProps.personalInfo,
            email: 'john@example.com'
        });
    });

    it('should handle phone change', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const phoneField = wrapper.find('RowField').at(3);

        phoneField.prop('onChange')({ target: { name: 'phone', value: '+1234567890' } });

        expect(defaultProps.setPersonalInfo).toHaveBeenCalledWith({
            ...defaultProps.personalInfo,
            phone: '+1234567890'
        });
    });

    it('should handle male gender selection', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const maleRadio = wrapper.find('Input[name="gender"]').at(0);

        maleRadio.prop('onChange')({ target: { name: 'gender', value: true } });

        expect(defaultProps.setPersonalInfo).toHaveBeenCalledWith({
            ...defaultProps.personalInfo,
            gender: true
        });
    });

    it('should handle female gender selection', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const femaleRadio = wrapper.find('Input[name="gender"]').at(1);

        femaleRadio.prop('onChange')({ target: { name: 'gender', value: false } });

        expect(defaultProps.setPersonalInfo).toHaveBeenCalledWith({
            ...defaultProps.personalInfo,
            gender: false
        });
    });

    it('should show male selected when gender is true', () => {
        const maleProps = {
            ...defaultProps,
            personalInfo: {
                ...defaultProps.personalInfo,
                gender: true
            }
        };

        const wrapper = shallow(<Personal {...maleProps} />);
        const maleRadio = wrapper.find('Input[name="gender"]').at(0);
        const femaleRadio = wrapper.find('Input[name="gender"]').at(1);

        expect(maleRadio.prop('checked')).toBe(true);
        expect(femaleRadio.prop('checked')).toBe(false);
    });

    it('should show male selected when gender is string "true"', () => {
        const maleProps = {
            ...defaultProps,
            personalInfo: {
                ...defaultProps.personalInfo,
                gender: 'true'
            }
        };

        const wrapper = shallow(<Personal {...maleProps} />);
        const maleRadio = wrapper.find('Input[name="gender"]').at(0);
        const femaleRadio = wrapper.find('Input[name="gender"]').at(1);

        expect(maleRadio.prop('checked')).toBe(true);
        expect(femaleRadio.prop('checked')).toBe(false);
    });

    it('should show female selected when gender is false', () => {
        const femaleProps = {
            ...defaultProps,
            personalInfo: {
                ...defaultProps.personalInfo,
                gender: false
            }
        };

        const wrapper = shallow(<Personal {...femaleProps} />);
        const maleRadio = wrapper.find('Input[name="gender"]').at(0);
        const femaleRadio = wrapper.find('Input[name="gender"]').at(1);

        expect(maleRadio.prop('checked')).toBe(false);
        expect(femaleRadio.prop('checked')).toBe(true);
    });

    it('should mark email field as required', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const emailField = wrapper.find('RowField').at(2);

        expect(emailField.prop('labelProps')).toEqual({ className: 'required' });
    });

    it('should render with filled personal data', () => {
        const filledProps = {
            ...defaultProps,
            personalInfo: {
                firstName: 'Jane',
                lastName: 'Smith',
                gender: true,
                email: 'jane@example.com',
                phone: '+9876543210'
            }
        };

        const wrapper = shallow(<Personal {...filledProps} />);
        const rowFields = wrapper.find('RowField');

        expect(rowFields.at(0).prop('value')).toBe('Jane');
        expect(rowFields.at(1).prop('value')).toBe('Smith');
        expect(rowFields.at(2).prop('value')).toBe('jane@example.com');
        expect(rowFields.at(3).prop('value')).toBe('+9876543210');
    });

    it('should render gender labels correctly', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const genderLabels = wrapper.find('Label[check]');

        expect(genderLabels).toHaveLength(2);
        // Shallow rendering doesn't render full text content, just verify structure
        expect(genderLabels.at(0).find('Input[type="radio"]')).toHaveLength(1);
        expect(genderLabels.at(1).find('Input[type="radio"]')).toHaveLength(1);
    });

    it('should have proper form structure', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);

        expect(wrapper.find('Form')).toHaveLength(1);
        // The component actually has 3 FormGroups (1 for gender + 2 radio buttons)
        expect(wrapper.find('FormGroup')).toHaveLength(3);
        expect(wrapper.find('FormGroup[check]')).toHaveLength(2);
    });

    it('should handle null personalInfo gracefully', () => {
        const nullProps = {
            ...defaultProps,
            personalInfo: null
        };

        expect(() => {
            shallow(<Personal {...nullProps} />);
        }).not.toThrow();
    });

    it('should handle missing personalInfo properties', () => {
        const incompleteProps = {
            ...defaultProps,
            personalInfo: {
                firstName: 'John'
                // Missing other properties
            }
        };

        const wrapper = shallow(<Personal {...incompleteProps} />);
        const rowFields = wrapper.find('RowField');

        expect(rowFields.at(0).prop('value')).toBe('John');
        expect(rowFields.at(1).prop('value')).toBeUndefined();
    });

    it('should maintain gender radio group structure', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const genderGroup = wrapper.find('.gender-group');

        expect(genderGroup).toHaveLength(1);
        expect(genderGroup.find('FormGroup[check]')).toHaveLength(2);
    });

    it('should apply correct CSS classes to gender options', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        const genderFormGroups = wrapper.find('FormGroup[check]');

        expect(genderFormGroups.at(0).prop('className')).toContain('d-inline-block mr-3');
        expect(genderFormGroups.at(1).prop('className')).toContain('d-inline-block');
    });

    it('should update component when props change', () => {
        const wrapper = shallow(<Personal {...defaultProps} />);
        
        const newPersonalInfo = {
            ...defaultProps.personalInfo,
            firstName: 'Updated Name',
            gender: true
        };

        wrapper.setProps({ 
            ...defaultProps, 
            personalInfo: newPersonalInfo 
        });

        const firstNameField = wrapper.find('RowField').at(0);
        const maleRadio = wrapper.find('Input[name="gender"]').at(0);

        expect(firstNameField.prop('value')).toBe('Updated Name');
        expect(maleRadio.prop('checked')).toBe(true);
    });
}); 