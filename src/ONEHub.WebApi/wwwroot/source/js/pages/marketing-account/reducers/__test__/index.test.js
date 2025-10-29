import * as types from '../../actions/types';
import * as reducers from '../index';

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

describe('marketing-account reducers', () => {
    describe('params reducer', () => {
        it('should handle SET_PARAM action', () => {
            const initialState = null;
            const action = {
                type: types.SET_PARAM,
                data: {
                    PageIndex: 1,
                    PageSize: 20,
                    SearchText: 'test'
                }
            };

            const result = reducers.params(initialState, action);

            expect(result).toEqual(expect.objectContaining({
                PageIndex: 1,
                PageSize: 20,
                SearchText: 'test'
            }));
        });

        it('should merge with existing state', () => {
            const initialState = {
                PageIndex: 1,
                PageSize: 10,
                SearchText: 'old'
            };
            const action = {
                type: types.SET_PARAM,
                data: {
                    SearchText: 'new',
                    Status: 'Approved'
                }
            };

            const result = reducers.params(initialState, action);

            expect(result).toEqual(expect.objectContaining({
                PageIndex: 1,
                PageSize: 10,
                SearchText: 'new',
                Status: 'Approved'
            }));
        });

        it('should return current state for unknown action', () => {
            const initialState = { PageIndex: 1 };
            const action = { type: 'UNKNOWN_ACTION', data: {} };

            const result = reducers.params(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe('isShowAddAffMktAccountPopup reducer', () => {
        it('should handle SET_IS_SHOW_ADD_AF_MKT_ACCOUNT_POPUP action with true', () => {
            const initialState = false;
            const action = {
                type: types.SET_IS_SHOW_ADD_AF_MKT_ACCOUNT_POPUP,
                data: true
            };

            const result = reducers.isShowAddAffMktAccountPopup(initialState, action);

            expect(result).toBe(true);
        });

        it('should handle SET_IS_SHOW_ADD_AF_MKT_ACCOUNT_POPUP action with false', () => {
            const initialState = true;
            const action = {
                type: types.SET_IS_SHOW_ADD_AF_MKT_ACCOUNT_POPUP,
                data: false
            };

            const result = reducers.isShowAddAffMktAccountPopup(initialState, action);

            expect(result).toBe(false);
        });

        it('should return current state for unknown action', () => {
            const initialState = true;
            const action = { type: 'UNKNOWN_ACTION', data: false };

            const result = reducers.isShowAddAffMktAccountPopup(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe('aff reducer', () => {
        const defaultAff = {
            affId: '',
            affName: ''
        };

        it('should handle SET_AFF action', () => {
            const initialState = defaultAff;
            const action = {
                type: types.SET_AFF,
                data: {
                    affId: '123',
                    affName: 'Test Affiliate'
                }
            };

            const result = reducers.aff(initialState, action);

            expect(result).toEqual({
                affId: '123',
                affName: 'Test Affiliate'
            });
        });

        it('should handle SET_AFF action with partial data', () => {
            const initialState = {
                affId: '123',
                affName: 'Test Affiliate'
            };
            const action = {
                type: types.SET_AFF,
                data: {
                    affId: '456'
                }
            };

            const result = reducers.aff(initialState, action);

            expect(result).toEqual({
                affId: '456'
            });
        });

        it('should reset to default when empty data provided', () => {
            const initialState = {
                affId: '123',
                affName: 'Test Affiliate'
            };
            const action = {
                type: types.SET_AFF,
                data: {
                    affId: '',
                    affName: ''
                }
            };

            const result = reducers.aff(initialState, action);

            expect(result).toEqual(defaultAff);
        });

        it('should return current state for unknown action', () => {
            const initialState = { affId: '123', affName: 'Test' };
            const action = { type: 'UNKNOWN_ACTION', data: {} };

            const result = reducers.aff(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe('combined reducer', () => {
        it('should return the initial state', () => {
            const state = reducers.default(undefined, {});

            expect(state).toHaveProperty('params');
            expect(state).toHaveProperty('pagingOption');
            expect(state).toHaveProperty('isShowLoader');
            expect(state).toHaveProperty('languageCodeList');
            expect(state).toHaveProperty('targetCountryCodeList');
            expect(state).toHaveProperty('canAddAffMktAccount');
            expect(state).toHaveProperty('isShowAddAffMktAccountPopup');
            expect(state).toHaveProperty('aff');
            expect(state).toHaveProperty('dealOptionsList');
        });

        it('should handle SET_PARAM action in combined reducer', () => {
            const action = {
                type: types.SET_PARAM,
                data: { PageIndex: 2 }
            };

            const state = reducers.default(undefined, action);

            expect(state.params).toEqual(expect.objectContaining({
                PageIndex: 2
            }));
        });

        it('should handle SET_AFF action in combined reducer', () => {
            const action = {
                type: types.SET_AFF,
                data: { affId: '789', affName: 'New Affiliate' }
            };

            const state = reducers.default(undefined, action);

            expect(state.aff).toEqual({
                affId: '789',
                affName: 'New Affiliate'
            });
        });

        it('should handle SET_IS_SHOW_ADD_AF_MKT_ACCOUNT_POPUP action in combined reducer', () => {
            const action = {
                type: types.SET_IS_SHOW_ADD_AF_MKT_ACCOUNT_POPUP,
                data: true
            };

            const state = reducers.default(undefined, action);

            expect(state.isShowAddAffMktAccountPopup).toBe(true);
        });
    });
}); 