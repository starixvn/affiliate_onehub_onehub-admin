import * as types from '../../actions/types';
import { defaultPagingOption } from '../../../../../modules/constants';
import reducers, { 
    shouldResetScrollPosition, 
    gridData, 
    param,
    selectedDomainId 
} from '../index';

describe('specific domain control - reducers', () => {
    describe('shouldResetScrollPosition reducer', () => {
        it('should return initial state', () => {
            expect(shouldResetScrollPosition(undefined, {})).toBe(true);
        });

        it('should handle SHOULD_RESET_SCROLL_POSITION action', () => {
            const action = {
                type: types.SHOULD_RESET_SCROLL_POSITION,
                data: false
            };
            expect(shouldResetScrollPosition(true, action)).toBe(false);
        });

        it('should return current state for unknown action', () => {
            const action = { type: 'UNKNOWN_ACTION' };
            expect(shouldResetScrollPosition(true, action)).toBe(true);
        });
    });

    describe('gridData reducer', () => {
        it('should return initial state', () => {
            expect(gridData(undefined, {})).toBeNull();
        });

        it('should handle SET_GRID_DATA action', () => {
            const mockData = [{ id: 1, name: 'test' }];
            const action = {
                type: types.SET_GRID_DATA,
                data: mockData
            };
            expect(gridData(null, action)).toEqual(mockData);
        });

        it('should return current state for unknown action', () => {
            const currentState = [{ id: 1 }];
            const action = { type: 'UNKNOWN_ACTION' };
            expect(gridData(currentState, action)).toBe(currentState);
        });
    });

    describe('param reducer', () => {
        it('should return initial state', () => {
            expect(param(undefined, {})).toBeNull();
        });

        it('should handle SET_PARAM action with new data', () => {
            const prevState = { key1: 'value1' };
            const newData = { key2: 'value2' };
            const action = {
                type: types.SET_PARAM,
                data: newData
            };
            expect(param(prevState, action)).toEqual({
                key1: 'value1',
                key2: 'value2'
            });
        });

        it('should handle SET_PARAM action with null prevState', () => {
            const newData = { key: 'value' };
            const action = {
                type: types.SET_PARAM,
                data: newData
            };
            expect(param(null, action)).toEqual(newData);
        });

        it('should return current state for unknown action', () => {
            const currentState = { key: 'value' };
            const action = { type: 'UNKNOWN_ACTION' };
            expect(param(currentState, action)).toBe(currentState);
        });
    });

    describe('selectedDomainId reducer', () => {
        it('should return initial state', () => {
            expect(selectedDomainId(undefined, {})).toBeNull();
        });

        it('should handle SET_SELECTED_SPECIFIC_DOMAIN_ID action', () => {
            const action = {
                type: types.SET_SELECTED_SPECIFIC_DOMAIN_ID,
                data: 123
            };
            expect(selectedDomainId(null, action)).toBe(123);
        });

        it('should return current state for unknown action', () => {
            const currentState = 123;
            const action = { type: 'UNKNOWN_ACTION' };
            expect(selectedDomainId(currentState, action)).toBe(currentState);
        });
    });

    describe('combined reducer', () => {
        it('should combine all reducers correctly', () => {
            const state = reducers(undefined, {});
            expect(state).toEqual({
                shouldResetScrollPosition: true,
                gridData: null,
                param: null,
                pagingOption: defaultPagingOption,
                selectedDomainId: null,
                isShowLoader: false
            });
        });

        it('should handle actions for all reducers', () => {
            const initialState = {
                shouldResetScrollPosition: true,
                gridData: null,
                param: null,
                selectedDomainId: null,
                isShowLoader: false
            };

            const actions = [
                {
                    type: types.SHOULD_RESET_SCROLL_POSITION,
                    data: false
                },
                {
                    type: types.SET_GRID_DATA,
                    data: [{ id: 1 }]
                },
                {
                    type: types.SET_PARAM,
                    data: { key: 'value' }
                },
                {
                    type: types.SET_SELECTED_SPECIFIC_DOMAIN_ID,
                    data: 123
                }
            ];

            const finalState = actions.reduce(reducers, initialState);

            expect(finalState).toEqual({
                shouldResetScrollPosition: false,
                gridData: [{ id: 1 }],
                param: { key: 'value' },
                pagingOption: defaultPagingOption,
                selectedDomainId: 123,
                isShowLoader: false
            });
        });
    });
}); 