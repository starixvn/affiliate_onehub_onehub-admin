import React from 'react';
import { Payment } from '../Payment';
import { shallow } from 'enzyme';

describe('marketing-account - sections - Payment', () => {
    const defaultProps = {
        paymentInfo: {
            preferredPayment: '',
            playerUsername: ''
        },
        setPaymentInfo: jest.fn(),
        paymentMethods: [
            { Key: 'method1', Value: 'Payment Method 1' },
            { Key: 'method2', Value: 'Payment Method 2' },
            { Key: 'method3', Value: 'Payment Method 3' }
        ],
        minimumPayment: 100
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        const result = shallow(<Payment {...defaultProps} />);
        expect(result).toMatchSnapshot();
    });

    it('should render all form elements correctly', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);

        // Check for fieldset and legend
        expect(wrapper.find('fieldset')).toHaveLength(1);
        expect(wrapper.find('legend h6').text()).toBe('Payment Information');

        // Check for Form with div tag
        expect(wrapper.find('Form[tag="div"]')).toHaveLength(1);

        // Check for payment method select
        expect(wrapper.find('Input[type="select"]')).toHaveLength(1);

        // Check for RowField (playerUsername)
        expect(wrapper.find('RowField')).toHaveLength(1);
    });

    it('should render payment method dropdown with correct options', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);
        const select = wrapper.find('Input[type="select"]');
        const options = wrapper.find('option');

        expect(select.prop('name')).toBe('preferredPayment');
        expect(select.prop('id')).toBe('preferredPayment');
        expect(options).toHaveLength(3);

        expect(options.at(0).prop('value')).toBe('method1');
        expect(options.at(0).text()).toBe('Payment Method 1');
        expect(options.at(1).prop('value')).toBe('method2');
        expect(options.at(1).text()).toBe('Payment Method 2');
        expect(options.at(2).prop('value')).toBe('method3');
        expect(options.at(2).text()).toBe('Payment Method 3');
    });

    it('should handle payment method selection change', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);
        const select = wrapper.find('Input[type="select"]');

        select.prop('onChange')({ target: { name: 'preferredPayment', value: 'method2' } });

        expect(defaultProps.setPaymentInfo).toHaveBeenCalledWith({
            ...defaultProps.paymentInfo,
            preferredPayment: 'method2'
        });
    });

    it('should handle player username change', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);
        const usernameField = wrapper.find('RowField');

        usernameField.prop('onChange')({ target: { name: 'playerUsername', value: 'testuser123' } });

        expect(defaultProps.setPaymentInfo).toHaveBeenCalledWith({
            ...defaultProps.paymentInfo,
            playerUsername: 'testuser123'
        });
    });

    it('should disable payment method select when no payment methods available', () => {
        const noMethodsProps = {
            ...defaultProps,
            paymentMethods: []
        };

        const wrapper = shallow(<Payment {...noMethodsProps} />);
        const select = wrapper.find('Input[type="select"]');

        expect(select.prop('disabled')).toBe(true);
    });

    it('should enable payment method select when payment methods are available', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);
        const select = wrapper.find('Input[type="select"]');

        expect(select.prop('disabled')).toBe(false);
    });

    it('should display minimum payment text with formatted amount', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);
        const minimumPaymentSpan = wrapper.find('span.input-item');

        expect(minimumPaymentSpan.text()).toContain('100');
    });

    it('should render player username field with correct props', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);
        const usernameField = wrapper.find('RowField');

        expect(usernameField.prop('label')).toBe('12Bet UserName');
        expect(usernameField.prop('name')).toBe('playerUsername');
        expect(usernameField.prop('value')).toBe('');
        expect(usernameField.prop('labelProps')).toEqual({ sm: 3 });
        expect(typeof usernameField.prop('onChange')).toBe('function');
    });

    it('should render with filled payment data', () => {
        const filledProps = {
            ...defaultProps,
            paymentInfo: {
                preferredPayment: 'method2',
                playerUsername: 'myusername'
            }
        };

        const wrapper = shallow(<Payment {...filledProps} />);
        const select = wrapper.find('Input[type="select"]');
        const usernameField = wrapper.find('RowField');

        expect(select.prop('value')).toBe('method2');
        expect(usernameField.prop('value')).toBe('myusername');
    });

    it('should handle empty payment methods array gracefully', () => {
        const emptyMethodsProps = {
            ...defaultProps,
            paymentMethods: []
        };

        const wrapper = shallow(<Payment {...emptyMethodsProps} />);
        const options = wrapper.find('option');

        expect(options).toHaveLength(0);
    });

    it('should handle null payment methods gracefully', () => {
        const nullMethodsProps = {
            ...defaultProps,
            paymentMethods: null
        };

        expect(() => {
            shallow(<Payment {...nullMethodsProps} />);
        }).not.toThrow();
    });

    it('should handle missing payment info properties', () => {
        const incompleteProps = {
            ...defaultProps,
            paymentInfo: {
                preferredPayment: 'method1'
                // Missing playerUsername
            }
        };

        const wrapper = shallow(<Payment {...incompleteProps} />);
        const usernameField = wrapper.find('RowField');

        expect(usernameField.prop('value')).toBeUndefined();
    });

    it('should render proper form structure', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);

        expect(wrapper.find('FormGroup')).toHaveLength(1);
        expect(wrapper.find('Label[htmlFor="preferredPayment"]')).toHaveLength(1);
        expect(wrapper.find('Col')).toHaveLength(1);
    });

    it('should have correct label text for payment method', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);
        const label = wrapper.find('Label[htmlFor="preferredPayment"]');

        expect(label).toHaveLength(1);
        expect(label.prop('sm')).toBe(3);
        // Shallow rendering doesn't render full text content, just verify label props
        expect(label.prop('children')).toBe('Preferred Payment Method');
    });

    it('should handle zero minimum payment', () => {
        const zeroMinProps = {
            ...defaultProps,
            minimumPayment: 0
        };

        const wrapper = shallow(<Payment {...zeroMinProps} />);
        const minimumPaymentSpan = wrapper.find('span.input-item');

        expect(minimumPaymentSpan.text()).toContain('0');
    });

    it('should handle undefined minimum payment', () => {
        const undefinedMinProps = {
            ...defaultProps,
            minimumPayment: undefined
        };

        expect(() => {
            shallow(<Payment {...undefinedMinProps} />);
        }).not.toThrow();
    });

    it('should handle null paymentInfo gracefully', () => {
        const nullPaymentInfoProps = {
            ...defaultProps,
            paymentInfo: null
        };

        expect(() => {
            shallow(<Payment {...nullPaymentInfoProps} />);
        }).not.toThrow();
    });

    it('should update component when props change', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);
        
        const newPaymentInfo = {
            ...defaultProps.paymentInfo,
            preferredPayment: 'method3',
            playerUsername: 'updateduser'
        };

        const newPaymentMethods = [
            { Key: 'new1', Value: 'New Method 1' }
        ];

        wrapper.setProps({ 
            ...defaultProps, 
            paymentInfo: newPaymentInfo,
            paymentMethods: newPaymentMethods,
            minimumPayment: 200
        });

        const select = wrapper.find('Input[type="select"]');
        const usernameField = wrapper.find('RowField');
        const minimumPaymentSpan = wrapper.find('span.input-item');

        expect(select.prop('value')).toBe('method3');
        expect(usernameField.prop('value')).toBe('updateduser');
        expect(minimumPaymentSpan.text()).toContain('200');
    });

    it('should maintain correct CSS classes', () => {
        const wrapper = shallow(<Payment {...defaultProps} />);
        const col = wrapper.find('Col.input-item');

        expect(col.prop('sm')).toBe(5);
        expect(col.prop('className')).toBe('input-item');
    });

    it('should handle payment methods with special characters', () => {
        const specialMethodsProps = {
            ...defaultProps,
            paymentMethods: [
                { Key: 'special&key', Value: 'Method with & symbol' },
                { Key: 'unicode€', Value: 'Method with € symbol' }
            ]
        };

        const wrapper = shallow(<Payment {...specialMethodsProps} />);
        const options = wrapper.find('option');

        expect(options.at(0).prop('value')).toBe('special&key');
        expect(options.at(0).text()).toBe('Method with & symbol');
        expect(options.at(1).prop('value')).toBe('unicode€');
        expect(options.at(1).text()).toBe('Method with € symbol');
    });
}); 