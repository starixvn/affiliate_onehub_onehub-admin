import ReportExcel from '../reportExcel';
import Excel from '../../../../../modules/excel';

describe('players detail - Report Excel ', () => {
    const HEADER_ROW_INDEX = 0;
    const MAIN_SECTION_STYLE = 'mainSectionStyle';

    const item = {
        IbcUserName: "12BETUS$02002",
        UserName: "12BET$RyQ.Piong",
        RegisteredDate: "2009-01-21T21:13:00",
        Deposit: 0,
        Withdrawal: 0,
        BankingFee: 0,
        Bonus: 0,
        Turnover: 5367360,
        Ggr: -26050,
        RegisteredDateText: "01/21/2009 21:13:00"
    };

    const data = { MainData: [item] };
    const title = 'Player Detail - All Products - Nov-2019';

    it('contrustor - should call _getcolumnConfigs', () => {
        const instance = new ReportExcel(data, title, true, true);
        instance._getcolumnConfigs = jest.fn();

        instance.constructor(data, title);

        expect(instance._getcolumnConfigs).toHaveBeenCalled();
    });

    it('export - should call Excel.process', () => {
        const instance = new ReportExcel(data, title, true, true);
        instance._createHeader = jest.fn();
        instance._createBodyData = jest.fn();
        instance._createExcelConfig = jest.fn();

        Excel.process = jest.fn();
        Excel.export = jest.fn();

        instance.export();
        Excel.process.mock.calls[0][0]();

        expect(Excel.process).toHaveBeenCalled();
        expect(instance._createHeader).toHaveBeenCalled();
        expect(instance._createBodyData).toHaveBeenCalled();
        expect(instance._createExcelConfig).toHaveBeenCalled();
        expect(Excel.export).toHaveBeenCalledWith({}, title);
    });

    it('_createHeader - should Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, true, true);
        instance._buildColspanColumn = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createHeader(0);

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(12);

        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[6][0]).toEqual({ "c": 6, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[7][0]).toEqual({ "c": 7, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[8][0]).toEqual({ "c": 8, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[9][0]).toEqual({ "c": 9, "r": HEADER_ROW_INDEX });
    });

    it('_createBodyData - should call _buildDataRow, Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, true, true);

        instance._buildDataRow = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createBodyData(0);

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(12);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 1 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": 1 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": 1 });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": 1 });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": 1 });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": 1 });
        expect(Excel.getCellAddress.mock.calls[9][0]).toEqual({ "c": 9, "r": 1 });

        expect(instance._buildDataRow).toHaveBeenCalledTimes(12);
        expect(instance._buildDataRow.mock.calls[0][0]).toBe(item);
        expect(instance._buildDataRow.mock.calls[0][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[0][2]).toEqual(0);
        expect(instance._buildDataRow.mock.calls[0][3]).toBe(0);

        expect(instance._buildDataRow.mock.calls[1][0]).toBe(item);
        expect(instance._buildDataRow.mock.calls[1][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[1][2]).toEqual(0);
        expect(instance._buildDataRow.mock.calls[1][3]).toBe(1);

        expect(instance._buildDataRow.mock.calls[9][0]).toBe(item);
        expect(instance._buildDataRow.mock.calls[9][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[9][2]).toEqual(0);
        expect(instance._buildDataRow.mock.calls[9][3]).toBe(9);
    });

    it('_buildDataRow - should call Excel.getCellType with field Index', () => {
        const instance = new ReportExcel(data, title, true, true);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "Index", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 70 };
        const result = instance._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "center", vertical: "center" } }, t: undefined, v: "[object Object]1" });
    });

    it('_buildDataRow - should call Excel.getCellType with other', () => {
        const instance = new ReportExcel(data, title, true, true);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "Username", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, 1);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "left", vertical: "center" } }, t: undefined, v: "12BET$RyQ.Piong" });
    });

    it('_createExcelConfig - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, true, true);

        Excel.getCellAddress = jest.fn();

        instance._createExcelConfig(true, true, 0);

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 0 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 12, "r": 1 });
    });

    it('_createExcelConfig - should call Excel.getCellAddress with fixed amount', () => {
        const instance = new ReportExcel(data, title, false, false);

        Excel.getCellAddress = jest.fn();

        instance._createExcelConfig(false, false, 2);

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 0 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 10, "r": 1 });
    });
});