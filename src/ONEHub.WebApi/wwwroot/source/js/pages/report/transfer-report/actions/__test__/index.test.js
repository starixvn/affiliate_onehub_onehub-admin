import * as actions from '../index'
import * as types from '../types'
import * as ajaxRequest from '../../../../../modules/ajaxRequest'

const runTestAction = (({ actionName, type, data }) => {
    it(`Should create action ${actionName}`, () => {
        const expectedAction = {
            type,
            data
        }
        expect(actions[actionName](data)).toEqual(expectedAction);
    })
})

const testCaseList = [
    { actionName: 'setReportTitle', type: types.SET_REPORT_TITLE, data: 'setReportTitle' },
    { actionName: 'setParam', type: types.SET_PARAM, data: 'setParam' },
]

describe("transfer report - actions", () => {
    testCaseList.forEach(act => {
        runTestAction(act)
    })

    it('fetchData - call api successfully', async () => {
        ajaxRequest.post = jest.fn(() => ({ status: 200, data: 'test' }))

        const result = await actions['fetchData']({})()

        expect(result).toEqual('test')
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/TransferReport/GetTransferReportData', {})
    })

    it('fetchData - call api is errored', async () => {
        ajaxRequest.post = jest.fn(() => ({ status: 500 }))

        const result = await actions['fetchData']({})()

        expect(result).toEqual(null)
        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/TransferReport/GetTransferReportData', {})
    })
})