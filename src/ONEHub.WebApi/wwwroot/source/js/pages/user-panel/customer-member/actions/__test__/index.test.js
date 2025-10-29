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
    { name: 'setParam', type: types.SET_PARAM, data: { param: 'param' } },
]

describe('customer member actions', () => {
    actionList.forEach(item => {
        runTestAction(item);
    });

    it('should create action to fetchData with correct parameter', async () => {
        const expectedResponse = {
            data: {
                MainData: [
                    {
                        Currency: "GBP",
                        Email: "",
                        FirstName: "firstname_1271808",
                        LastName: "lastname_1271808",
                        RegisteredDate: "2009-01-19T09:14:00",
                        RegisteredDateString: "01/19/2009 09:14:00 AM",
                        UserName: "joeplumber"
                    },
                    {
                        Currency: "US$",
                        Email: "",
                        FirstName: "",
                        LastName: "",
                        RegisteredDate: "2009-01-21T21:13:00",
                        RegisteredDateString: "01/21/2009 09:13:00 PM",
                        UserName: "12BET$RyQ.Piong"
                    }
                ],
                Total: null,
                TotalItem: 2
            },
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const param = {
            affId: 1271808,
            fromDate: "7/01/2019",
            isGetAll: true,
            memberType: "0",
            pageIndex: 1,
            pageSize: 20,
            toDate: "7/2/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/CustomerMember/GetCustomerMember', param);
        expect(result).toEqual(expectedResponse.data);
    })

    it('should create action to fetchData with incorrect parameter', async () => {
        ajaxRequest.post = jest.fn();
        const param = {
            affId: 123456,
            fromDate: "7/01/2019",
            isGetAll: true,
            memberType: "0",
            pageIndex: 1,
            pageSize: 20,
            toDate: "7/2/2019"
        }

        const result = await actions['fetchData'](param)();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/UserPanel/CustomerMember/GetCustomerMember', param);

        expect(result).toEqual(null);
    })
});