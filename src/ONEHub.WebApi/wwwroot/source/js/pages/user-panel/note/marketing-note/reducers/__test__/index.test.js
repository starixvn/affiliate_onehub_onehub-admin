import * as types from '../../actions/types'
import * as reducers from '../index'

const runTestReducer = ({ name, value, action, expectedResult }) => {
    it(`should handle ${name} reducer with type ${action.type}`, () => {
        const result = reducers[name](value, action);
        expect(result).toEqual(expectedResult);
    });
}

const testCaseList = [
    { name: 'marketingNoteList', value: [], action: { type: types.SET_MARKETING_NOTE_LIST, data: [{ noteId: 123, noteContent: 'abc' }] }, expectedResult: [{ noteId: 123, noteContent: 'abc' }] },
    { name: 'isShowPopup', value: false, action: { type: types.SET_SHOW_POPUP, data: true }, expectedResult: true },
    { name: 'marketingNoteInfo', value: { noteId: 0, noteContent: '' }, action: { type: types.SET_MARKETING_NOTE_INFO, data: { noteId: 123, noteContent: 'abc' } }, expectedResult: { noteId: 123, noteContent: 'abc' } }
]

describe('marketing-note reducers', () => {
    testCaseList.forEach((item) => {
        runTestReducer(item);
    })
});