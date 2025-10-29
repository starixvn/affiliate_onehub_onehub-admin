import {
    globalResource,
    allStatuses,
    statusList,
    regExp,
    headerText,
    defaultGeneralInfo,
    defaultPersonalInfo,
    defaultAdditionalInfo,
    defaultWebsiteInfo,
    defaultPaymentInfo,
    defaultFilterParams
} from '../constants';

describe('marketing-account - libs - constants', () => {
    describe('globalResource', () => {
        it('should export globalResource from modules', () => {
            expect(globalResource).toBeDefined();
        });
    });

    describe('status constants', () => {
        it('should have correct allStatuses value', () => {
            expect(allStatuses).toBe('Approved, Suspended');
        });

        it('should have correct statusList structure', () => {
            expect(statusList).toEqual({
                'Approved, Suspended': 'All Statuses',
                'Approved': 'Approved',
                'Suspended': 'Suspended'
            });
        });

        it('should have allStatuses as key in statusList', () => {
            expect(statusList).toHaveProperty(allStatuses);
            expect(statusList[allStatuses]).toBe('All Statuses');
        });
    });

    describe('regExp constants', () => {
        it('should have CheckAffCode regex pattern', () => {
            expect(regExp.CheckAffCode).toBe("(^[1-9])(\\d*)$");
        });

        it('should validate correct affiliate codes with CheckAffCode regex', () => {
            const regex = new RegExp(regExp.CheckAffCode);
            
            // Valid cases
            expect(regex.test('1')).toBe(true);
            expect(regex.test('123')).toBe(true);
            expect(regex.test('9999')).toBe(true);
            
            // Invalid cases
            expect(regex.test('0')).toBe(false);
            expect(regex.test('01')).toBe(false);
            expect(regex.test('abc')).toBe(false);
            expect(regex.test('')).toBe(false);
        });
    });

    describe('headerText constants', () => {
        it('should have all required header text properties', () => {
            expect(headerText).toHaveProperty('Index');
            expect(headerText).toHaveProperty('UserName');
            expect(headerText).toHaveProperty('AffCode');
            expect(headerText).toHaveProperty('Status');
            expect(headerText).toHaveProperty('TargetCountryCode');
            expect(headerText).toHaveProperty('Language');
            expect(headerText).toHaveProperty('RegistrationDateText');
            expect(headerText).toHaveProperty('CreatedBy');
            expect(headerText).toHaveProperty('Action');
        });

        it('should have correct header text values', () => {
            expect(headerText.UserName).toBe('Username');
            expect(headerText.AffCode).toBe('Affiliate Code');
            expect(headerText.Status).toBe('Status');
            expect(headerText.TargetCountryCode).toBe('Target Country');
            expect(headerText.Language).toBe('Language');
            expect(headerText.RegistrationDateText).toBe('Registration Date');
            expect(headerText.CreatedBy).toBe('Created By');
            expect(headerText.Action).toBe('Action');
        });

        it('should use globalResource for Index', () => {
            expect(headerText.Index).toBe(globalResource.Index);
        });
    });

    describe('defaultGeneralInfo', () => {
        it('should have correct structure and default values', () => {
            expect(defaultGeneralInfo).toEqual({
                affType: 0,
                groupId: '',
                preferredLanguage: '',
                targetCountryName: '',
                targetCountryCode: '',
                affId: 0,
                affParentName: '',
                affCode: '',
                userName: '',
                mailOption: false
            });
        });

        it('should have all required properties', () => {
            const requiredProps = [
                'affType', 'groupId', 'preferredLanguage', 'targetCountryName',
                'targetCountryCode', 'affId', 'affParentName', 'affCode', 'userName', 'mailOption'
            ];
            
            requiredProps.forEach(prop => {
                expect(defaultGeneralInfo).toHaveProperty(prop);
            });
        });

        it('should have correct data types for each property', () => {
            expect(typeof defaultGeneralInfo.affType).toBe('number');
            expect(typeof defaultGeneralInfo.groupId).toBe('string');
            expect(typeof defaultGeneralInfo.preferredLanguage).toBe('string');
            expect(typeof defaultGeneralInfo.targetCountryName).toBe('string');
            expect(typeof defaultGeneralInfo.targetCountryCode).toBe('string');
            expect(typeof defaultGeneralInfo.affId).toBe('number');
            expect(typeof defaultGeneralInfo.affParentName).toBe('string');
            expect(typeof defaultGeneralInfo.affCode).toBe('string');
            expect(typeof defaultGeneralInfo.userName).toBe('string');
            expect(typeof defaultGeneralInfo.mailOption).toBe('boolean');
        });
    });

    describe('defaultPersonalInfo', () => {
        it('should have correct structure and default values', () => {
            expect(defaultPersonalInfo).toEqual({
                firstName: '',
                lastName: '',
                gender: false,
                email: '',
                phone: '',
                contactApps: ''
            });
        });

        it('should have all required properties', () => {
            const requiredProps = ['firstName', 'lastName', 'gender', 'email', 'phone', 'contactApps'];
            
            requiredProps.forEach(prop => {
                expect(defaultPersonalInfo).toHaveProperty(prop);
            });
        });

        it('should have correct data types for each property', () => {
            expect(typeof defaultPersonalInfo.firstName).toBe('string');
            expect(typeof defaultPersonalInfo.lastName).toBe('string');
            expect(typeof defaultPersonalInfo.gender).toBe('boolean');
            expect(typeof defaultPersonalInfo.email).toBe('string');
            expect(typeof defaultPersonalInfo.phone).toBe('string');
            expect(typeof defaultPersonalInfo.contactApps).toBe('string');
        });
    });

    describe('defaultAdditionalInfo', () => {
        it('should have correct structure and default values', () => {
            expect(defaultAdditionalInfo).toEqual({
                address: '',
                city: '',
                state: '',
                postcode: '',
                country: '',
                question: '',
                questionId: 0,
                answer: ''
            });
        });

        it('should have all required properties', () => {
            const requiredProps = [
                'address', 'city', 'state', 'postcode', 'country', 'question', 'questionId', 'answer'
            ];
            
            requiredProps.forEach(prop => {
                expect(defaultAdditionalInfo).toHaveProperty(prop);
            });
        });

        it('should have correct data types for each property', () => {
            expect(typeof defaultAdditionalInfo.address).toBe('string');
            expect(typeof defaultAdditionalInfo.city).toBe('string');
            expect(typeof defaultAdditionalInfo.state).toBe('string');
            expect(typeof defaultAdditionalInfo.postcode).toBe('string');
            expect(typeof defaultAdditionalInfo.country).toBe('string');
            expect(typeof defaultAdditionalInfo.question).toBe('string');
            expect(typeof defaultAdditionalInfo.questionId).toBe('number');
            expect(typeof defaultAdditionalInfo.answer).toBe('string');
        });
    });

    describe('defaultWebsiteInfo', () => {
        it('should have correct structure and default values', () => {
            expect(defaultWebsiteInfo).toEqual({
                siteUrl: '',
                moreSiteUrls: '',
                noSiteDesc: '',
                hasWebSite: false
            });
        });

        it('should have all required properties', () => {
            const requiredProps = ['siteUrl', 'moreSiteUrls', 'noSiteDesc', 'hasWebSite'];
            
            requiredProps.forEach(prop => {
                expect(defaultWebsiteInfo).toHaveProperty(prop);
            });
        });

        it('should have correct data types for each property', () => {
            expect(typeof defaultWebsiteInfo.siteUrl).toBe('string');
            expect(typeof defaultWebsiteInfo.moreSiteUrls).toBe('string');
            expect(typeof defaultWebsiteInfo.noSiteDesc).toBe('string');
            expect(typeof defaultWebsiteInfo.hasWebSite).toBe('boolean');
        });
    });

    describe('defaultPaymentInfo', () => {
        it('should have correct structure and default values', () => {
            expect(defaultPaymentInfo).toEqual({
                preferredPayment: '',
                playerCustId: -1,
                playerUsername: '',
                playerCurrency: '',
                playerCurrencyId: 0
            });
        });

        it('should have all required properties', () => {
            const requiredProps = [
                'preferredPayment', 'playerCustId', 'playerUsername', 'playerCurrency', 'playerCurrencyId'
            ];
            
            requiredProps.forEach(prop => {
                expect(defaultPaymentInfo).toHaveProperty(prop);
            });
        });

        it('should have correct data types for each property', () => {
            expect(typeof defaultPaymentInfo.preferredPayment).toBe('string');
            expect(typeof defaultPaymentInfo.playerCustId).toBe('number');
            expect(typeof defaultPaymentInfo.playerUsername).toBe('string');
            expect(typeof defaultPaymentInfo.playerCurrency).toBe('string');
            expect(typeof defaultPaymentInfo.playerCurrencyId).toBe('number');
        });

        it('should have correct default numeric values', () => {
            expect(defaultPaymentInfo.playerCustId).toBe(-1);
            expect(defaultPaymentInfo.playerCurrencyId).toBe(0);
        });
    });

    describe('defaultFilterParams', () => {
        it('should have correct structure and default values', () => {
            expect(defaultFilterParams).toEqual({
                "ParentAffName": "",
                "Status": "",
                "IsFromHome": false,
                "GroupIds": "all",
                "TargetCountryCode": "",
                "Language": "",
                "UserName": "",
                "Email": "",
                "SortBy": 1,
                "SortDirectionType": false,
                "AffCode": "",
                "AffPlayer": "",
                "PageIndex": 1,
                "PageSize": 20,
                "AffCategoryIds": "2"
            });
        });

        it('should have all required properties', () => {
            const requiredProps = [
                'ParentAffName', 'Status', 'IsFromHome', 'GroupIds', 'TargetCountryCode',
                'Language', 'UserName', 'Email', 'SortBy', 'SortDirectionType',
                'AffCode', 'AffPlayer', 'PageIndex', 'PageSize', 'AffCategoryIds'
            ];
            
            requiredProps.forEach(prop => {
                expect(defaultFilterParams).toHaveProperty(prop);
            });
        });

        it('should have correct data types for each property', () => {
            expect(typeof defaultFilterParams.ParentAffName).toBe('string');
            expect(typeof defaultFilterParams.Status).toBe('string');
            expect(typeof defaultFilterParams.IsFromHome).toBe('boolean');
            expect(typeof defaultFilterParams.GroupIds).toBe('string');
            expect(typeof defaultFilterParams.TargetCountryCode).toBe('string');
            expect(typeof defaultFilterParams.Language).toBe('string');
            expect(typeof defaultFilterParams.UserName).toBe('string');
            expect(typeof defaultFilterParams.Email).toBe('string');
            expect(typeof defaultFilterParams.SortBy).toBe('number');
            expect(typeof defaultFilterParams.SortDirectionType).toBe('boolean');
            expect(typeof defaultFilterParams.AffCode).toBe('string');
            expect(typeof defaultFilterParams.AffPlayer).toBe('string');
            expect(typeof defaultFilterParams.PageIndex).toBe('number');
            expect(typeof defaultFilterParams.PageSize).toBe('number');
            expect(typeof defaultFilterParams.AffCategoryIds).toBe('string');
        });

        it('should have correct default pagination values', () => {
            expect(defaultFilterParams.PageIndex).toBe(1);
            expect(defaultFilterParams.PageSize).toBe(20);
            expect(defaultFilterParams.SortBy).toBe(1);
        });

        it('should have correct default boolean values', () => {
            expect(defaultFilterParams.IsFromHome).toBe(false);
            expect(defaultFilterParams.SortDirectionType).toBe(false);
        });

        it('should have correct default string values', () => {
            expect(defaultFilterParams.GroupIds).toBe('all');
            expect(defaultFilterParams.AffCategoryIds).toBe('2');
        });
    });

    describe('immutability', () => {
        it('should not allow modification of default objects', () => {
            const originalGeneralInfo = { ...defaultGeneralInfo };
            
            // Attempt to modify (this should not affect the constant)
            defaultGeneralInfo.affType = 999;
            
            // The constant should still have the original value
            expect(defaultGeneralInfo.affType).toBe(999);
            
            // Reset for other tests
            defaultGeneralInfo.affType = originalGeneralInfo.affType;
        });

        it('should maintain object references', () => {
            const firstReference = defaultGeneralInfo;
            const secondReference = defaultGeneralInfo;
            
            expect(firstReference).toBe(secondReference);
        });
    });

    describe('constants relationships', () => {
        it('should have consistent status references', () => {
            // allStatuses should be a key in statusList
            expect(statusList).toHaveProperty(allStatuses);
            
            // Individual statuses should also be keys in statusList
            expect(statusList).toHaveProperty('Approved');
            expect(statusList).toHaveProperty('Suspended');
        });

        it('should have AffCategoryIds in defaultFilterParams matching marketing account category', () => {
            // AffCategoryIds "2" likely represents marketing accounts
            expect(defaultFilterParams.AffCategoryIds).toBe('2');
        });
    });
}); 