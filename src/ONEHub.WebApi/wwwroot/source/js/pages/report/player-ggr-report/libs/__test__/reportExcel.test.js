import ReportExcel from '../reportExcel';
import Excel from '../../../../../modules/excel';
import { headerText, mappingColumns as fields } from '../constants';
import { bodyCellStyle, totalCellStyle } from '../../../../../modules/excelStyleConstant';

describe('player ggr report - Report Excel ', () => {
    const TITLE_ROW_INDEX = 0;
    const HEADER_ROW_INDEX = 1;
    const SUB_HEADER_ROW_INDEX = 2;
    const DATA_ROW_INDEX = 3;

    const configInfo = {
        TOTAL_STATIC_COLUMN: 6,
        INDEX_ALL_SELECT_PRODUCT_COLUMN: 4,
        INDEX_DYNAMIC_PRODUCT_COLUMN: 5,
        INDEX_TOTAL_TURNOVER_COLUMN: 4,
        INDEX_AFFILIATE_COLUMN: 0,
        INDEX_PLAYER_COLUMN: 1,
        INDEX_REGISTRATION_DATE_COLUMN: 2,
        COLSPAN_OF_ONE_PRODUCT: 2
    }

    const MAIN_SECTION_STYLE = 'mainSectionStyle';
    const TOTAL_SECTION_STYLE = 'totalSectionStyle';

    const total = {
        FdmDateText: '',
        RegistrationDateText: '',
        TotalTurnover: 100,
        TotalGgr: 100,
        ProductReportList: {
            1: {
                Turnover: 100,
                Ggr: 100
            }
        }
    };
    const dataList = [
        {
            FdmDateText: '10/28/2021 00:00:00',
            RegistrationDateText: '10/28/2021 00:00:00',
            AffName: '12BETAFF001',
            PlayerName: 'abc',
            TotalTurnover: 100,
            TotalGgr: 100,
            ProductReportList: {
                1: {
                    Turnover: 100,
                    Ggr: 100
                }
            }
        }
    ];

    const product = { key: 1, name: "Sportsbook", checked: true }
    const productList = [
        product
    ]

    const data = { MainData: dataList, Total: total };
    const title = 'Player GGR Report Excel';

    //it('constructor - should call _getcolumnConfigs', () => {
    //    const instance = new ReportExcel(data, title, productList);
    //    instance._getcolumnConfigs = jest.fn();

    //    instance.constructor(data, title, productList);

    //    expect(instance._getcolumnConfigs).toHaveBeenCalled();
    //});

    it('export - should call Excel.process', () => {
        const instance = new ReportExcel(data, title, productList);
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
        const instance = new ReportExcel(data, title, productList);
        Excel.getCellAddress = jest.fn();

        instance._createTitle();

        expect(Excel.getCellAddress).toHaveBeenCalledWith({ c: configInfo.INDEX_AFFILIATE_COLUMN, r: TITLE_ROW_INDEX });
    });

    it('_createHeader - should call _buildColspanColumn', () => {
        const instance = new ReportExcel(data, title, productList);
        instance._buildColspanColumn = jest.fn();
        Excel.getCellAddress = jest.fn();

        instance._createHeader();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(8);

        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 0, "r": HEADER_ROW_INDEX + 1 });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 1, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 1, "r": HEADER_ROW_INDEX + 1 });

        expect(instance._buildColspanColumn).toHaveBeenCalledTimes(2);
        expect(instance._buildColspanColumn.mock.calls[0][0]).toBe(HEADER_ROW_INDEX);
        expect(instance._buildColspanColumn.mock.calls[0][1]).toBe(configInfo.INDEX_TOTAL_TURNOVER_COLUMN);
        expect(instance._buildColspanColumn.mock.calls[0][2]).toBe(configInfo.COLSPAN_OF_ONE_PRODUCT);
        expect(instance._buildColspanColumn.mock.calls[0][3]).toEqual(headerText.AllSelectedProducts);

        expect(instance._buildColspanColumn.mock.calls[1][0]).toBe(HEADER_ROW_INDEX);
        expect(instance._buildColspanColumn.mock.calls[1][1]).toBe(configInfo.TOTAL_STATIC_COLUMN);
        expect(instance._buildColspanColumn.mock.calls[1][2]).toBe(configInfo.COLSPAN_OF_ONE_PRODUCT);
        expect(instance._buildColspanColumn.mock.calls[1][3]).toEqual(product.name);
    });

    it('_buildColspanColumn - should call Excel.getCellAddress with headerText not exist column', () => {
        const instance = new ReportExcel(data, title, productList);
        instance.columnConfigs.push({
            field: "abc",
            mainSectionStyle: { numFmt: '#,##0.00' },
            totalSectionStyle: { font: [Object], fill: [Object], numFmt: '#,##0.00' }
        });

        Excel.getCellAddress = jest.fn();

        instance._buildColspanColumn(HEADER_ROW_INDEX, configInfo.INDEX_TOTAL_TURNOVER_COLUMN, configInfo.COLSPAN_OF_ONE_PRODUCT, headerText.AllSelectedProducts);

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(3);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": configInfo.INDEX_TOTAL_TURNOVER_COLUMN, "r": HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": configInfo.INDEX_TOTAL_TURNOVER_COLUMN, "r": SUB_HEADER_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": configInfo.INDEX_DYNAMIC_PRODUCT_COLUMN, "r": SUB_HEADER_ROW_INDEX });
    });

    it('_createBodyData - should call _createDataRow', () => {
        const instance = new ReportExcel(data, title, productList);

        Excel.getCellAddress = jest.fn();

        instance._createBodyData();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(8);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 1, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[2][0]).toEqual({ "c": 2, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[3][0]).toEqual({ "c": 3, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[4][0]).toEqual({ "c": 4, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[5][0]).toEqual({ "c": 5, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[6][0]).toEqual({ "c": 6, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[7][0]).toEqual({ "c": 7, "r": DATA_ROW_INDEX });
    });

    it('_createTotalRow - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, productList);
        Excel.getCellAddress = jest.fn();

        instance._createTotalRow();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(7);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": configInfo.INDEX_AFFILIATE_COLUMN, "r": DATA_ROW_INDEX });
        expect(Excel.getCellAddress.mock.calls[6][0]).toEqual({ "c": configInfo.TOTAL_STATIC_COLUMN + productList.length, "r": DATA_ROW_INDEX });
    });


    it('_createTotalRow - should not call Excel.getCellAddress when total empty', () => {
        const instance = new ReportExcel({ Total: null }, title, productList);
        Excel.getCellAddress = jest.fn();

        instance._createTotalRow();

        expect(Excel.getCellAddress).not.toHaveBeenCalled();
    });

    it('_createExcelConfig - should call Excel.getCellAddress', () => {
        const instance = new ReportExcel(data, title, productList);

        Excel.getCellAddress = jest.fn();

        instance._createExcelConfig();

        expect(Excel.getCellAddress).toHaveBeenCalledTimes(2);
        expect(Excel.getCellAddress.mock.calls[0][0]).toEqual({ "c": 0, "r": 0 });
        expect(Excel.getCellAddress.mock.calls[1][0]).toEqual({ "c": 8, "r": 3 });
    });

    //it('_getcolumnConfigs - return correct', () => {
    //    const styleOfColumnTotal = {
    //        ...bodyCellStyle.decimal,
    //        font: { bold: true }
    //    }
    //    const expectResult = [{
    //        field: fields.AffName,
    //        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
    //        [TOTAL_SECTION_STYLE]: totalCellStyle.default
    //    },
    //    {
    //        field: fields.PlayerName,
    //        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
    //        [TOTAL_SECTION_STYLE]: totalCellStyle.default
    //    },
    //    {
    //        field: fields.RegistrationDateText,
    //        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
    //        [TOTAL_SECTION_STYLE]: totalCellStyle.default
    //    },
    //    {
    //        field: fields.FdmDateText,
    //        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
    //        [TOTAL_SECTION_STYLE]: totalCellStyle.default
    //    },
    //    {
    //        field: fields.TotalTurnover,
    //        [MAIN_SECTION_STYLE]: styleOfColumnTotal,
    //        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
    //    },
    //    {
    //        field: fields.TotalGgr,
    //        [MAIN_SECTION_STYLE]: styleOfColumnTotal,
    //        [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
    //    }];

    //    productList.map(item => {
    //        expectResult.push(
    //            {
    //                field: fields.Turnover,
    //                [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
    //                [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
    //            },
    //            {
    //                field: fields.Ggr,
    //                [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
    //                [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
    //            }
    //        )
    //    })

    //    const instance = new ReportExcel(data, title, productList);

    //    const result = instance._getcolumnConfigs(productList);

    //    expect(result).toEqual(expectResult);
    //});
});