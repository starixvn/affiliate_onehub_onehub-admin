import ReportExcel from '../reportExcel';
import Excel from '../../../../modules/excel';

describe('affiliate info - Report Excel ', () => {
    const REPORT_TITLE_ROW_INDEX = 0;
    const HEADER_ROW_INDEX = 1;
    const TOTAL_COLUMNS = 18;
    const MAIN_SECTION_STYLE = 'mainSectionStyle';
    const targetCountryList = {
        MY: 'Malaysia',
        CN: 'China'
    }
    const selectedColumnList = {
        Index: true,
        Status: true,
        ParentAffName: true,
        AffCode: true,
        FirstName: true,
        LastName: true,
        Language: true,
        Phone: true,
        Email: true,
        RegistrationDateText: true,
        ApprovalDateText: true,
        CommissionGroup: true,
        BalanceBf: true,
        Currency: true,
        PlayerUserName: true,
        PlayerCurrency: true,
        Member: true
    };
    const item = {
        AffId: 927841,
        AffCode: 10001,
        UserName: "12BETAFF001",
        Status: "Approved",
        FirstName: "",
        LastName: "媒体册 获取以更新吧！",
        Language: "EN",
        TargetCountryCode: 'MY',
        Email: "walter.tran1@starixsoft.com",
        RegistrationDate: "\/Date(1211413740000)\/",
        ApprovalDate: "\/Date(1211413800000)\/",
        CasinoDate: "\/Date(1400778000000)\/",
        CommissionGroup: null,
        BalanceBf: -4439.0000,
        Member: 6,
        IsFavorite: true,
        NoOfSubAff: 2,
        ParentAffName: 'ABC',
        RegistrationDateText: "05/22/2008 06:49:00",
        ApprovalDateText: "05/22/2008 06:50:00"
    };
    const itemHasNull = {
        AffId: 927841,
        AffCode: 10001,
        UserName: "12BETAFF001",
        Status: "Approved",
        FirstName: "",
        LastName: "媒体册 获取以更新吧！",
        Language: "hi-VN",
        TargetCountryCode: 'MY',
        Email: "walter.tran1@starixsoft.com",
        RegistrationDate: "\/Date(1211413740000)\/",
        ApprovalDate: "\/Date(1211413800000)\/",
        CasinoDate: "\/Date(1400778000000)\/",
        CommissionGroup: "12BETAFF001",
        BalanceBf: null,
        Member: null,
        NoOfSubAff: null,
        ParentAffName: '',
        IsFavorite: true,
        RegistrationDateText: "05/22/2008 06:49:00",
        ApprovalDateText: "05/22/2008 06:50:00"
    };
    const dataHasNull = { MainData: [itemHasNull] };
    const data = { MainData: [item] };
    const title = 'AFFILIATE INFO Report Excel';
    const languageList = { EN: 'English' };

    it('contrustor - should call _getcolumnConfigs', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        instance._getcolumnConfigs = jest.fn();

        instance.constructor(data, title, targetCountryList, languageList);

        expect(instance._getcolumnConfigs).toHaveBeenCalled();
    });

    it('export - should call Excel.process', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        instance._createReportTitle = jest.fn();
        instance._createHeader = jest.fn();
        instance._createBodyData = jest.fn();
        instance._createExcelConfig = jest.fn();

        Excel.process = jest.fn();
        Excel.export = jest.fn();

        instance.export();
        Excel.process.mock.calls[0][0]();

        expect(Excel.process).toHaveBeenCalled();
        expect(instance._createReportTitle).toHaveBeenCalled();
        expect(instance._createHeader).toHaveBeenCalled();
        expect(instance._createBodyData).toHaveBeenCalled();
        expect(instance._createExcelConfig).toHaveBeenCalled();
        expect(Excel.export).toHaveBeenCalledWith({}, "AFFILIATE INFO Report Excel");
    });

    it('_createReportTitle - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellAddress = jest.fn();

        instance._createReportTitle();

        expect(Excel.getCellAddress).toHaveBeenCalledWith({ c: 0, r: REPORT_TITLE_ROW_INDEX });
    });

    it('_createHeader - should Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        instance._buildColspanColumn = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createHeader();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(TOTAL_COLUMNS);

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
        expect(Excel.getCellAddress.mock.calls[10][0]).toEqual({ "c": 10, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[11][0]).toEqual({ "c": 11, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[12][0]).toEqual({ "c": 12, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[13][0]).toEqual({ "c": 13, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[14][0]).toEqual({ "c": 14, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[15][0]).toEqual({ "c": 15, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[16][0]).toEqual({ "c": 16, "r": HEADER_ROW_INDEX });
    });

    it('_createHeader - not call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        instance._canBindColumn = jest.fn(() => false);
        Excel.getCellAddress = jest.fn();

        instance._createHeader();

        expect(Excel.getCellAddress).not.toHaveBeenCalled();
    });

    it('_createBodyData - should call _buildDataRow, Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);

        instance._buildDataRow = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createBodyData();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(TOTAL_COLUMNS);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 2 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": 2 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": 2 });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": 2 });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": 2 });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": 2 });
        expect(Excel.getCellAddress.mock.calls[16][0]).toEqual({ "c": 16, "r": 2 });

        expect(instance._buildDataRow).toHaveBeenCalledTimes(TOTAL_COLUMNS);
        expect(instance._buildDataRow.mock.calls[0][0]).toBe(item);
        expect(instance._buildDataRow.mock.calls[0][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[0][2]).toEqual({ field: "Index", mainSectionStyle: { alignment: { horizontal: "center", vertical: "center" } }, width: 70 });
        expect(instance._buildDataRow.mock.calls[0][3]).toBe(0);

        expect(instance._buildDataRow.mock.calls[1][0]).toBe(item);
        expect(instance._buildDataRow.mock.calls[1][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[1][2]).toEqual({ field: "ParentAffName", mainSectionStyle: { alignment: { horizontal: "left", vertical: "center" } }, width: 150 });
        expect(instance._buildDataRow.mock.calls[1][3]).toBe(0);

        expect(instance._buildDataRow.mock.calls[16][0]).toBe(item);
        expect(instance._buildDataRow.mock.calls[16][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[16][2]).toEqual({ field: "PlayerCurrency", mainSectionStyle: { alignment: { horizontal: "left", vertical: "center" } }, width: 140 });
        expect(instance._buildDataRow.mock.calls[16][3]).toBe(0);
    });

    it('_createBodyData - should call _buildDataRow, Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        instance._canBindColumn = jest.fn(() => false);
        instance._buildDataRow = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createBodyData();

        expect(Excel.getCellAddress).not.toHaveBeenCalled();

        expect(instance._buildDataRow).not.toHaveBeenCalled();
    });

    it('_buildDataRow - should call Excel.getCellType with field Index', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "Index", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 70 };
        const result = instance._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: '1' });
    });

    it('_buildDataRow - should call Excel.getCellType with field BalanceBF', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "BalanceBf", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: "-4,439.00" });
    });

    it('_buildDataRow - should call Excel.getCellType with field BalanceBF is Null', () => {
        const instance = new ReportExcel(dataHasNull, title, targetCountryList, languageList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "BalanceBf", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(itemHasNull, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: "N/A" });
    });

    it('_buildDataRow - should call Excel.getCellType with field Language', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "Language", mainSectionStyle: { alignment: { horizontal: "left", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "left", vertical: "center" } }, t: undefined, v: "English" });
    });

    it('_buildDataRow - should call Excel.getCellType with field Language incorrect', () => {
        const instance = new ReportExcel(dataHasNull, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "Language", mainSectionStyle: { alignment: { horizontal: "left", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(itemHasNull, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "left", vertical: "center" } }, t: undefined, v: "" });
    });

    it('_buildDataRow - should call Excel.getCellType with field Member', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "Member", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: "6" });
    });

    it('_buildDataRow - should call Excel.getCellType with field Member is Null', () => {
        const instance = new ReportExcel(dataHasNull, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "Member", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(itemHasNull, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: "N/A" });
    });

    it('_buildDataRow - should call Excel.getCellType with field NoOfSubAff', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "NoOfSubAff", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: "2" });
    });

    it('_buildDataRow - should call Excel.getCellType with field NoOfSubAff is Null', () => {
        const instance = new ReportExcel(dataHasNull, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "NoOfSubAff", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(itemHasNull, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: "N/A" });
    });

    it('_buildDataRow - should call Excel.getCellType with field ParentAffName', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "ParentAffName", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: "ABC" });
    });

    it('_buildDataRow - should call Excel.getCellType with field ParentAffName is Null', () => {
        const instance = new ReportExcel(dataHasNull, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "ParentAffName", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(itemHasNull, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: "N/A" });
    });

    it('_buildDataRow - should call Excel.getCellType with field CommissionGroup with Null', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);
        Excel.getCellType = jest.fn();
        const columnConfig = { field: "CommissionGroup", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, width: 200 };
        const result = instance._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, 0);

        expect(Excel.getCellType).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ s: { alignment: { horizontal: "right", vertical: "center" } }, t: undefined, v: "N/A" });
    });

    it('_createExcelConfig - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);

        Excel.getCellAddress = jest.fn();

        instance._createExcelConfig();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 0 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 21, "r": 2 });
    });

    it('_createExcelConfig - should call Excel.getCellAddress with field incorrect.', () => {
        const instance = new ReportExcel(data, title, targetCountryList, languageList, selectedColumnList);

        Excel.getCellAddress = jest.fn();
        instance._canBindColumn = jest.fn(() => false);
        instance._createExcelConfig();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 0 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 21, "r": 2 });
    });
});