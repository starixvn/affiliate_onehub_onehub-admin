import ReportExcel from '../reportExcel';
import Excel from '../../../../../modules/excel';
import { headerText, mappingColumns as fields } from '../constants';
import { bodyCellStyle, totalCellStyle } from '../../../../../modules/excelStyleConstant';

describe('transfer report - Report Excel ', () => {
    const TITLE_ROW_INDEX = 0;
    const HEADER_ROW_INDEX = 1;
    const SUB_HEADER_ROW_INDEX = 2;
    const DATA_ROW_INDEX = 3;

    const configInfo = {
        TOTAL_COLUMN: 12,
        TOTAL_STATIC_COLUMN: 8,
        INDEX_AMOUNT_COLUMN: 7,
        COLSPAN_OF_AMOUNT_COLUMN: 5,
        INDEX_IN_AFF_PLAYER_CURRENCY: 7,
        INDEX_IN_PLAYER_CURRENCY: 9,
        COLSPAN_OF_IN_PLAYER_CURRENCY: 2,
        COLSPAN_OF_IN_AFF_PLAYER_CURRENCY: 2,
        INDEX_BASE_CURRENCY: 11,
        INDEX_OF_INDEX_COLUMN: 0,
    }

    const MAIN_SECTION_STYLE = 'mainSectionStyle';
    const TOTAL_SECTION_STYLE = 'totalSectionStyle';

    const total = { BasedAmount: 123 };
    const dataList = [
        {
            TransId: 123,
            CreatedDateText: '10/28/2021 00:00:00',
            AffName: '12BETAFF001',
            AffPlayerName: 'test',
            PlayerName: 'abc',
            AffPlayerCurrency: 'USD',
            AffPlayerAmount: 100,
            Amount: 100,
            BasedAmount: 100
        }
    ];

    const subColSpanOfAmountCloumn = {
        [configInfo.INDEX_IN_AFF_PLAYER_CURRENCY]: {
            isShowColumn: true,
            colIndex: configInfo.INDEX_IN_AFF_PLAYER_CURRENCY,
            colSpan: configInfo.COLSPAN_OF_IN_AFF_PLAYER_CURRENCY,
            colSpanHeaderText: headerText.InAffPlayerCurrency
        },
        [configInfo.INDEX_IN_AFF_PLAYER_CURRENCY + 1]: {
            isShowColumn: false
        },
        [configInfo.INDEX_IN_PLAYER_CURRENCY]: {
            isShowColumn: true,
            colIndex: configInfo.INDEX_IN_PLAYER_CURRENCY,
            colSpan: configInfo.COLSPAN_OF_IN_PLAYER_CURRENCY,
            colSpanHeaderText: headerText.InPlayerCurrency
        },
        [configInfo.INDEX_IN_PLAYER_CURRENCY + 1]: {
            isShowColumn: false
        },
    }

    const data = { MainData: dataList, Total: total };
    const title = 'Transfer Report Excel';

    it('constructor - should call _getcolumnConfigs', () => {
        const instance = new ReportExcel(data, title);
        instance._getcolumnConfigs = jest.fn();

        instance.constructor(data, title);

        expect(instance._getcolumnConfigs).toHaveBeenCalled();
    });

    it('export - should call Excel.process', () => {
        const instance = new ReportExcel(data, title);
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
        const instance = new ReportExcel(data, title);
        Excel.getCellAddress = jest.fn();

        instance._createTitle();

        expect(Excel.getCellAddress).toHaveBeenCalledWith({ c: 0, r: TITLE_ROW_INDEX });
    });

    it('_createHeader - should call _buildColspanColumn', () => {
        const instance = new ReportExcel(data, title);
        instance._buildColspanColumn = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createHeader();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(14);

        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 0, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 1, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 1, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 2, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 2, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[6][0]).toEqual({ "c": 3, "r": HEADER_ROW_INDEX });

        expect(instance._buildColspanColumn).toHaveBeenCalledTimes(1);
        expect(instance._buildColspanColumn.mock.calls[0][0]).toBe(HEADER_ROW_INDEX);
        expect(instance._buildColspanColumn.mock.calls[0][1]).toBe(configInfo.INDEX_AMOUNT_COLUMN);
        expect(instance._buildColspanColumn.mock.calls[0][2]).toBe(configInfo.COLSPAN_OF_AMOUNT_COLUMN);
        expect(instance._buildColspanColumn.mock.calls[0][3]).toEqual(headerText.Amount);
        expect(instance._buildColspanColumn.mock.calls[0][4]).toEqual(subColSpanOfAmountCloumn);
    });

    it('_buildColspanColumn - should call Excel.getCellAddress with headerText not exist column', () => {
        const instance = new ReportExcel(data, title);
        instance.columnConfigs.push({
            field: "abc",
            mainSectionStyle: { numFmt: '#,##0.00' },
            totalSectionStyle: { font: [Object], fill: [Object], numFmt: '#,##0.00' }
        });

        Excel.getCellAddress = jest.fn();

        instance._buildColspanColumn(HEADER_ROW_INDEX, configInfo.INDEX_AMOUNT_COLUMN, configInfo.COLSPAN_OF_AMOUNT_COLUMN, headerText.Amount, subColSpanOfAmountCloumn);

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(10);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": configInfo.INDEX_IN_AFF_PLAYER_CURRENCY, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": configInfo.INDEX_IN_AFF_PLAYER_CURRENCY + 1, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": configInfo.INDEX_IN_PLAYER_CURRENCY, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": configInfo.INDEX_IN_PLAYER_CURRENCY + 1, "r": HEADER_ROW_INDEX });
    });

    it('_createBodyData - should call _createDataRow', () => {
        const instance = new ReportExcel(data, title);

        Excel.getCellAddress = jest.fn();

        instance._createBodyData();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(configInfo.TOTAL_COLUMN);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[6][0]).toEqual({ "c": 6, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[7][0]).toEqual({ "c": 7, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[8][0]).toEqual({ "c": 8, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[9][0]).toEqual({ "c": 9, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[10][0]).toEqual({ "c": 10, "r": DATA_ROW_INDEX });
    });

    it('_createTotalRow - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title);
        Excel.getCellAddress = jest.fn();

        instance._createTotalRow();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": configInfo.INDEX_OF_INDEX_COLUMN, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": configInfo.INDEX_BASE_CURRENCY, "r": DATA_ROW_INDEX });
    });


    it('_createTotalRow - should not call Excel.getCellAddress when total empty', () => {
        const instance = new ReportExcel({ Total: null }, title);
        Excel.getCellAddress = jest.fn();

        instance._createTotalRow();

        expect(Excel.getCellAddress).not.toHaveBeenCalled();
    });

    it('_createExcelConfig - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title);

        Excel.getCellAddress = jest.fn();

        instance._createExcelConfig();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 0 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 12, "r": 3 });
    });

    it('_getcolumnConfigs - return correct', () => {
        const expectResult = [
            {
                field: fields.Index,
                [MAIN_SECTION_STYLE]: bodyCellStyle.center,
                [TOTAL_SECTION_STYLE]: totalCellStyle.default
            }, {
                field: fields.TransId,
                [MAIN_SECTION_STYLE]: bodyCellStyle.center,
                [TOTAL_SECTION_STYLE]: totalCellStyle.default
            },
            {
                field: fields.Date,
                [MAIN_SECTION_STYLE]: bodyCellStyle.left,
                [TOTAL_SECTION_STYLE]: totalCellStyle.default
            },
            {
                field: fields.Status,
                [MAIN_SECTION_STYLE]: bodyCellStyle.left,
                [TOTAL_SECTION_STYLE]: totalCellStyle.default
            },
            {
                field: fields.Affiliate,
                [MAIN_SECTION_STYLE]: bodyCellStyle.left,
                [TOTAL_SECTION_STYLE]: totalCellStyle.default
            },
            {
                field: fields.AffiliatePlayer,
                [MAIN_SECTION_STYLE]: bodyCellStyle.left,
                [TOTAL_SECTION_STYLE]: totalCellStyle.default
            },
            {
                field: fields.Player,
                [MAIN_SECTION_STYLE]: bodyCellStyle.left,
                [TOTAL_SECTION_STYLE]: totalCellStyle.default
            },
            {
                field: fields.AffPlayerCurrency,
                [MAIN_SECTION_STYLE]: bodyCellStyle.center,
                [TOTAL_SECTION_STYLE]: totalCellStyle.default
            },
            {
                field: fields.AffPlayerAmount,
                [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
                [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
            },
            {
                field: fields.PlayerCurrency,
                [MAIN_SECTION_STYLE]: bodyCellStyle.center,
                [TOTAL_SECTION_STYLE]: totalCellStyle.default
            },
            {
                field: fields.Amount,
                [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
                [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
            },
            {
                field: fields.BasedAmount,
                [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
                [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
            }];

        const instance = new ReportExcel(data, title);

        const result = instance._getcolumnConfigs();

        expect(result).toEqual(expectResult);
    });
});