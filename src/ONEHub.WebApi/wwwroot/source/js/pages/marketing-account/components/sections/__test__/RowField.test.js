import React from 'react';
import RowField from '../RowField';
import { shallow } from 'enzyme';

describe('marketing-account - sections - RowField', () => {
    const defaultProps = {
        label: 'Test Label',
        name: 'testField',
        value: 'test value',
        onChange: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        const result = shallow(<RowField {...defaultProps} />);
        expect(result).toMatchSnapshot();
    });

    it('should render basic form structure correctly', () => {
        const wrapper = shallow(<RowField {...defaultProps} />);

        // Check for FormGroup with row
        expect(wrapper.find('FormGroup[row]')).toHaveLength(1);

        // Check for Label
        expect(wrapper.find('Label')).toHaveLength(1);
        expect(wrapper.find('Label').prop('htmlFor')).toBe('testField');
        expect(wrapper.find('Label').prop('xs')).toBe(3);
        // Shallow rendering doesn't render full text content, just verify label props
        expect(wrapper.find('Label').prop('children')).toBe('Test Label');

        // Check for Col
        expect(wrapper.find('Col')).toHaveLength(1);
        expect(wrapper.find('Col').prop('xs')).toBe(5);

        // Check for Input
        expect(wrapper.find('Input')).toHaveLength(1);
    });

    it('should render text input by default', () => {
        const wrapper = shallow(<RowField {...defaultProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('type')).toBe('text');
        expect(input.prop('name')).toBe('testField');
        expect(input.prop('id')).toBe('Test Label');
        expect(input.prop('value')).toBe('test value');
        expect(typeof input.prop('onChange')).toBe('function');
    });

    it('should handle onChange event', () => {
        const wrapper = shallow(<RowField {...defaultProps} />);
        const input = wrapper.find('Input');

        const mockEvent = { target: { value: 'new value' } };
        input.prop('onChange')(mockEvent);

        expect(defaultProps.onChange).toHaveBeenCalledWith(mockEvent);
    });

    it('should render select input when selectOptions provided', () => {
        const selectProps = {
            ...defaultProps,
            selectOptions: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' }
            ]
        };

        const wrapper = shallow(<RowField {...selectProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('type')).toBe('select');
        expect(wrapper.find('option')).toHaveLength(2);
    });

    it('should render select options correctly', () => {
        const selectProps = {
            ...defaultProps,
            value: 'option2',
            selectOptions: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' }
            ]
        };

        const wrapper = shallow(<RowField {...selectProps} />);
        const options = wrapper.find('option');

        expect(options).toHaveLength(3);
        expect(options.at(0).prop('value')).toBe('option1');
        expect(options.at(0).text()).toBe('Option 1');
        expect(options.at(1).prop('value')).toBe('option2');
        expect(options.at(1).text()).toBe('Option 2');
        expect(options.at(2).prop('value')).toBe('option3');
        expect(options.at(2).text()).toBe('Option 3');
    });

    it('should handle different input types', () => {
        const emailProps = {
            ...defaultProps,
            type: 'email'
        };

        const wrapper = shallow(<RowField {...emailProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('type')).toBe('email');
    });

    it('should render with placeholder', () => {
        const placeholderProps = {
            ...defaultProps,
            placeholder: 'Enter test value'
        };

        const wrapper = shallow(<RowField {...placeholderProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('placeholder')).toBe('Enter test value');
    });

    it('should render with maxLength', () => {
        const maxLengthProps = {
            ...defaultProps,
            maxLength: 50
        };

        const wrapper = shallow(<RowField {...maxLengthProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('maxLength')).toBe(50);
    });

    it('should handle disabled state', () => {
        const disabledProps = {
            ...defaultProps,
            disabled: true
        };

        const wrapper = shallow(<RowField {...disabledProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('disabled')).toBe(true);
    });

    it('should apply custom label props', () => {
        const labelPropsCustom = {
            ...defaultProps,
            labelProps: { 
                className: 'custom-label',
                style: { color: 'red' }
            }
        };

        const wrapper = shallow(<RowField {...labelPropsCustom} />);
        const label = wrapper.find('Label');

        expect(label.prop('className')).toBe('custom-label');
        expect(label.prop('style')).toEqual({ color: 'red' });
        expect(label.prop('xs')).toBe(3); // Should maintain default xs
    });

    it('should apply custom col props', () => {
        const colPropsCustom = {
            ...defaultProps,
            colProps: { 
                className: 'custom-col',
                sm: 8
            }
        };

        const wrapper = shallow(<RowField {...colPropsCustom} />);
        const col = wrapper.find('Col');

        expect(col.prop('className')).toBe('custom-col');
        expect(col.prop('sm')).toBe(8);
        expect(col.prop('xs')).toBe(5); // Should maintain default xs
    });

    it('should render custom component instead of input when colComponent provided', () => {
        const customComponent = <p className="custom-text">Custom content</p>;
        const componentProps = {
            ...defaultProps,
            colComponent: customComponent
        };

        const wrapper = shallow(<RowField {...componentProps} />);

        expect(wrapper.find('Input')).toHaveLength(0);
        expect(wrapper.find('p.custom-text')).toHaveLength(1);
        expect(wrapper.find('p.custom-text').text()).toBe('Custom content');
    });

    it('should handle empty selectOptions array', () => {
        const emptySelectProps = {
            ...defaultProps,
            selectOptions: []
        };

        const wrapper = shallow(<RowField {...emptySelectProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('type')).toBe('select');
        expect(wrapper.find('option')).toHaveLength(0);
    });

    it('should handle null selectOptions', () => {
        const nullSelectProps = {
            ...defaultProps,
            selectOptions: null
        };

        const wrapper = shallow(<RowField {...nullSelectProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('type')).toBe('text');
    });

    it('should handle selected option correctly', () => {
        const selectProps = {
            ...defaultProps,
            value: 'option2',
            selectOptions: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' }
            ]
        };

        const wrapper = shallow(<RowField {...selectProps} />);
        const options = wrapper.find('option');

        expect(options.at(0).prop('selected')).toBe(false);
        expect(options.at(1).prop('selected')).toBe(true);
    });

    it('should handle missing value gracefully', () => {
        const noValueProps = {
            ...defaultProps,
            value: undefined
        };

        const wrapper = shallow(<RowField {...noValueProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('value')).toBeUndefined();
    });

    it('should handle missing name gracefully', () => {
        const noNameProps = {
            ...defaultProps,
            name: undefined
        };

        const wrapper = shallow(<RowField {...noNameProps} />);
        const input = wrapper.find('Input');
        const label = wrapper.find('Label');

        expect(input.prop('name')).toBeUndefined();
        expect(label.prop('htmlFor')).toBeUndefined();
    });

    it('should use label as input id', () => {
        const wrapper = shallow(<RowField {...defaultProps} />);
        const input = wrapper.find('Input');
        const label = wrapper.find('Label');

        expect(input.prop('id')).toBe('Test Label');
        expect(label.prop('htmlFor')).toBe('testField');
    });

    it('should handle empty string values', () => {
        const emptyProps = {
            ...defaultProps,
            value: ''
        };

        const wrapper = shallow(<RowField {...emptyProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('value')).toBe('');
    });

    it('should render textarea type correctly', () => {
        const textareaProps = {
            ...defaultProps,
            type: 'textarea'
        };

        const wrapper = shallow(<RowField {...textareaProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('type')).toBe('textarea');
    });

    it('should handle numeric values', () => {
        const numericProps = {
            ...defaultProps,
            value: 123,
            type: 'number'
        };

        const wrapper = shallow(<RowField {...numericProps} />);
        const input = wrapper.find('Input');

        expect(input.prop('value')).toBe(123);
        expect(input.prop('type')).toBe('number');
    });

    it('should maintain props structure when updated', () => {
        const wrapper = shallow(<RowField {...defaultProps} />);
        
        const newProps = {
            ...defaultProps,
            value: 'updated value',
            disabled: true
        };

        wrapper.setProps(newProps);

        const input = wrapper.find('Input');
        expect(input.prop('value')).toBe('updated value');
        expect(input.prop('disabled')).toBe(true);
    });
}); 