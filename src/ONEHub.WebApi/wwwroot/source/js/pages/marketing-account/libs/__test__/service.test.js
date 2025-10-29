import { createMarketingAccount } from '../service';

// Mock the global post function
global.post = jest.fn();

describe('marketing-account - libs - service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createMarketingAccount', () => {
        it('should call post with correct endpoint and data', async () => {
            const testData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            const mockResponse = {
                status: 200,
                data: {
                    isSuccessful: true,
                    message: 'Account created successfully'
                }
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount(testData);

            expect(global.post).toHaveBeenCalledWith(
                'Portal/MarketingAccount/CreateMarketingAccount',
                testData
            );
            expect(result).toEqual(mockResponse.data);
        });

        it('should return response data when status is 200', async () => {
            const testData = { email: 'test@example.com' };
            const mockResponse = {
                status: 200,
                data: {
                    isSuccessful: true,
                    accountId: 12345
                }
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount(testData);

            expect(result).toEqual(mockResponse.data);
        });

        it('should return null when status is not 200', async () => {
            const testData = { email: 'test@example.com' };
            const mockResponse = {
                status: 400,
                data: {
                    error: 'Bad request'
                }
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount(testData);

            expect(result).toBeNull();
        });

        it('should return null when response is null', async () => {
            const testData = { email: 'test@example.com' };

            global.post.mockResolvedValue(null);

            const result = await createMarketingAccount(testData);

            expect(result).toBeNull();
        });

        it('should return null when response is undefined', async () => {
            const testData = { email: 'test@example.com' };

            global.post.mockResolvedValue(undefined);

            const result = await createMarketingAccount(testData);

            expect(result).toBeNull();
        });

        it('should handle post request rejection', async () => {
            const testData = { email: 'test@example.com' };

            global.post.mockRejectedValue(new Error('Network error'));

            await expect(createMarketingAccount(testData)).rejects.toThrow('Network error');
        });

        it('should handle empty data parameter', async () => {
            const mockResponse = {
                status: 200,
                data: { isSuccessful: true }
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount({});

            expect(global.post).toHaveBeenCalledWith(
                'Portal/MarketingAccount/CreateMarketingAccount',
                {}
            );
            expect(result).toEqual(mockResponse.data);
        });

        it('should handle null data parameter', async () => {
            const mockResponse = {
                status: 200,
                data: { isSuccessful: true }
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount(null);

            expect(global.post).toHaveBeenCalledWith(
                'Portal/MarketingAccount/CreateMarketingAccount',
                null
            );
            expect(result).toEqual(mockResponse.data);
        });

        it('should handle complex data objects', async () => {
            const complexData = {
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
                    preferredPayment: 'paypal'
                },
                websiteInfo: {
                    hasWebSite: true,
                    siteUrl: 'https://example.com'
                }
            };

            const mockResponse = {
                status: 200,
                data: { isSuccessful: true, accountId: 99999 }
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount(complexData);

            expect(global.post).toHaveBeenCalledWith(
                'Portal/MarketingAccount/CreateMarketingAccount',
                complexData
            );
            expect(result).toEqual(mockResponse.data);
        });

        it('should handle response with status 201', async () => {
            const testData = { email: 'test@example.com' };
            const mockResponse = {
                status: 201,
                data: { isSuccessful: true }
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount(testData);

            expect(result).toBeNull();
        });

        it('should handle response with status 500', async () => {
            const testData = { email: 'test@example.com' };
            const mockResponse = {
                status: 500,
                data: { error: 'Internal server error' }
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount(testData);

            expect(result).toBeNull();
        });

        it('should handle response without data property', async () => {
            const testData = { email: 'test@example.com' };
            const mockResponse = {
                status: 200
                // No data property
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount(testData);

            expect(result).toBeUndefined();
        });

        it('should handle response with null data property', async () => {
            const testData = { email: 'test@example.com' };
            const mockResponse = {
                status: 200,
                data: null
            };

            global.post.mockResolvedValue(mockResponse);

            const result = await createMarketingAccount(testData);

            expect(result).toBeNull();
        });

        it('should use exact endpoint string', () => {
            const testData = { email: 'test@example.com' };
            const mockResponse = {
                status: 200,
                data: { isSuccessful: true }
            };

            global.post.mockResolvedValue(mockResponse);

            createMarketingAccount(testData);

            expect(global.post).toHaveBeenCalledWith(
                'Portal/MarketingAccount/CreateMarketingAccount',
                testData
            );
        });

        it('should maintain function signature with async/await', async () => {
            const testData = { email: 'test@example.com' };
            const mockResponse = {
                status: 200,
                data: { isSuccessful: true }
            };

            global.post.mockResolvedValue(mockResponse);

            // This should not throw any syntax errors
            const promise = createMarketingAccount(testData);
            expect(promise).toBeInstanceOf(Promise);

            const result = await promise;
            expect(result).toEqual(mockResponse.data);
        });
    });
}); 