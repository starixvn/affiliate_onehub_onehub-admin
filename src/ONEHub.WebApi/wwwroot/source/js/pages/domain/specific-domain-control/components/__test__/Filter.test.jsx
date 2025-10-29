import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../../modules/constants';

describe('specific domain control - components - Filter ', () => {
    const defaultProps = {
        pagingOption: defaultPagingOption,
        setParam: jest.fn()
    };

    beforeEach(() => {
        defaultProps.setParam.mockReset();
    });

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);
        expect(result).toMatchSnapshot();
    });

    it('should update state when input values change', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        
        // Test affUsername input
        wrapper.find('Input[name="affUsername"]').simulate('change', { target: { value: 'testuser' } });
        expect(wrapper.find('Input[name="affUsername"]').props().value).toBe('testuser');

        // Test affDomain input
        wrapper.find('Input[name="affDomain"]').simulate('change', { target: { value: 'test.com' } });
        expect(wrapper.find('Input[name="affDomain"]').props().value).toBe('test.com');

        // Test redirectDomain input
        wrapper.find('Input[name="redirectDomain"]').simulate('change', { target: { value: 'redirect.com' } });
        expect(wrapper.find('Input[name="redirectDomain"]').props().value).toBe('redirect.com');
    });

    it('should call setParam with correct values when search button is clicked', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        
        // Set input values
        wrapper.find('Input[name="affUsername"]').simulate('change', { target: { value: 'testuser' } });
        wrapper.find('Input[name="affDomain"]').simulate('change', { target: { value: 'test.com' } });
        wrapper.find('Input[name="redirectDomain"]').simulate('change', { target: { value: 'redirect.com' } });

        // Click search button
        wrapper.find('Button').simulate('click');

        expect(defaultProps.setParam).toHaveBeenCalledWith({
            AffUsername: 'testuser',
            AffDomain: 'test.com',
            RedirectDomain: 'redirect.com',
            PageIndex: 1,
            PageSize: defaultPagingOption.PageSize
        });
    });

    it('should call setParam when Enter key is pressed', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const preventDefault = jest.fn();
        
        // Set input values
        wrapper.find('Input[name="affUsername"]').simulate('change', { target: { value: 'testuser' } });
        wrapper.find('Input[name="affDomain"]').simulate('change', { target: { value: 'test.com' } });
        wrapper.find('Input[name="redirectDomain"]').simulate('change', { target: { value: 'redirect.com' } });

        // Simulate Enter key press on any input
        wrapper.find('Input[name="affUsername"]').simulate('keyPress', { charCode: 13, preventDefault });

        expect(preventDefault).toHaveBeenCalled();
        expect(defaultProps.setParam).toHaveBeenCalledWith({
            AffUsername: 'testuser',
            AffDomain: 'test.com',
            RedirectDomain: 'redirect.com',
            PageIndex: 1,
            PageSize: defaultPagingOption.PageSize
        });
    });

    it('should not call setParam when non-Enter key is pressed', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        
        // Set input values
        wrapper.find('Input[name="affUsername"]').simulate('change', { target: { value: 'testuser' } });
        wrapper.find('Input[name="affDomain"]').simulate('change', { target: { value: 'test.com' } });
        wrapper.find('Input[name="redirectDomain"]').simulate('change', { target: { value: 'redirect.com' } });

        // Simulate non-Enter key press
        wrapper.find('Input[name="affUsername"]').simulate('keyPress', { charCode: 65 }); // 'A' key

        expect(defaultProps.setParam).not.toHaveBeenCalled();
    });

    it('should handle empty input values', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        
        // Click search button without setting any values
        wrapper.find('Button').simulate('click');

        expect(defaultProps.setParam).toHaveBeenCalledWith({
            AffUsername: '',
            AffDomain: '',
            RedirectDomain: '',
            PageIndex: 1,
            PageSize: defaultPagingOption.PageSize
        });
    });

    it('should handle Enter key press on any input field', () => {
        const wrapper = shallow(<Filter {...defaultProps} />);
        const preventDefault = jest.fn();
        
        // Set input values
        wrapper.find('Input[name="affUsername"]').simulate('change', { target: { value: 'testuser' } });
        wrapper.find('Input[name="affDomain"]').simulate('change', { target: { value: 'test.com' } });
        wrapper.find('Input[name="redirectDomain"]').simulate('change', { target: { value: 'redirect.com' } });

        // Simulate Enter key press on each input
        wrapper.find('Input[name="affDomain"]').simulate('keyPress', { charCode: 13, preventDefault });
        expect(defaultProps.setParam).toHaveBeenCalledWith({
            AffUsername: 'testuser',
            AffDomain: 'test.com',
            RedirectDomain: 'redirect.com',
            PageIndex: 1,
            PageSize: defaultPagingOption.PageSize
        });

        wrapper.find('Input[name="redirectDomain"]').simulate('keyPress', { charCode: 13, preventDefault });
        expect(defaultProps.setParam).toHaveBeenCalledWith({
            AffUsername: 'testuser',
            AffDomain: 'test.com',
            RedirectDomain: 'redirect.com',
            PageIndex: 1,
            PageSize: defaultPagingOption.PageSize
        });
    });
}); 