import { convertSelectedColumnList } from '../utils';

const columnList = [
    { columnKey: "Index", columnName: "#", checked: true },
    { columnKey: "Status", columnName: "Status", checked: true },
    { columnKey: "FirstName", columnName: "First Name", checked: true },
    { columnKey: "LastName", columnName: "Last Name", checked: true },
    { columnKey: "Language", columnName: "Language", checked: true },
    { columnKey: "Phone", columnName: "Mobile Phone", checked: false },
    { columnKey: "Email", columnName: "Email", checked: true },
    { columnKey: "RegistrationDateText", columnName: "Registration Date", checked: false },
    { columnKey: "ApprovalDateText", columnName: "Approval Date", checked: true },
    { columnKey: "CommissionGroup", columnName: "Commission Group", checked: false },
    { columnKey: "BalanceBf", columnName: "Balance B/F", checked: true },
    { columnKey: "Currency", columnName: "Aff. Currency", checked: false },
    { columnKey: "PlayerUserName", columnName: "Aff. Player", checked: true },
    { columnKey: "PlayerCurrency", columnName: "Aff. Player Currency", checked: false },
    { columnKey: "Member", columnName: "Member", checked: true }
]

describe('convertSelectedColumnList', () => {
    it(`should return correct data`, () => {
        const expectedData = {
            ApprovalDateText: true,
            BalanceBf: true,
            Email: true,
            FirstName: true,
            Index: true,
            Language: true,
            LastName: true,
            Member: true,
            PlayerUserName: true,
            Status: true
        };

        expect(convertSelectedColumnList(columnList)).toEqual(expectedData);
    });
});