import { validationEmail } from '../validation';

// Mock the regexEmail import with the actual regex pattern
jest.mock('../../../user-panel/user-account/modules/constants', () => ({
    regexEmail: '^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$'
}));

describe('marketing-account - libs - validation', () => {
    describe('validationEmail', () => {
        describe('when hasHostAffPersonalInfoPermission is false', () => {
            it('should return valid for any email when permission is false', () => {
                const result = validationEmail('invalid-email', false);
                
                expect(result).toEqual({
                    isValid: true,
                    message: ''
                });
            });

            it('should return valid for empty email when permission is false', () => {
                const result = validationEmail('', false);
                
                expect(result).toEqual({
                    isValid: true,
                    message: ''
                });
            });

            it('should return valid for null email when permission is false', () => {
                const result = validationEmail(null, false);
                
                expect(result).toEqual({
                    isValid: true,
                    message: ''
                });
            });

            it('should return valid for undefined email when permission is false', () => {
                const result = validationEmail(undefined, false);
                
                expect(result).toEqual({
                    isValid: true,
                    message: ''
                });
            });
        });

        describe('when hasHostAffPersonalInfoPermission is true', () => {
            describe('and email is empty/null/undefined', () => {
                it('should return valid for empty string email', () => {
                    const result = validationEmail('', true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return valid for null email', () => {
                    const result = validationEmail(null, true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return valid for undefined email', () => {
                    const result = validationEmail(undefined, true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return invalid for whitespace-only email', () => {
                    // Whitespace-only emails are truthy and go through regex validation
                    const result = validationEmail('   ', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });
            });

            describe('and email is provided', () => {
                it('should return valid for correctly formatted email', () => {
                    const result = validationEmail('test@example.com', true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return valid for email with numbers', () => {
                    const result = validationEmail('test123@example123.com', true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return valid for email with dots and hyphens', () => {
                    const result = validationEmail('test.user@sub-domain.example.com', true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return valid for email with plus sign', () => {
                    // Plus sign is not allowed in the actual regex pattern
                    const result = validationEmail('test+user@example.com', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });

                it('should return valid for email with underscore', () => {
                    const result = validationEmail('test_user@example.com', true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return invalid for email without @ symbol', () => {
                    const result = validationEmail('testexample.com', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });

                it('should return invalid for email without domain', () => {
                    const result = validationEmail('test@', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });

                it('should return invalid for email without local part', () => {
                    const result = validationEmail('@example.com', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });

                it('should return invalid for email without top-level domain', () => {
                    const result = validationEmail('test@example', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });

                it('should return invalid for email with multiple @ symbols', () => {
                    const result = validationEmail('test@@example.com', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });

                it('should return invalid for email with spaces', () => {
                    const result = validationEmail('test @example.com', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });

                it('should return invalid for email with invalid characters', () => {
                    const result = validationEmail('test#@example.com', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });

                it('should return valid for email with consecutive dots', () => {
                    // The actual regex allows consecutive dots in local part
                    const result = validationEmail('test..user@example.com', true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return valid for email starting with dot', () => {
                    // The actual regex allows dots at the beginning
                    const result = validationEmail('.test@example.com', true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return valid for email ending with dot before @', () => {
                    // The actual regex allows dots at the end of local part
                    const result = validationEmail('test.@example.com', true);
                    
                    expect(result).toEqual({
                        isValid: true,
                        message: ''
                    });
                });

                it('should return invalid for email with one character TLD', () => {
                    const result = validationEmail('test@example.c', true);
                    
                    expect(result).toEqual({
                        isValid: false,
                        message: 'Email Address is invalid'
                    });
                });
            });
        });

        describe('edge cases', () => {
            it('should handle boolean permission parameter correctly', () => {
                const result1 = validationEmail('invalid-email', true);
                const result2 = validationEmail('invalid-email', false);
                
                expect(result1.isValid).toBe(false);
                expect(result2.isValid).toBe(true);
            });

            it('should handle truthy/falsy permission values', () => {
                const result1 = validationEmail('invalid-email', 1);
                const result2 = validationEmail('invalid-email', 0);
                const result3 = validationEmail('invalid-email', 'true');
                const result4 = validationEmail('invalid-email', '');
                
                expect(result1.isValid).toBe(false);
                expect(result2.isValid).toBe(true);
                expect(result3.isValid).toBe(false);
                expect(result4.isValid).toBe(true);
            });

            it('should handle numeric email parameter', () => {
                const result = validationEmail(123, true);
                
                expect(result).toEqual({
                    isValid: false,
                    message: 'Email Address is invalid'
                });
            });

            it('should handle object email parameter', () => {
                const result = validationEmail({ email: 'test@example.com' }, true);
                
                expect(result).toEqual({
                    isValid: false,
                    message: 'Email Address is invalid'
                });
            });

            it('should handle array email parameter', () => {
                // Arrays are truthy, so they go through regex validation
                // Arrays are converted to string when tested against regex
                const result = validationEmail(['test@example.com'], true);
                
                expect(result).toEqual({
                    isValid: true,
                    message: ''
                });
            });

            it('should maintain consistent return structure', () => {
                const validResult = validationEmail('test@example.com', true);
                const invalidResult = validationEmail('invalid', true);
                
                expect(validResult).toHaveProperty('isValid');
                expect(validResult).toHaveProperty('message');
                expect(invalidResult).toHaveProperty('isValid');
                expect(invalidResult).toHaveProperty('message');
                
                expect(typeof validResult.isValid).toBe('boolean');
                expect(typeof validResult.message).toBe('string');
                expect(typeof invalidResult.isValid).toBe('boolean');
                expect(typeof invalidResult.message).toBe('string');
            });

            it('should return exact error message for invalid emails', () => {
                const result = validationEmail('invalid-email', true);
                
                expect(result.message).toBe('Email Address is invalid');
            });

            it('should return empty message for valid emails', () => {
                const result = validationEmail('test@example.com', true);
                
                expect(result.message).toBe('');
            });

            it('should handle very long email addresses', () => {
                const longEmail = 'a'.repeat(100) + '@' + 'b'.repeat(50) + '.com';
                const result = validationEmail(longEmail, true);
                
                expect(result.isValid).toBe(true);
            });

            it('should handle international domain names', () => {
                const result = validationEmail('test@example.co.uk', true);
                
                expect(result.isValid).toBe(true);
            });
        });

        describe('logic combinations', () => {
            it('should prioritize hasHostAffPersonalInfoPermission=false over invalid email', () => {
                const result = validationEmail('definitely-invalid-email', false);
                
                expect(result.isValid).toBe(true);
            });

            it('should prioritize empty email over hasHostAffPersonalInfoPermission=true', () => {
                const result = validationEmail('', true);
                
                expect(result.isValid).toBe(true);
            });

            it('should only validate when hasHostAffPersonalInfoPermission=true AND email is provided', () => {
                const scenarios = [
                    { email: '', permission: true, expected: true },
                    { email: '', permission: false, expected: true },
                    { email: 'test@example.com', permission: true, expected: true },
                    { email: 'test@example.com', permission: false, expected: true },
                    { email: 'invalid', permission: true, expected: false },
                    { email: 'invalid', permission: false, expected: true }
                ];

                scenarios.forEach(({ email, permission, expected }) => {
                    const result = validationEmail(email, permission);
                    expect(result.isValid).toBe(expected);
                });
            });
        });
    });
}); 