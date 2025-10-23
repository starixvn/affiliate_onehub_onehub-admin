import React from 'react';
import { AddAffMktAccountPopup } from '../AddAffMktAccountPopup';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

// Mock the custom hook
const mockHookReturn = {
    resultInfo: {
        isSuccess: true,
        isShowMessage: false,
        message: ''
    },

    generalInfo: {
        hasData: true,
        affType: 0,
        groupId: '1',
        preferredLanguage: 'en',
        targetCountryCode: 'US'
    },
    personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
    },
    additionalInfo: {
        address: '123 Main St',
        city: 'New York'
    },
    paymentInfo: {
        preferredPayment: 'visa',
        playerCustId: 123
    },
    websiteInfo: {
        siteUrl: 'https://example.com',
        hasWebSite: true
    },
    minimumPayment: 100,
    paymentMethods: [
        { id: 1, name: 'Visa' },
        { id: 2, name: 'MasterCard' }
    ],
    setGeneralInfo: jest.fn(),
    setPersonalInfo: jest.fn(),
    setAdditionalInfo: jest.fn(),
    setPaymentInfo: jest.fn(),
    setWebsiteInfo: jest.fn(),
    handleSubmit: jest.fn()
};

jest.mock('../../hooks/useNewMarketingAccountData', () => {
    return jest.fn(() => mockHookReturn);
});

// Mock the section components at the module level to work with both shallow and mount
jest.mock('../sections/GeneralInfo', () => {
    return function GeneralInfo(props) {
        return <div data-testid="general-info">GeneralInfo</div>;
    };
});

jest.mock('../sections/Personal', () => {
    return function Personal(props) {
        return <div data-testid="personal">Personal</div>;
    };
});

jest.mock('../sections/Additional', () => {
    return function Additional(props) {
        return <div data-testid="additional">Additional</div>;
    };
});

jest.mock('../sections/EmailFormat', () => {
    return function EmailFormat(props) {
        return <div data-testid="email-format">EmailFormat</div>;
    };
});

jest.mock('../sections/Payment', () => {
    return function Payment(props) {
        return <div data-testid="payment">Payment</div>;
    };
});

jest.mock('../sections/WebSite', () => {
    return function WebSite(props) {
        return <div data-testid="website">WebSite</div>;
    };
});

