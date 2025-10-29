import React from 'react';
import { EmailFormat } from '../EmailFormat';
import { shallow } from 'enzyme';

describe('marketing-account - sections - EmailFormat', () => {
    const defaultProps = {
        generalInfo: {
            mailOption: true
        },
        setGeneralInfo: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        const result = shallow(<EmailFormat {...defaultProps} />);
        expect(result).toMatchSnapshot();
    });

    it('should render all form elements correctly', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);

        // Check for fieldset and legend
        expect(wrapper.find('fieldset')).toHaveLength(1);
        expect(wrapper.find('legend h6').text()).toBe('Email Format Preference');

        // Check for Form with div tag
        expect(wrapper.find('Form[tag="div"]')).toHaveLength(1);

        // Check for radio buttons
        expect(wrapper.find('Input[name="mailOption"]')).toHaveLength(2);

        // Check for FormGroup structure
        expect(wrapper.find('FormGroup')).toHaveLength(3); // Main FormGroup + 2 check FormGroups
        expect(wrapper.find('FormGroup[check]')).toHaveLength(2);
    });

    it('should show Plain Text Format selected by default', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        const textRadio = wrapper.find('Input[name="mailOption"]').at(0);
        const htmlRadio = wrapper.find('Input[name="mailOption"]').at(1);

        expect(textRadio.prop('checked')).toBe(true);
        expect(htmlRadio.prop('checked')).toBe(false);
    });

    it('should show Html Format selected when mailOption is false', () => {
        const htmlProps = {
            ...defaultProps,
            generalInfo: {
                mailOption: false
            }
        };

        const wrapper = shallow(<EmailFormat {...htmlProps} />);
        const textRadio = wrapper.find('Input[name="mailOption"]').at(0);
        const htmlRadio = wrapper.find('Input[name="mailOption"]').at(1);

        expect(textRadio.prop('checked')).toBe(false);
        expect(htmlRadio.prop('checked')).toBe(true);
    });

    it('should handle Plain Text Format selection', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        const textRadio = wrapper.find('Input[name="mailOption"]').at(0);

        textRadio.prop('onChange')();

        expect(defaultProps.setGeneralInfo).toHaveBeenCalledWith(expect.any(Function));
        
        // Test the function that was passed to setGeneralInfo
        const updateFunction = defaultProps.setGeneralInfo.mock.calls[0][0];
        const prevState = { someOtherProp: 'value' };
        const result = updateFunction(prevState);
        
        expect(result).toEqual({
            someOtherProp: 'value',
            mailOption: true
        });
    });

    it('should handle Html Format selection', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        const htmlRadio = wrapper.find('Input[name="mailOption"]').at(1);

        htmlRadio.prop('onChange')();

        expect(defaultProps.setGeneralInfo).toHaveBeenCalledWith(expect.any(Function));
        
        // Test the function that was passed to setGeneralInfo
        const updateFunction = defaultProps.setGeneralInfo.mock.calls[0][0];
        const prevState = { someOtherProp: 'value' };
        const result = updateFunction(prevState);
        
        expect(result).toEqual({
            someOtherProp: 'value',
            mailOption: false
        });
    });

    it('should render radio button labels correctly', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        const labels = wrapper.find('Label[check]');
        const radios = wrapper.find('Input[type="radio"]');

        expect(labels).toHaveLength(2);
        expect(radios).toHaveLength(2);
        
        // Check that first radio is for Plain Text Format (true value)
        expect(radios.at(0).prop('checked')).toBe(true);
        expect(radios.at(1).prop('checked')).toBe(false);
    });

    it('should have correct form structure and styling', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        const col = wrapper.find('Col');

        expect(col.prop('sm')).toBe(5);
        expect(wrapper.find('FormGroup[check].d-inline-block')).toHaveLength(2);
    });

    it('should apply correct CSS classes to form groups', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        const checkFormGroups = wrapper.find('FormGroup[check]');

        expect(checkFormGroups.at(0).prop('className')).toContain('d-inline-block mr-3');
        expect(checkFormGroups.at(1).prop('className')).toContain('d-inline-block');
    });

    it('should handle null generalInfo gracefully', () => {
        const nullProps = {
            ...defaultProps,
            generalInfo: null
        };

        expect(() => {
            shallow(<EmailFormat {...nullProps} />);
        }).not.toThrow();
    });

    it('should handle missing mailOption property', () => {
        const missingProps = {
            ...defaultProps,
            generalInfo: {
                // Missing mailOption property
            }
        };

        const wrapper = shallow(<EmailFormat {...missingProps} />);
        const textRadio = wrapper.find('Input[name="mailOption"]').at(0);
        const htmlRadio = wrapper.find('Input[name="mailOption"]').at(1);

        // Should default to falsy behavior
        expect(textRadio.prop('checked')).toBe(false);
        expect(htmlRadio.prop('checked')).toBe(true);
    });

    it('should handle undefined generalInfo', () => {
        const undefinedProps = {
            ...defaultProps,
            generalInfo: undefined
        };

        expect(() => {
            shallow(<EmailFormat {...undefinedProps} />);
        }).not.toThrow();
    });

    it('should maintain state when props update', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        
        const newGeneralInfo = {
            mailOption: false,
            otherProp: 'value'
        };

        wrapper.setProps({ 
            ...defaultProps, 
            generalInfo: newGeneralInfo 
        });

        const textRadio = wrapper.find('Input[name="mailOption"]').at(0);
        const htmlRadio = wrapper.find('Input[name="mailOption"]').at(1);

        expect(textRadio.prop('checked')).toBe(false);
        expect(htmlRadio.prop('checked')).toBe(true);
    });

    it('should have proper radio button types', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        const radios = wrapper.find('Input[name="mailOption"]');

        expect(radios.at(0).prop('type')).toBe('radio');
        expect(radios.at(1).prop('type')).toBe('radio');
    });

    it('should maintain radio button name consistency', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        const radios = wrapper.find('Input[name="mailOption"]');

        expect(radios).toHaveLength(2);
        radios.forEach(radio => {
            expect(radio.prop('name')).toBe('mailOption');
        });
    });

    it('should handle string values for mailOption', () => {
        const stringProps = {
            ...defaultProps,
            generalInfo: {
                mailOption: 'true'
            }
        };

        const wrapper = shallow(<EmailFormat {...stringProps} />);
        const textRadio = wrapper.find('Input[name="mailOption"]').at(0);
        const htmlRadio = wrapper.find('Input[name="mailOption"]').at(1);

        // String 'true' should be truthy
        expect(textRadio.prop('checked')).toBe(true);
        expect(htmlRadio.prop('checked')).toBe(false);
    });

    it('should handle zero value for mailOption', () => {
        const zeroProps = {
            ...defaultProps,
            generalInfo: {
                mailOption: 0
            }
        };

        const wrapper = shallow(<EmailFormat {...zeroProps} />);
        const textRadio = wrapper.find('Input[name="mailOption"]').at(0);
        const htmlRadio = wrapper.find('Input[name="mailOption"]').at(1);

        // 0 should be falsy
        expect(textRadio.prop('checked')).toBe(false);
        expect(htmlRadio.prop('checked')).toBe(true);
    });

    it('should preserve other properties when updating mailOption', () => {
        const wrapper = shallow(<EmailFormat {...defaultProps} />);
        const htmlRadio = wrapper.find('Input[name="mailOption"]').at(1);

        htmlRadio.prop('onChange')();

        expect(defaultProps.setGeneralInfo).toHaveBeenCalledWith(expect.any(Function));
        
        // Test with a complex previous state
        const updateFunction = defaultProps.setGeneralInfo.mock.calls[0][0];
        const complexPrevState = { 
            mailOption: true,
            targetCountryCode: 'US',
            preferredLanguage: 'en',
            groupId: '1'
        };
        const result = updateFunction(complexPrevState);
        
        expect(result).toEqual({
            mailOption: false,
            targetCountryCode: 'US',
            preferredLanguage: 'en',
            groupId: '1'
        });
    });
}); 