import { TOGGLE_LOADER } from './actionTypes';

export const toggleLoader = (data) => {
    return {
        type: TOGGLE_LOADER,
        data
    }
}