import * as actions from '../index';
import * as types from '../types';
import * as ajaxRequest from '../../../../../modules/ajaxRequest';

const runTestAction = ({ name, type, data }) => {
    it(`should create action to ${name}`, () => {
        const expectedAction = { type, data };

        expect(actions[name](data)).toEqual(expectedAction);
    });
}

const actionList = [
    { name: 'setMonthDate', type: types.SET_MONTHDATE, data: '07/01/2019' }
]

describe('customer statistics actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: {
                ActivePlayersByMonth: 0,
                DepositByMonth: 0,
                DepositTotal: 951.435,
                FdmByMonth: 0,
                FdmTotal: 1829,
                SignupsByMonth: 0,
                SignupsTotal: 3742,
                TotalClickByMonth: 0,
                TotalClickMobileByMonth: 0,
                TotalClickPCByMonth: 0,
                TurnoverByMonth: 0,
                TurnoverTotal: 1061706.9773,
                UniqueClickByMonth: 0,
                UniqueClickMobileByMonth: 0,
                UniqueClickPCByMonth: 0,
                GgrByMonth: 0,
                GgrTotal: -42950.0237
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            monthDate: "07/01/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerStatistics/GetCustomerStatistics', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            monthDate: "07/01/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CustomerStatistics/GetCustomerStatistics', param);

        expect(result).toEqual(null);
    })
});