import React from 'react';
import { mount } from 'enzyme';
import useFilterParams from '../useFilterParams';
import { allStatuses } from '../../libs/constants';

// Test component that uses the hook
const TestComponent = () => {
    const hookResult = useFilterParams();
    // Expose hook result for testing
    TestComponent.hookResult = hookResult;
    return <div data-testid="test-component">Test</div>;
};

describe('marketing-account - hooks - useFilterParams', () => {
    beforeEach(() => {
        TestComponent.hookResult = null;
    });

    it('should initialize with default filter parameters', () => {
        mount(<TestComponent />);

        expect(TestComponent.hookResult.filterParams).toEqual({
            languageCode: '',
            targetCountryCode: '',
            status: allStatuses,
            userName: ''
        });
    });

    it('should provide onChangeFilterParams function', () => {
        mount(<TestComponent />);

        expect(typeof TestComponent.hookResult.onChangeFilterParams).toBe('function');
    });

    it('should update individual filter parameter by key', () => {
        const wrapper = mount(<TestComponent />);

        TestComponent.hookResult.onChangeFilterParams('languageCode', 'en');
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.languageCode).toBe('en');
        expect(TestComponent.hookResult.filterParams.targetCountryCode).toBe('');
        expect(TestComponent.hookResult.filterParams.status).toBe(allStatuses);
        expect(TestComponent.hookResult.filterParams.userName).toBe('');
    });

    it('should update targetCountryCode parameter', () => {
        const wrapper = mount(<TestComponent />);

        TestComponent.hookResult.onChangeFilterParams('targetCountryCode', 'US');
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.targetCountryCode).toBe('US');
        expect(TestComponent.hookResult.filterParams.languageCode).toBe('');
        expect(TestComponent.hookResult.filterParams.status).toBe(allStatuses);
        expect(TestComponent.hookResult.filterParams.userName).toBe('');
    });

    it('should update status parameter', () => {
        const wrapper = mount(<TestComponent />);

        TestComponent.hookResult.onChangeFilterParams('status', 'Approved');
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.status).toBe('Approved');
        expect(TestComponent.hookResult.filterParams.languageCode).toBe('');
        expect(TestComponent.hookResult.filterParams.targetCountryCode).toBe('');
        expect(TestComponent.hookResult.filterParams.userName).toBe('');
    });

    it('should update userName parameter', () => {
        const wrapper = mount(<TestComponent />);

        TestComponent.hookResult.onChangeFilterParams('userName', 'testuser');
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.userName).toBe('testuser');
        expect(TestComponent.hookResult.filterParams.languageCode).toBe('');
        expect(TestComponent.hookResult.filterParams.targetCountryCode).toBe('');
        expect(TestComponent.hookResult.filterParams.status).toBe(allStatuses);
    });

    it('should update multiple parameters sequentially', () => {
        const wrapper = mount(<TestComponent />);

        TestComponent.hookResult.onChangeFilterParams('languageCode', 'zh');
        wrapper.update();

        TestComponent.hookResult.onChangeFilterParams('targetCountryCode', 'CN');
        wrapper.update();

        TestComponent.hookResult.onChangeFilterParams('userName', 'admin');
        wrapper.update();

        expect(TestComponent.hookResult.filterParams).toEqual({
            languageCode: 'zh',
            targetCountryCode: 'CN',
            status: allStatuses,
            userName: 'admin'
        });
    });

    it('should handle empty string values', () => {
        const wrapper = mount(<TestComponent />);

        // Set some values first
        TestComponent.hookResult.onChangeFilterParams('languageCode', 'en');
        TestComponent.hookResult.onChangeFilterParams('userName', 'testuser');
        wrapper.update();

        // Clear them with empty strings
        TestComponent.hookResult.onChangeFilterParams('languageCode', '');
        TestComponent.hookResult.onChangeFilterParams('userName', '');
        wrapper.update();

        expect(TestComponent.hookResult.filterParams).toEqual({
            languageCode: '',
            targetCountryCode: '',
            status: allStatuses,
            userName: ''
        });
    });

    it('should handle null and undefined values', () => {
        const wrapper = mount(<TestComponent />);

        TestComponent.hookResult.onChangeFilterParams('languageCode', null);
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.languageCode).toBeNull();

        TestComponent.hookResult.onChangeFilterParams('targetCountryCode', undefined);
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.targetCountryCode).toBeUndefined();
    });

    it('should handle boolean values', () => {
        const wrapper = mount(<TestComponent />);

        TestComponent.hookResult.onChangeFilterParams('languageCode', true);
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.languageCode).toBe(true);

        TestComponent.hookResult.onChangeFilterParams('targetCountryCode', false);
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.targetCountryCode).toBe(false);
    });

    it('should handle numeric values', () => {
        const wrapper = mount(<TestComponent />);

        TestComponent.hookResult.onChangeFilterParams('languageCode', 123);
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.languageCode).toBe(123);

        TestComponent.hookResult.onChangeFilterParams('targetCountryCode', 0);
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.targetCountryCode).toBe(0);
    });

    it('should handle object values', () => {
        const wrapper = mount(<TestComponent />);

        const objectValue = { code: 'US', name: 'United States' };

        TestComponent.hookResult.onChangeFilterParams('targetCountryCode', objectValue);
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.targetCountryCode).toEqual(objectValue);
    });

    it('should handle array values', () => {
        const wrapper = mount(<TestComponent />);

        const arrayValue = ['en', 'zh', 'th'];

        TestComponent.hookResult.onChangeFilterParams('languageCode', arrayValue);
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.languageCode).toEqual(arrayValue);
    });

    it('should preserve other parameters when updating one', () => {
        const wrapper = mount(<TestComponent />);

        // Set initial values
        TestComponent.hookResult.onChangeFilterParams('languageCode', 'en');
        TestComponent.hookResult.onChangeFilterParams('targetCountryCode', 'US');
        TestComponent.hookResult.onChangeFilterParams('userName', 'testuser');
        wrapper.update();

        // Update only one parameter
        TestComponent.hookResult.onChangeFilterParams('status', 'Suspended');
        wrapper.update();

        expect(TestComponent.hookResult.filterParams).toEqual({
            languageCode: 'en',
            targetCountryCode: 'US',
            status: 'Suspended',
            userName: 'testuser'
        });
    });

    it('should handle non-existent keys gracefully', () => {
        const wrapper = mount(<TestComponent />);

        TestComponent.hookResult.onChangeFilterParams('nonExistentKey', 'someValue');
        wrapper.update();

        expect(TestComponent.hookResult.filterParams.nonExistentKey).toBe('someValue');
        expect(TestComponent.hookResult.filterParams.languageCode).toBe('');
        expect(TestComponent.hookResult.filterParams.targetCountryCode).toBe('');
        expect(TestComponent.hookResult.filterParams.status).toBe(allStatuses);
        expect(TestComponent.hookResult.filterParams.userName).toBe('');
    });
}); 