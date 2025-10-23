import React from 'react';
import { GeneralInfo } from '../GeneralInfo';
import { shallow } from 'enzyme';

describe('marketing-account - sections - GeneralInfo', () => {
    const defaultProps = {
        generalInfo: {
            targetCountryCode: '',
            preferredLanguage: '',
            groupId: ''
        },
        setGeneralInfo: jest.fn(),
        aff: {
            affId: 12345,
            affName: 'TestAffiliate'
        },
        targetCountryCodeList: {
            'US': 'United States',
            'GB': 'United Kingdom',
            'CA': 'Canada'
        },
        languageCodeList: {
            'en': 'English',
            'fr': 'French',
            'es': 'Spanish'
        },
        dealOptionsList: {
            '1': 'Deal Option 1',
            '2': 'Deal Option 2',
            '3': 'Deal Option 3'
        },
        setAff: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        const result = shallow(<GeneralInfo {...defaultProps} />);
        expect(result).toMatchSnapshot();
    });

    it('should render all form fields correctly', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);

        const rowFields = wrapper.find('RowField');
        expect(rowFields).toHaveLength(4);

        // Check field labels
        expect(rowFields.at(0).prop('label')).toBe('Copy from Marketing account');
        expect(rowFields.at(1).prop('label')).toBe('Target Country');
        expect(rowFields.at(2).prop('label')).toBe('Language');
        expect(rowFields.at(3).prop('label')).toBe('Deal Name');
    });

    it('should display affiliate name in the first field', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const affiliateField = wrapper.find('RowField').at(0);

        expect(affiliateField.prop('value')).toBe('TestAffiliate');
        expect(affiliateField.prop('disabled')).toBe(true);
    });

    it('should pass correct target country options', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const targetCountryField = wrapper.find('RowField').at(1);
        const selectOptions = targetCountryField.prop('selectOptions');

        expect(selectOptions).toHaveLength(3);
        expect(selectOptions[0]).toEqual({ label: 'United States', value: 'US' });
        expect(selectOptions[1]).toEqual({ label: 'United Kingdom', value: 'GB' });
        expect(selectOptions[2]).toEqual({ label: 'Canada', value: 'CA' });
    });

    it('should pass correct language options', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const languageField = wrapper.find('RowField').at(2);
        const selectOptions = languageField.prop('selectOptions');

        expect(selectOptions).toHaveLength(3);
        expect(selectOptions[0]).toEqual({ label: 'English', value: 'en' });
        expect(selectOptions[1]).toEqual({ label: 'French', value: 'fr' });
        expect(selectOptions[2]).toEqual({ label: 'Spanish', value: 'es' });
    });

    it('should pass correct deal options', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const dealField = wrapper.find('RowField').at(3);
        const selectOptions = dealField.prop('selectOptions');

        expect(selectOptions).toHaveLength(3);
        expect(selectOptions[0]).toEqual({ label: 'Deal Option 1', value: '1' });
        expect(selectOptions[1]).toEqual({ label: 'Deal Option 2', value: '2' });
        expect(selectOptions[2]).toEqual({ label: 'Deal Option 3', value: '3' });
    });

    it('should handle target country change', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const targetCountryField = wrapper.find('RowField').at(1);

        targetCountryField.prop('onChange')({ 
            target: { name: 'targetCountryCode', value: 'US' } 
        });

        expect(defaultProps.setGeneralInfo).toHaveBeenCalledWith({
            ...defaultProps.generalInfo,
            targetCountryCode: 'US'
        });
    });

    it('should handle language change', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const languageField = wrapper.find('RowField').at(2);

        languageField.prop('onChange')({ 
            target: { name: 'preferredLanguage', value: 'en' } 
        });

        expect(defaultProps.setGeneralInfo).toHaveBeenCalledWith({
            ...defaultProps.generalInfo,
            preferredLanguage: 'en'
        });
    });

    it('should handle deal name change', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const dealField = wrapper.find('RowField').at(3);

        dealField.prop('onChange')({ 
            target: { name: 'groupId', value: '2' } 
        });

        expect(defaultProps.setGeneralInfo).toHaveBeenCalledWith({
            ...defaultProps.generalInfo,
            groupId: '2'
        });
    });

    it('should handle affiliate name change', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const affiliateField = wrapper.find('RowField').at(0);

        affiliateField.prop('onChange')({ target: { value: 'NewAffiliate' } });

        expect(defaultProps.setAff).toHaveBeenCalledWith('NewAffiliate');
    });

    it('should render with filled general info data', () => {
        const filledProps = {
            ...defaultProps,
            generalInfo: {
                targetCountryCode: 'US',
                preferredLanguage: 'en',
                groupId: '1'
            }
        };

        const wrapper = shallow(<GeneralInfo {...filledProps} />);
        const rowFields = wrapper.find('RowField');

        expect(rowFields.at(1).prop('value')).toBe('US');
        expect(rowFields.at(2).prop('value')).toBe('en');
        expect(rowFields.at(3).prop('value')).toBe('1');
    });

    it('should have correct styling for affiliate field', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const affiliateField = wrapper.find('RowField').at(0);

        expect(affiliateField.prop('labelProps')).toEqual({ 
            style: { paddingRight: '0px' } 
        });
    });

    it('should handle empty option lists gracefully', () => {
        const emptyListsProps = {
            ...defaultProps,
            targetCountryCodeList: {},
            languageCodeList: {},
            dealOptionsList: {}
        };

        const wrapper = shallow(<GeneralInfo {...emptyListsProps} />);
        const rowFields = wrapper.find('RowField');

        expect(rowFields.at(1).prop('selectOptions')).toHaveLength(0);
        expect(rowFields.at(2).prop('selectOptions')).toHaveLength(0);
        expect(rowFields.at(3).prop('selectOptions')).toHaveLength(0);
    });

    it('should handle null option lists gracefully', () => {
        const nullListsProps = {
            ...defaultProps,
            targetCountryCodeList: null,
            languageCodeList: null,
            dealOptionsList: null
        };

        expect(() => {
            shallow(<GeneralInfo {...nullListsProps} />);
        }).not.toThrow();
    });

    it('should have proper container styling', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const container = wrapper.find('div').first();

        expect(container.prop('style')).toEqual({ paddingLeft: '10px' });
    });

    it('should handle missing aff object gracefully', () => {
        const noAffProps = {
            ...defaultProps,
            aff: null
        };

        expect(() => {
            shallow(<GeneralInfo {...noAffProps} />);
        }).not.toThrow();
    });

    it('should handle aff object without affName', () => {
        const noAffNameProps = {
            ...defaultProps,
            aff: { affId: 12345 }
        };

        const wrapper = shallow(<GeneralInfo {...noAffNameProps} />);
        const affiliateField = wrapper.find('RowField').at(0);

        expect(affiliateField.prop('value')).toBeUndefined();
    });

    it('should handle missing generalInfo properties', () => {
        const incompleteProps = {
            ...defaultProps,
            generalInfo: {
                targetCountryCode: 'US'
                // Missing other properties
            }
        };

        const wrapper = shallow(<GeneralInfo {...incompleteProps} />);
        const rowFields = wrapper.find('RowField');

        expect(rowFields.at(1).prop('value')).toBe('US');
        expect(rowFields.at(2).prop('value')).toBeUndefined();
        expect(rowFields.at(3).prop('value')).toBeUndefined();
    });

    it('should update component when props change', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        
        const newGeneralInfo = {
            ...defaultProps.generalInfo,
            targetCountryCode: 'CA',
            preferredLanguage: 'fr'
        };

        const newAff = {
            affId: 67890,
            affName: 'UpdatedAffiliate'
        };

        wrapper.setProps({ 
            ...defaultProps, 
            generalInfo: newGeneralInfo,
            aff: newAff
        });

        const rowFields = wrapper.find('RowField');
        expect(rowFields.at(0).prop('value')).toBe('UpdatedAffiliate');
        expect(rowFields.at(1).prop('value')).toBe('CA');
        expect(rowFields.at(2).prop('value')).toBe('fr');
    });

    it('should pass correct field names to RowField components', () => {
        const wrapper = shallow(<GeneralInfo {...defaultProps} />);
        const rowFields = wrapper.find('RowField');

        expect(rowFields.at(0).prop('name')).toBe('marketingAccount');
        expect(rowFields.at(1).prop('name')).toBe('targetCountryCode');
        expect(rowFields.at(2).prop('name')).toBe('preferredLanguage');
        expect(rowFields.at(3).prop('name')).toBe('groupId');
    });
}); 