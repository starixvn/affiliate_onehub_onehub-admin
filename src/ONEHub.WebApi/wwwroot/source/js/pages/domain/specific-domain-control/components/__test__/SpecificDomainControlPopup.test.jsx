import React from 'react';
import { SpecificDomainControlPopup } from '../SpecificDomainControlPopup';
import { shallow } from 'enzyme';

describe('SpecificDomainControlPopup Component', () => {
    const defaultProps = {
        selectedDomainId: null,
        param: 'test',
        toggleLoader: jest.fn(),
        fetchData: jest.fn(),
        setSelectedDomainId: jest.fn(),
        getSpecificDomainById: jest.fn(),
        insertDomain: jest.fn(),
        updateDomain: jest.fn()
    };

    const mockDomain = {
        specificDomainControlId: 1,
        affDomain: 'test.com',
        redirectDomain: 'redirect.com',
        affDomainIsSSL: false,
        redirectDomainIsSSL: false,
        status: true
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render correctly in initial state', () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            expect(wrapper).toMatchSnapshot();
        });

        it('should show popup when selectedDomainId is provided', () => {
            const props = { ...defaultProps, selectedDomainId: 1 };
            const wrapper = shallow(<SpecificDomainControlPopup {...props} />);
            wrapper.setState({ selectedDomain: mockDomain });
            
            const modal = wrapper.find('Modal');
            expect(modal.exists()).toBe(true);
            expect(modal.prop('isOpen')).toBe(true);
        });

        it('should not show popup when selectedDomainId is null', () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({ selectedDomain: null });
            
            const modal = wrapper.find('Modal');
            expect(modal.exists()).toBe(false);
        });
    });

    describe('Form Input Handling', () => {
        it('should handle text input changes correctly', () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({ 
                selectedDomain: { 
                    specificDomainControlId: 0,
                    affDomain: '',
                    affDomainIsSSL: false
                } 
            });

            wrapper.find('Input[name="affDomain"]').simulate('change', { 
                target: { 
                    name: 'affDomain', 
                    value: 'newdomain.com' 
                } 
            });

            expect(wrapper.state('selectedDomain').affDomain).toBe('newdomain.com');
        });

        it('should handle checkbox changes correctly', () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({ 
                selectedDomain: { 
                    specificDomainControlId: 0,
                    affDomainIsSSL: false
                } 
            });

            wrapper.find('Input[name="affDomainIsSSL"]').simulate('change', { 
                target: { 
                    name: 'affDomainIsSSL', 
                    type: 'checkbox',
                    checked: true 
                } 
            });

            expect(wrapper.state('selectedDomain').affDomainIsSSL).toBe(true);
        });

        it('should handle affiliate names input changes correctly', () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({ 
                isInsert: true,
                selectedDomain: { specificDomainControlId: 0 },
                affUsernames: ''
            });

            const preventDefault = jest.fn();

            wrapper.find('Input[name="affUsernames"]').simulate('change', { 
                target: { value: 'test1,test2' },
                preventDefault
            });

            expect(wrapper.state('affUsernames')).toBe('test1,test2');
            expect(preventDefault).toHaveBeenCalled();
        });

        it('should handle affiliate names blur correctly', () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({ 
                isInsert: true,
                selectedDomain: { specificDomainControlId: 0 },
                affUsernames: 'test1, test2, test3, , test4' 
            });

            wrapper.find('Input[name="affUsernames"]').simulate('blur');

            expect(wrapper.state('affUsernames')).toBe('test1,test2,test3,test4');
        });
    });

    describe('Form Submission', () => {
        it('should handle successful domain insertion', async () => {
            const mockResult = { IsSuccessful: true, Message: 'Success' };
            const props = {
                ...defaultProps,
                insertSpecificDomain: jest.fn().mockResolvedValue(mockResult)
            };
            const wrapper = shallow(<SpecificDomainControlPopup {...props} />);
            wrapper.setState({
                isInsert: true,
                selectedDomain: {
                    specificDomainControlId: 0,
                    affDomain: 'test.com',
                    redirectDomain: 'redirect.com',
                    affDomainIsSSL: false,
                    redirectDomainIsSSL: false,
                    status: false
                },
                affUsernames: '12betaff001,12betaff002'
            });

            await wrapper.instance()._handleSubmit();

            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(props.insertSpecificDomain).toHaveBeenCalledWith({
                specificDomainControlId: 0,
                affDomain: 'test.com',
                redirectDomain: 'redirect.com',
                affDomainIsSSL: false,
                redirectDomainIsSSL: false,
                status: false,
                affUsername: '12betaff001,12betaff002'
            });
            expect(wrapper.state('isShowMessage')).toBe(true);
            expect(wrapper.state('isSuccess')).toBe(true);
        });

        it('should handle successful domain update', async () => {
            const mockResult = { IsSuccessful: true, Message: 'Success' };
            const props = {
                ...defaultProps,
                updateSpecificDomain: jest.fn().mockResolvedValue(mockResult)
            };
            const wrapper = shallow(<SpecificDomainControlPopup {...props} />);
            wrapper.setState({
                isInsert: false,
                selectedDomain: {
                    specificDomainControlId: 1,
                    affDomain: 'test.com',
                    redirectDomain: 'redirect.com',
                    affDomainIsSSL: true,
                    redirectDomainIsSSL: false,
                    status: true
                }
            });

            await wrapper.instance()._handleSubmit();

            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(props.updateSpecificDomain).toHaveBeenCalledWith({
                specificDomainControlId: 1,
                affDomain: 'test.com',
                redirectDomain: 'redirect.com',
                affDomainIsSSL: true,
                redirectDomainIsSSL: false,
                status: true
            });
            expect(wrapper.state('isShowMessage')).toBe(true);
            expect(wrapper.state('isSuccess')).toBe(true);
        });

        it('should handle domain validation failure', async () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({
                isInsert: true,
                selectedDomain: {
                    specificDomainControlId: 0,
                    affDomain: '',
                    redirectDomain: '',
                    affDomainIsSSL: false,
                    redirectDomainIsSSL: false,
                    status: false
                },
                affUsernames: 'test1,test2'
            });

            await wrapper.instance()._handleSubmit();

            expect(wrapper.state('isShowMessage')).toBe(true);
            expect(wrapper.state('isSuccess')).toBe(false);
            expect(wrapper.state('message')).toBe('Affiliate(s) is an invalid format or affiliate!');
        });

        it('should handle affiliate names validation failure', async () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({
                isInsert: true,
                selectedDomain: {
                    specificDomainControlId: 0,
                    affDomain: 'test.com',
                    redirectDomain: 'redirect.com',
                    affDomainIsSSL: false,
                    redirectDomainIsSSL: false,
                    status: false
                },
                affUsernames: ''
            });

            await wrapper.instance()._handleSubmit();

            expect(wrapper.state('isShowMessage')).toBe(true);
            expect(wrapper.state('isSuccess')).toBe(false);
            expect(wrapper.state('message')).toBe('Please enter Affiliate(s)!');
        });
    });

    describe('Popup Management', () => {
        it('should handle close popup', () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({
                isShowMessage: true,
                message: 'Test message',
                selectedDomain: { specificDomainControlId: 1 }
            });

            wrapper.instance()._handleClosePopup();

            expect(wrapper.state('isShowMessage')).toBe(false);
            expect(wrapper.state('message')).toBe('');
            expect(wrapper.state('selectedDomain')).toBeNull();
            expect(defaultProps.setSelectedDomainId).toHaveBeenCalledWith(null);
        });

        it('should handle hide message with success', () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({
                isShowMessage: true,
                isSuccess: true
            });

            wrapper.instance()._hideMessage(true);

            expect(wrapper.state('isShowMessage')).toBe(false);
            expect(defaultProps.fetchData).toHaveBeenCalledWith('test');
            expect(defaultProps.setSelectedDomainId).toHaveBeenCalledWith(null);
        });

        it('should handle hide message without success', () => {
            const wrapper = shallow(<SpecificDomainControlPopup {...defaultProps} />);
            wrapper.setState({
                isShowMessage: true,
                isSuccess: false
            });

            wrapper.instance()._hideMessage(false);

            expect(wrapper.state('isShowMessage')).toBe(false);
            expect(defaultProps.fetchData).not.toHaveBeenCalled();
            expect(defaultProps.setSelectedDomainId).not.toHaveBeenCalled();
        });
    });
}); 