describe('marketing-account - components - AddAffMktAccountPopup', () => {
    const defaultProps = {
        aff: {
            affId: 12345,
            affName: 'TestAffiliate'
        },
        isShowAddAffMktAccountPopup: true,
        toggle: jest.fn(),
        toggleLoader: jest.fn(),
        setIsShowAddAffMktAccountPopup: jest.fn(),
        params: {
            Status: 'Approved',
            PageIndex: 1
        },
        setParam: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset mock implementation
        const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
        useNewMarketingAccountData.mockReturnValue(mockHookReturn);
    });

    // ===============================
    // EXISTING STABILITY TESTS
    // ===============================

    it('should render correctly when data is loaded', () => {
        const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should not render when generalInfo.hasData is false', () => {
        const mockHookWithoutData = {
            ...mockHookReturn,
            generalInfo: {
                ...mockHookReturn.generalInfo,
                hasData: false
            }
        };
        
        const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
        useNewMarketingAccountData.mockReturnValue(mockHookWithoutData);

        const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);

        expect(wrapper.type()).toBeNull();
    });

    it('should handle different aff objects', () => {
        const props = {
            ...defaultProps,
            aff: {
                affId: 67890,
                affName: 'AnotherAffiliate'
            }
        };

        expect(() => {
            shallow(<AddAffMktAccountPopup {...props} />);
        }).not.toThrow();
    });

    it('should handle modal visibility props', () => {
        // Test shown modal
        let wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
        expect(wrapper).toBeDefined();

        // Test hidden modal
        const hiddenProps = { ...defaultProps, isShowAddAffMktAccountPopup: false };
        wrapper = shallow(<AddAffMktAccountPopup {...hiddenProps} />);
        expect(wrapper).toBeDefined();
    });

    it('should handle different param objects', () => {
        const props = {
            ...defaultProps,
            params: {
                Status: 'Suspended',
                PageIndex: 2,
                PageSize: 50
            }
        };

        expect(() => {
            shallow(<AddAffMktAccountPopup {...props} />);
        }).not.toThrow();
    });

    it('should handle success alert state', () => {
        const mockHookWithSuccess = {
            ...mockHookReturn,
            resultInfo: {
                isSuccess: true,
                isShowMessage: true,
                message: 'Account created successfully'
            }
        };
        
        const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
        useNewMarketingAccountData.mockReturnValue(mockHookWithSuccess);

        expect(() => {
            shallow(<AddAffMktAccountPopup {...defaultProps} />);
        }).not.toThrow();
    });

    it('should handle error alert state', () => {
        const mockHookWithError = {
            ...mockHookReturn,
            resultInfo: {
                isSuccess: false,
                isShowMessage: true,
                message: 'Error creating account'
            }
        };
        
        const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
        useNewMarketingAccountData.mockReturnValue(mockHookWithError);

        expect(() => {
            shallow(<AddAffMktAccountPopup {...defaultProps} />);
        }).not.toThrow();
    });

    it('should handle callback functions properly', () => {
        const toggle = jest.fn();
        const toggleLoader = jest.fn();
        const setIsShowAddAffMktAccountPopup = jest.fn();
        const setParam = jest.fn();

        const props = {
            ...defaultProps,
            toggle,
            toggleLoader,
            setIsShowAddAffMktAccountPopup,
            setParam
        };

        expect(() => {
            shallow(<AddAffMktAccountPopup {...props} />);
        }).not.toThrow();
    });

    it('should maintain component structure', () => {
        const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
        
        expect(wrapper).toBeDefined();
        expect(wrapper.length).toBe(1);
    });

    it('should handle empty aff object gracefully', () => {
        const props = {
            ...defaultProps,
            aff: {
                affId: '',
                affName: ''
            }
        };

        expect(() => {
            shallow(<AddAffMktAccountPopup {...props} />);
        }).not.toThrow();
    });

    it('should handle null params', () => {
        const props = {
            ...defaultProps,
            params: null
        };

        expect(() => {
            shallow(<AddAffMktAccountPopup {...props} />);
        }).not.toThrow();
    });

    it('should handle different hook return states', () => {
        const complexHookReturn = {
            ...mockHookReturn,
            generalInfo: {
                ...mockHookReturn.generalInfo,
                hasData: true,
                affType: 1,
                groupId: '2'
            },
            personalInfo: {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com'
            }
        };

        const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
        useNewMarketingAccountData.mockReturnValue(complexHookReturn);

        expect(() => {
            shallow(<AddAffMktAccountPopup {...defaultProps} />);
        }).not.toThrow();
    });

    it('should handle component with all required props', () => {
        expect(() => {
            shallow(<AddAffMktAccountPopup {...defaultProps} />);
        }).not.toThrow();
    });

    it('should maintain stability with prop updates', () => {
        const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);

        expect(() => {
            wrapper.setProps({
                aff: { affId: 99999, affName: 'Updated' }
            });
        }).not.toThrow();
    });

    it('should handle complex aff structures', () => {
        const complexProps = {
            ...defaultProps,
            aff: {
                affId: 12345,
                affName: 'TestAffiliate',
                status: 'Active',
                type: 'Premium',
                registrationDate: '2023-01-01'
            }
        };

        expect(() => {
            shallow(<AddAffMktAccountPopup {...complexProps} />);
        }).not.toThrow();
    });

    // ===============================
    // FIXED INTEGRATION TESTS - MODAL BEHAVIOR
    // ===============================

    describe('Modal Behavior', () => {
        it('should open modal when isShowAddAffMktAccountPopup is true', () => {
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            const modal = wrapper.find('Modal');
            
            expect(modal).toHaveLength(1);
            expect(modal.prop('isOpen')).toBe(true);
            expect(modal.prop('backdrop')).toBe('static');
            expect(modal.prop('size')).toBe('lg');
        });

        it('should close modal when isShowAddAffMktAccountPopup is false', () => {
            const props = { ...defaultProps, isShowAddAffMktAccountPopup: false };
            const wrapper = shallow(<AddAffMktAccountPopup {...props} />);
            const modal = wrapper.find('Modal');
            
            expect(modal.prop('isOpen')).toBe(false);
        });

        it('should call toggle function when modal header close is clicked', () => {
            const mockToggle = jest.fn();
            const props = { ...defaultProps, toggle: mockToggle };
            const wrapper = shallow(<AddAffMktAccountPopup {...props} />);
            
            const modal = wrapper.find('Modal');
            modal.prop('toggle')();
            
            expect(mockToggle).toHaveBeenCalled();
        });

        it('should display correct modal title', () => {
            const wrapper = mount(<AddAffMktAccountPopup {...defaultProps} />);
            const wrapperHtml = wrapper.html();
            
            // Check that the modal contains expected content
            expect(wrapperHtml).toContain('Add a new Marketing account');
        });

        it('should have static backdrop to prevent accidental closes', () => {
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            const modal = wrapper.find('Modal');
            
            expect(modal.prop('backdrop')).toBe('static');
        });
    });

    // ===============================
    // FIXED INTEGRATION TESTS - FORM SECTIONS
    // ===============================

    describe('Form Integration', () => {
        it('should render all form sections with correct props', () => {
            const wrapper = mount(<AddAffMktAccountPopup {...defaultProps} />);
            
            expect(wrapper.find('[data-testid="general-info"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="personal"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="additional"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="email-format"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="website"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="payment"]')).toHaveLength(1);
        });

        it('should render form sections in correct order', () => {
            const wrapper = mount(<AddAffMktAccountPopup {...defaultProps} />);
            const sections = wrapper.find('[data-testid]');
            
            expect(sections.at(0).prop('data-testid')).toBe('general-info');
            expect(sections.at(1).prop('data-testid')).toBe('personal');
            expect(sections.at(2).prop('data-testid')).toBe('additional');
            expect(sections.at(3).prop('data-testid')).toBe('email-format');
            expect(sections.at(4).prop('data-testid')).toBe('website');
            expect(sections.at(5).prop('data-testid')).toBe('payment');
        });

        it('should have proper form structure', () => {
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            const modalBody = wrapper.find('ModalBody');
            
            expect(modalBody).toHaveLength(1);
        });
    });

    // ===============================
    // FIXED INTEGRATION TESTS - SAVE FUNCTIONALITY
    // ===============================

    describe('Save Functionality', () => {
        it('should render save button with correct styling', () => {
            const wrapper = mount(<AddAffMktAccountPopup {...defaultProps} />);
            const saveButton = wrapper.find('Button[color="success"]');
            
            expect(saveButton).toHaveLength(1);
            expect(saveButton.prop('className')).toBe('mb-3');
            expect(saveButton.text()).toBe('SAVE');
        });

        it('should handle save button click', () => {
            const mockHandleSubmit = jest.fn();
            const mockHookWithHandleSubmit = {
                ...mockHookReturn,
                handleSubmit: mockHandleSubmit
            };
            
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            useNewMarketingAccountData.mockReturnValue(mockHookWithHandleSubmit);
            
            const wrapper = mount(<AddAffMktAccountPopup {...defaultProps} />);
            const saveButton = wrapper.find('Button[color="success"]');
            
            saveButton.simulate('click');
            
            expect(mockHandleSubmit).toHaveBeenCalledWith(
                expect.objectContaining({ current: expect.anything() }),
                expect.any(Function)
            );
        });

        it('should pass modalBodyRef to handleSubmit', () => {
            const mockHandleSubmit = jest.fn();
            const mockHookWithHandleSubmit = {
                ...mockHookReturn,
                handleSubmit: mockHandleSubmit
            };
            
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            useNewMarketingAccountData.mockReturnValue(mockHookWithHandleSubmit);
            
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            const saveButton = wrapper.find('Button[color="success"]');
            
            saveButton.simulate('click');
            
            const [modalBodyRef, callback] = mockHandleSubmit.mock.calls[0];
            expect(modalBodyRef).toHaveProperty('current');
            expect(typeof callback).toBe('function');
        });

        it('should handle save errors gracefully', () => {
            const mockHandleSubmit = jest.fn(); // Don't call callback to simulate error
            const mockHookWithHandleSubmit = {
                ...mockHookReturn,
                handleSubmit: mockHandleSubmit
            };
            
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            useNewMarketingAccountData.mockReturnValue(mockHookWithHandleSubmit);
            
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            const saveButton = wrapper.find('Button[color="success"]');
            
            expect(() => {
                saveButton.simulate('click');
            }).not.toThrow();
        });
    });

    // ===============================
    // FIXED INTEGRATION TESTS - ALERT DISPLAY
    // ===============================

    describe('Alert Display', () => {
        it('should display success alert when resultInfo shows success', () => {
            const mockHookWithSuccess = {
                ...mockHookReturn,
                resultInfo: {
                    isSuccess: true,
                    isShowMessage: true,
                    message: 'Successfully added a new marketing account'
                }
            };
            
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            useNewMarketingAccountData.mockReturnValue(mockHookWithSuccess);
            
            const wrapper = mount(<AddAffMktAccountPopup {...defaultProps} />);
            const alert = wrapper.find('Alert[color="success"]');
            
            expect(alert).toHaveLength(1);
            expect(alert.prop('isOpen')).toBe(true);
            expect(wrapper.html()).toContain('Successfully added a new marketing account');
        });

        it('should display error alert when resultInfo shows error', () => {
            const mockHookWithError = {
                ...mockHookReturn,
                resultInfo: {
                    isSuccess: false,
                    isShowMessage: true,
                    message: 'Email Address is required'
                }
            };
            
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            useNewMarketingAccountData.mockReturnValue(mockHookWithError);
            
            const wrapper = mount(<AddAffMktAccountPopup {...defaultProps} />);
            const alert = wrapper.find('Alert[color="danger"]');
            
            expect(alert).toHaveLength(1);
            expect(alert.prop('isOpen')).toBe(true);
            expect(wrapper.html()).toContain('Email Address is required');
        });

        it('should hide alert when isShowMessage is false', () => {
            const mockHookWithHiddenAlert = {
                ...mockHookReturn,
                resultInfo: {
                    isSuccess: true,
                    isShowMessage: false,
                    message: 'Some message'
                }
            };
            
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            useNewMarketingAccountData.mockReturnValue(mockHookWithHiddenAlert);
            
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            const successAlert = wrapper.find('Alert[color="success"]');
            const errorAlert = wrapper.find('Alert[color="danger"]');
            
            expect(successAlert.prop('isOpen')).toBe(false);
            if (errorAlert.length > 0) {
                expect(errorAlert.prop('isOpen')).toBe(false);
            }
        });

        it('should render alert message with HTML content safely', () => {
            const mockHookWithHTMLMessage = {
                ...mockHookReturn,
                resultInfo: {
                    isSuccess: false,
                    isShowMessage: true,
                    message: '<strong>Error:</strong> Invalid email format'
                }
            };
            
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            useNewMarketingAccountData.mockReturnValue(mockHookWithHTMLMessage);
            
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            const alert = wrapper.find('Alert[color="danger"]');
            const htmlDiv = alert.find('div[dangerouslySetInnerHTML]');
            
            expect(htmlDiv).toHaveLength(1);
            expect(htmlDiv.prop('dangerouslySetInnerHTML').__html).toBe('<strong>Error:</strong> Invalid email format');
        });
    });

    // ===============================
    // SIMPLIFIED INTEGRATION TESTS - HOOK INTEGRATION
    // ===============================

    describe('Hook Integration', () => {
        it('should pass correct affId to useNewMarketingAccountData hook', () => {
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            
            shallow(<AddAffMktAccountPopup {...defaultProps} />);
            
            expect(useNewMarketingAccountData).toHaveBeenCalledWith(
                12345,
                defaultProps.toggleLoader
            );
        });

        it('should pass correct toggleLoader function to hook', () => {
            const mockToggleLoader = jest.fn();
            const props = { ...defaultProps, toggleLoader: mockToggleLoader };
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            
            shallow(<AddAffMktAccountPopup {...props} />);
            
            expect(useNewMarketingAccountData).toHaveBeenCalledWith(
                12345,
                mockToggleLoader
            );
        });

        it('should handle different affId types', () => {
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            
            // Test with string affId
            const propsWithStringId = {
                ...defaultProps,
                aff: { affId: '12345', affName: 'Test' }
            };
            
            shallow(<AddAffMktAccountPopup {...propsWithStringId} />);
            
            expect(useNewMarketingAccountData).toHaveBeenCalledWith(
                '12345',
                defaultProps.toggleLoader
            );
        });

        it('should handle null affId gracefully', () => {
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            
            const propsWithNullId = {
                ...defaultProps,
                aff: { affId: null, affName: 'Test' }
            };
            
            expect(() => {
                shallow(<AddAffMktAccountPopup {...propsWithNullId} />);
            }).not.toThrow();
            
            expect(useNewMarketingAccountData).toHaveBeenCalledWith(
                null,
                defaultProps.toggleLoader
            );
        });

        it('should use hook return values correctly', () => {
            const customMockHook = {
                ...mockHookReturn,
                generalInfo: { hasData: true, customField: 'test' },
                personalInfo: { email: 'custom@test.com' },
                handleSubmit: jest.fn()
            };
            
            const useNewMarketingAccountData = require('../../hooks/useNewMarketingAccountData');
            useNewMarketingAccountData.mockReturnValue(customMockHook);
            
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            
            // Component should render since hasData is true
            expect(wrapper.find('Modal')).toHaveLength(1);
            
            // Save button should use hook's handleSubmit
            const saveButton = wrapper.find('Button[color="success"]');
            saveButton.simulate('click');
            
            expect(customMockHook.handleSubmit).toHaveBeenCalled();
        });
    });

    // ===============================
    // SIMPLIFIED INTEGRATION TESTS - COMPONENT LIFECYCLE
    // ===============================

    describe('Component Lifecycle', () => {
        it('should re-render when props change', () => {
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            
            expect(() => {
                wrapper.setProps({
                    ...defaultProps,
                    aff: { affId: 99999, affName: 'New Affiliate' }
                });
            }).not.toThrow();
        });

        it('should handle modal visibility changes', () => {
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            let modal = wrapper.find('Modal');
            
            expect(modal.prop('isOpen')).toBe(true);
            
            wrapper.setProps({ ...defaultProps, isShowAddAffMktAccountPopup: false });
            modal = wrapper.find('Modal');
            
            expect(modal.prop('isOpen')).toBe(false);
        });

        it('should handle component unmounting gracefully', () => {
            const wrapper = shallow(<AddAffMktAccountPopup {...defaultProps} />);
            
            expect(() => {
                wrapper.unmount();
            }).not.toThrow();
        });
    });
}); 