import * as actions from '../index';
import * as ajaxRequest from '../../../../../modules/ajaxRequest';

describe('administrator - common actions', () => {
    it('should create action to getUserDetail with return correct data', async () => {
        const expectedResponse = {
            data: {
                UserId: 123
            },
            status: 200
        };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const selectedUserId = 123;
        const result = await actions['getUserDetail'](selectedUserId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetUserDetail', { selectedUserId });

        expect(result).toEqual(expectedResponse.data);
    })
        ;
    it('should create action to getUserDetail with return error', async () => {
        ajaxRequest.post = jest.fn();

        const selectedUserId = 123;
        const result = await actions['getUserDetail'](selectedUserId)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetUserDetail', { selectedUserId });

        expect(result).toEqual(null);
    })

    it('should create action to insertUser with insert successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            userName: 'abc'
        };

        const result = await actions['insertUser'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/InsertUser', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to insertUser with insert is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            userName: 'abc'
        };

        const result = await actions['insertUser'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/InsertUser', param);
        expect(result).toEqual(null);
    })

    it('should create action to insertExistedUser with insert successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            userName: 'abc'
        };

        const result = await actions['insertExistedUser'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/InsertExistedUser', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to insertExistedUser with insert is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            userName: 'abc'
        };

        const result = await actions['insertExistedUser'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/InsertExistedUser', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateUser with update successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            LastName: 'abc'
        };

        const result = await actions['updateUser'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/UpdateUser', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateUser with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            LastName: 'abc'
        };

        const result = await actions['updateUser'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/UpdateUser', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateAccountPolicy with update successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            GroupPolicies: '10000034,24,0;'
        };

        const result = await actions['updateAccountPolicy'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/UpdateAccountPolicy', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateAccountPolicy with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            GroupPolicies: '10000034,24,0;'
        };

        const result = await actions['updateAccountPolicy'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/UpdateAccountPolicy', param);
        expect(result).toEqual(null);
    })

    it('should create action to updateRolePolicy with update successfully', async () => {
        const expectedResponse = { data: { IsSuccessful: true, Message: '' }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            GroupPolicies: '10000034,24,0;'
        };

        const result = await actions['updateRolePolicy'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/UpdateRolePolicy', param);

        expect(result).toEqual({ IsSuccessful: true, Message: "" });
    })

    it('should create action to updateAccountPolicy with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            GroupPolicies: '10000034,24,0;'
        };

        const result = await actions['updateRolePolicy'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/UpdateRolePolicy', param);
        expect(result).toEqual(null);
    })

    it('should create action to getAccountPolicyList with update successfully', async () => {
        const expectedResponse = { data: [{ FuncId: 100000034, Policy: 1, GPolicy: 3 }], status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            GroupId: 123
        };

        const result = await actions['getAccountPolicyList'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetAccountPolicyList', param);

        expect(result).toEqual({
            data: expectedResponse.data, checkedPolicies: {
                100000034: {
                    individualPermission: {
                        HasRead: true,
                        HasHost: false
                    },
                    groupPermission: {
                        HasRead: true,
                        HasHost: true
                    }
                }
            }
        });
    })

    it('should create action to getAccountPolicyList with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            GroupId: 123
        };

        const result = await actions['getAccountPolicyList'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetAccountPolicyList', param);
        expect(result).toEqual({ data: [], checkedPolicies: {} });
    })

    it('should create action to getRolePolicy with update successfully', async () => {
        const expectedResponse = { data: [{ FuncId: 100000034, Policy: 3 }], status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            GroupId: 123
        };

        const result = await actions['getRolePolicy'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/GetRolePolicy', param);

        expect(result).toEqual({
            data: expectedResponse.data, checkedPolicies: {
                100000034: {
                    individualPermission: {},
                    groupPermission: {
                        HasRead: true,
                        HasHost: true
                    }
                }
            }
        });
    })

    it('should create action to getRolePolicy with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            GroupId: 123
        };

        const result = await actions['getRolePolicy'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Department/GetRolePolicy', param);
        expect(result).toEqual({ data: [], checkedPolicies: {} });
    })

    it('should create action to getPolicyListByAccountIds with update successfully', async () => {
        const expectedResponse = { data: [{ FuncId: 100000034, Policy: 1, GPolicy: 3 }], status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            GroupIds: '123,234'
        };

        const result = await actions['getPolicyListByAccountIds'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetPolicyListByAccountIds', param);

        expect(result).toEqual({
            data: expectedResponse.data, checkedPolicies: {
                100000034: {
                    individualPermission: {
                        HasRead: true,
                        HasHost: false
                    },
                    groupPermission: {
                        HasRead: true,
                        HasHost: true
                    }
                }
            }
        });
    })

    it('should create action to getPolicyListByAccountIds with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            GroupIds: '123,234'
        };

        const result = await actions['getPolicyListByAccountIds'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetPolicyListByAccountIds', param);
        expect(result).toEqual({ data: [], checkedPolicies: {} });
    })

    it('should create action to fetchData with delete successfully', async () => {
        const expectedResponse = { data: [{ UserId: 100000034 }], status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));
        const param = {
            userName: '',
            firstLetter: ''
        };

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetUserList', param);

        expect(result).toEqual({ data: expectedResponse.data, checkedUsers: { 100000034: false } });
    })

    it('should create action to fetchData with update is failed', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            userName: '',
            firstLetter: ''
        };

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/Administrator/GetUserList', param);
        expect(result).toEqual({ data: [], checkedUsers: {} });
    })
});