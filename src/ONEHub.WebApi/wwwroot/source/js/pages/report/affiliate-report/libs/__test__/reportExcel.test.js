import ReportExcel from '../reportExcel';
import Excel from '../../../../../modules/excel';
import { headerFake } from '../headerFake';

describe('affiliate report - Report Excel ', () => {
    const TITLE_ROW_INDEX = 0;
    const HEADER_ROW_INDEX = 1;

    const INDEX_DEPOSIT_COLUMN = 14;
    const COLSPAN_MEMBER_STATISTICS = 17;
    const TOTAL_COLSPAN = 33;
    const INDEX_COMM_COLUMN = 24;
    const COLSPAN_AFFILIATE_STATISTICS = 14;

    const MAIN_SECTION_STYLE = 'mainSectionStyle';
    const TOTAL_SECTION_STYLE = 'totalSectionStyle';

    const isMainView = true;
    const itemHaveDescription = {
        PlayerCurrency: "ABC",
        ActivePlayer: 0,
        QualifiedMember: 0,
        AffAdjustment: 0,
        AffId: 927841,
        AffWithdrawal: 0,
        BalanceBf: 165,
        DepositFee: 0,
        WithdrawalFee: 0,
        Bonus: 0,
        CommissionRate: 0,
        Deposit: 0,
        Description: "12BETAFF001",
        Earning: 0,
        Fdm: 0,
        Fdm_Amount: 0,
        MonthDate: null,
        MonthDateString: "",
        PlatformFee: 0,
        Signup: 0,
        TotalClick: 0,
        TotalFee: 0,
        Turnover: 0,
        UniqueClick: 0,
        PreferredLanguage: 'en-US',
        UserName: "12BETAFF001",
        Status: "Aprroved",
        Ggr: 0,
        Withdrawal: 0,
    };
    const itemHaveNotDescription = {
        CommGroupName: 'CommGroupName',
        ActivePlayer: 0,
        QualifiedMember: 0,
        AffAdjustment: 0,
        AffId: 968222,
        AffWithdrawal: 0,
        BalanceBf: 803935.7199,
        DepositFee: 0,
        WithdrawalFee: 0,
        Bonus: 0,
        CommissionRate: 0,
        Deposit: 0,
        Description: "",
        Earning: 0,
        Fdm: 0,
        Fdm_Amount: 0,
        MonthDate: null,
        MonthDateString: "",
        PlatformFee: 0,
        Signup: 0,
        TotalClick: 1,
        TotalFee: 0,
        Turnover: 0,
        UniqueClick: 1,
        PreferredLanguage: 'vi-VN',
        UserName: "12BETAFF002",
        Status: "Aprroved",
        Ggr: 0,
        Withdrawal: 0,
    }
    const data = { MainData: [itemHaveDescription, itemHaveNotDescription], Total: 2 };
    const title = 'Report Excel';

    it('export - should call Excel.process', () => {
        const instance = new ReportExcel(data, title, !isMainView, headerFake);
        instance._createTitle = jest.fn();
        instance._createHeader = jest.fn();
        instance._createBodyData = jest.fn();
        instance._createTotalRow = jest.fn();
        instance._createExcelConfig = jest.fn();

        Excel.process = jest.fn();
        Excel.export = jest.fn();

        instance.export();
        Excel.process.mock.calls[0][0]();

        expect(Excel.process).toHaveBeenCalled();
        expect(instance._createTitle).toHaveBeenCalled();
        expect(instance._createHeader).toHaveBeenCalled();
        expect(instance._createBodyData).toHaveBeenCalled();
        expect(instance._createTotalRow).toHaveBeenCalled();
        expect(instance._createExcelConfig).toHaveBeenCalled();
        expect(Excel.export).toHaveBeenCalled();
    });

    it('_createTitle - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, !isMainView, headerFake);
        Excel.getCellAddress = jest.fn();

        instance._createTitle();

        expect(Excel.getCellAddress).toHaveBeenCalledWith({ c: 0, r: TITLE_ROW_INDEX });
    });

    it('_createHeader - should call _buildColspanColumn with Main view', () => {
        const instance = new ReportExcel(data, title, isMainView, headerFake);
        instance._buildColspanColumn = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createHeader();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(COLSPAN_AFFILIATE_STATISTICS);

        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[6][0]).toEqual({ "c": 6, "r": HEADER_ROW_INDEX });

        expect(instance._buildColspanColumn).toHaveBeenCalledTimes(2);
        expect(instance._buildColspanColumn.mock.calls[0][0]).toBe(HEADER_ROW_INDEX);
        expect(instance._buildColspanColumn.mock.calls[0][1]).toBe(INDEX_DEPOSIT_COLUMN);

        expect(instance._buildColspanColumn.mock.calls[1][0]).toBe(HEADER_ROW_INDEX);
        expect(instance._buildColspanColumn.mock.calls[1][1]).toBe(INDEX_COMM_COLUMN);
    });

    it('_createHeader - should call _buildColspanColumn with Month on Month view', () => {
        const instance = new ReportExcel(data, title, !isMainView, headerFake);
        instance._buildColspanColumn = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createHeader();

        expect(Excel.getCellAddress).toHaveBeenCalledWith({ c: 0, r: HEADER_ROW_INDEX });

        expect(instance._buildColspanColumn).toHaveBeenCalledTimes(2);
        expect(instance._buildColspanColumn.mock.calls[0][0]).toBe(HEADER_ROW_INDEX);
        expect(instance._buildColspanColumn.mock.calls[0][1]).toBe(INDEX_DEPOSIT_COLUMN);

        expect(instance._buildColspanColumn.mock.calls[1][0]).toBe(HEADER_ROW_INDEX);
        expect(instance._buildColspanColumn.mock.calls[1][1]).toBe(INDEX_COMM_COLUMN);
    });

    it('_buildColspanColumn - should call Excel.getCellAddress with headerText not exist column', () => {
        const instance = new ReportExcel(data, title, isMainView, headerFake);
        instance.columnConfigs.push({
            field: "abc",
            mainSectionStyle: { numFmt: '#,##0.00' },
            totalSectionStyle: { font: [Object], fill: [Object], numFmt: '#,##0.00' }
        });

        Excel.getCellAddress = jest.fn();

        instance._buildColspanColumn(HEADER_ROW_INDEX, INDEX_DEPOSIT_COLUMN, headerFake);

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(COLSPAN_MEMBER_STATISTICS);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 1, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 2, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 3, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 4, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[6][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 5, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[7][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 6, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[8][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 7, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[9][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 8, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[10][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 9, "r": HEADER_ROW_INDEX + 1 });
    });

    it('_buildColspanColumn - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, isMainView, headerFake);
        Excel.getCellAddress = jest.fn();

        instance._buildColspanColumn(HEADER_ROW_INDEX, INDEX_DEPOSIT_COLUMN, headerFake);

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(COLSPAN_MEMBER_STATISTICS);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 1, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 2, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 3, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 4, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[6][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 5, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[7][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 6, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[8][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 7, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[9][0]).toEqual({ "c": INDEX_DEPOSIT_COLUMN + 8, "r": HEADER_ROW_INDEX + 1 });
    });

    it('_createBodyData - should call _buildDataRow, Excel.getCellAddress with Main view', () => {
        const instance = new ReportExcel(data, title, isMainView, headerFake);

        instance._buildDataRow = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createBodyData();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(TOTAL_COLSPAN * 2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": 3 });

        expect(instance._buildDataRow).toHaveBeenCalledTimes(TOTAL_COLSPAN * 2);
        expect(instance._buildDataRow.mock.calls[0][0]).toBe(itemHaveDescription);
        expect(instance._buildDataRow.mock.calls[0][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[0][2]).toBe(0);

        expect(instance._buildDataRow.mock.calls[1][0]).toBe(itemHaveDescription);
        expect(instance._buildDataRow.mock.calls[1][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[1][2]).toBe(1);
    });

    it('_createBodyData - should call _buildDataRow, Excel.getCellAddress with Month on Month view', () => {
        const instance = new ReportExcel(data, title, !isMainView, headerFake);

        instance._buildDataRow = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createBodyData();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(TOTAL_COLSPAN * 2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": 3 });

        expect(instance._buildDataRow).toHaveBeenCalledTimes(TOTAL_COLSPAN * 2);
        expect(instance._buildDataRow.mock.calls[0][0]).toBe(itemHaveDescription);
        expect(instance._buildDataRow.mock.calls[0][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[0][2]).toBe(0);

        expect(instance._buildDataRow.mock.calls[1][0]).toBe(itemHaveDescription);
        expect(instance._buildDataRow.mock.calls[1][1]).toBe(MAIN_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[1][2]).toBe(1);
    });

    it('_createTotalRow - should call _buildDataRow, Excel.getCellAddress with Main view', () => {
        const customTotalData = { CommGroupName: '', CommissionRate: "N/A", PaymentCurrency: '', Status: '', UserName: "Total (all pages)" };
        const instance = new ReportExcel(data, title, isMainView, headerFake);
        instance._buildDataRow = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createTotalRow();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(TOTAL_COLSPAN);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": 3 });

        expect(instance._buildDataRow).toHaveBeenCalledTimes(TOTAL_COLSPAN);
        expect(instance._buildDataRow.mock.calls[0][0]).toEqual(customTotalData);
        expect(instance._buildDataRow.mock.calls[0][1]).toBe(TOTAL_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[0][2]).toBe(0);

        expect(instance._buildDataRow.mock.calls[1][0]).toEqual(customTotalData);
        expect(instance._buildDataRow.mock.calls[1][1]).toBe(TOTAL_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[1][2]).toBe(1);
    });

    it('_createTotalRow - should call _buildDataRow, Excel.getCellAddress with Month on Month view', () => {
        const customTotalData = { CommGroupName: '', CommissionRate: "N/A", EarningBy: "N/A", MonthDateString: "Total (all pages)" };
        const instance = new ReportExcel(data, title, !isMainView, headerFake);
        instance._buildDataRow = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createTotalRow();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(TOTAL_COLSPAN);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": 3 });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": 3 });

        expect(instance._buildDataRow).toHaveBeenCalledTimes(TOTAL_COLSPAN);
        expect(instance._buildDataRow.mock.calls[0][0]).toEqual(customTotalData);
        expect(instance._buildDataRow.mock.calls[0][1]).toBe(TOTAL_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[0][2]).toBe(0);

        expect(instance._buildDataRow.mock.calls[1][0]).toEqual(customTotalData);
        expect(instance._buildDataRow.mock.calls[1][1]).toBe(TOTAL_SECTION_STYLE);
        expect(instance._buildDataRow.mock.calls[1][2]).toBe(1);
    });

    it('_buildDataRow - should call Excel.getCellType', () => {
        const instance = new ReportExcel(data, title, isMainView, headerFake);

        Excel.getCellType = jest.fn();

        const result = instance._buildDataRow(itemHaveDescription, MAIN_SECTION_STYLE, 4);

        expect(Excel.getCellType).toHaveBeenCalledWith(0);
        expect(result).toEqual({ s: { numFmt: "#,##0" }, t: undefined, v: 0 });
    });

    it('_createExcelConfig - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, isMainView, headerFake);

        Excel.getCellAddress = jest.fn();

        instance._createExcelConfig();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 0 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": TOTAL_COLSPAN, "r": 3 });
    });

    it('_getColumnConfigs - return correct', () => {
        const expectResult = [
            { field: "Status", mainSectionStyle: { alignment: { horizontal: "center", vertical: "center" } }, totalSectionStyle: { alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { bold: true } }, wpx: 120 },
            { field: "PreferredLanguage", mainSectionStyle: { alignment: { horizontal: "left", vertical: "center" } }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { bold: true } }, wpx: 120 },
            { field: "PaymentCurrency", mainSectionStyle: { alignment: { horizontal: "center", vertical: "center" } }, totalSectionStyle: { alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { bold: true } }, wpx: 120 },
            { field: "CommGroupName", mainSectionStyle: { alignment: { horizontal: "left", vertical: "center" } }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { bold: true } }, wpx: 150 },
            { field: "TotalClick", mainSectionStyle: { numFmt: "#,##0" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { bold: true }, numFmt: "#,##0" }, wpx: 120 },
            { field: "UniqueClick", mainSectionStyle: { numFmt: "#,##0" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0" }, wpx: 120 },
            { field: "Signup", mainSectionStyle: { numFmt: "#,##0" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0" }, wpx: 120 },
            { field: "Fdm", mainSectionStyle: { numFmt: "#,##0" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0" }, wpx: 120 },
            { field: "Fdm_Amount", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { bold: true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "FDM_TotalDeposit", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { bold: true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "ActivePlayer", mainSectionStyle: { numFmt: "#,##0" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0" }, wpx: 120 },
            { field: "QualifiedMember", mainSectionStyle: { numFmt: "#,##0" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0" }, wpx: 120 },
            { field: "NoOfSubAff", mainSectionStyle: { numFmt: "#,##0" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0" }, wpx: 120 },
            { field: "TotalDeposit", mainSectionStyle: { numFmt: "#,##0" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0" }, wpx: 120 },
            { field: "Deposit", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "Withdrawal", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "Turnover", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "Ggr", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "Bonus", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "Rebate", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "PlatformFee", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "DepositFee", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "WithdrawalFee", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "TotalFee", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "CommissionRate", mainSectionStyle: { "alignment": { horizontal: "right", vertical: "center" } }, totalSectionStyle: { alignment: { horizontal: "right", vertical: "center" }, fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true } }, wpx: 120 },
            { field: "Earning", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "EarningBy", mainSectionStyle: { alignment: { horizontal: "right", vertical: "center" } }, totalSectionStyle: { alignment: { horizontal: "right", vertical: "center" }, fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true } }, wpx: 120 },
            { field: "SubAffEarning", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 140 },
            { field: "TotalEarning", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "AffWithdrawal", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "AffAdjustment", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 120 },
            { field: "BalanceBf", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 150 },
            { field: "CurrentBBF", mainSectionStyle: { numFmt: "#,##0.00" }, totalSectionStyle: { fill: { fgColor: { rgb: "ffc4a8" }, patternType: "solid" }, font: { "bold": true }, numFmt: "#,##0.00" }, wpx: 150 }]
        const instance = new ReportExcel(data, title, isMainView, headerFake);

        const result = instance._getColumnConfigs(headerFake);

        expect(result).toEqual(expectResult);
    });
});