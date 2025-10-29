import Excel from '../../../../modules/excel';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, mergedHeaderCellByRowspanStyle } from '../../../../modules/excelStyleConstant';
import { headerText, totalText, reportName, defaultGgrProductReport, mappingColumns as fields, maxPageSize, EXCEL_MAX_ROWS, EXCEL_MAX_CELLS } from './constants';
import { formatDateTime } from '../../../../modules/utils';

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
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

export default class ReportExcel {
    constructor(data, title, selectedProductList) {
        if (!data || !data.MainData) {
            throw new Error('Invalid data provided to ReportExcel constructor');
        }
        if (!selectedProductList || selectedProductList.length === 0) {
            throw new Error('No products selected for Excel export');
        }
        if (!title) {
            throw new Error('Report title is required for Excel export');
        }

        this.worksheet = {};
        this.title = title;
        this.data = data;

        this.currentRowIndex = DATA_ROW_INDEX;
        this.mergeConfig = [];
        this.selectedProductList = selectedProductList;
        this.columnConfigs = this._getcolumnConfigs(selectedProductList);
        this.TotalColumn = configInfo.TOTAL_STATIC_COLUMN + (selectedProductList.length * configInfo.COLSPAN_OF_ONE_PRODUCT);
    }

    async export() {
        const dataLength = this.data.MainData.length;
        const estimatedCells = dataLength * this.TotalColumn;

        // Check if dataset is too large for a single Excel sheet
        if (dataLength > EXCEL_MAX_ROWS || estimatedCells > EXCEL_MAX_CELLS) {
            return this._exportMultipleFiles();
        } else {
            return this._exportSingleFile();
        }
    }

    async _exportSingleFile() {
        return new Promise((resolve, reject) => {
            Excel.process(() => {
                try {
                    this._generateWorksheet();

                    const fileName = reportName + ' - ' + formatDateTime(new Date(), 'MM.dd.yyyy hh.mm.ss');
                    Excel.export(this.worksheet, fileName);
                    resolve();
                } catch (error) {
                    reject(new Error(`Excel generation failed: ${error.message}`));
                }
            }).catch(error => {
                reject(new Error(`Excel library loading failed: ${error.message}`));
            });
        });
    }

    async _exportMultipleFiles() {
        const dataLength = this.data.MainData.length;

        // Use more conservative calculation to avoid array limits
        const maxRowsPerSheet = Math.min(EXCEL_MAX_ROWS, Math.floor(EXCEL_MAX_CELLS / this.TotalColumn), 10000);
        const totalSheets = Math.ceil(dataLength / maxRowsPerSheet);

        return new Promise((resolve, reject) => {
            Excel.process(() => {
                try {
                    const workbook = {};
                    
                    for (let sheetIndex = 0; sheetIndex < totalSheets; sheetIndex++) {
                        const startRow = sheetIndex * maxRowsPerSheet;
                        const endRow = Math.min(startRow + maxRowsPerSheet, dataLength);
                        const sheetData = {
                            ...this.data,
                            MainData: this.data.MainData.slice(startRow, endRow),
                            Total: sheetIndex === totalSheets - 1 ? this.data.Total : null // Only include total in last sheet
                        };
                        
                        const tempData = this.data;
                        this.data = sheetData;
                        this.worksheet = {};
                        this.currentRowIndex = DATA_ROW_INDEX;
                        this.mergeConfig = [];
                        
                        try {
                            this._generateWorksheet();
                            
                            // Add worksheet to workbook with sheet name
                            const sheetName = totalSheets > 1 ? `Sheet ${sheetIndex + 1}` : 'Sheet1';
                            workbook[sheetName] = {
                                worksheet: { ...this.worksheet },
                                mergeConfig: [...this.mergeConfig]
                            };
                            
                            // Clear worksheet to free memory
                            this.worksheet = {};
                            this.mergeConfig = [];
                            
                        } catch (sheetError) {
                            throw new Error(`Sheet ${sheetIndex + 1} generation failed: ${sheetError.message}`);
                        }
                        
                        // Restore original data for next iteration
                        this.data = tempData;
                    }
                    
                    const fileName = reportName + ' - ' + formatDateTime(new Date(), 'MM.dd.yyyy hh.mm.ss');

                    Excel.exportMultiSheet(workbook, fileName);
                    resolve();
                } catch (error) {
                    reject(new Error(`Multi-sheet Excel generation failed: ${error.message}`));
                }
            }).catch(error => {
                reject(new Error(`Excel library loading failed for multi-sheet: ${error.message}`));
            });
        });
    }



    _generateWorksheet() {
        this._createTitle();
        this._createHeader();
        
        const dataLength = this.data.MainData.length;

        if (dataLength > maxPageSize) {
            this._createBodyDataInBatches();
        } else {
            this._createBodyData();
        }
        
        this._createTotalRow();
        this._createExcelConfig();
    }

    _createTitle() {
        this.mergeConfig.push({
            s: {
                r: TITLE_ROW_INDEX,
                c: 0
            },
            e: {
                r: TITLE_ROW_INDEX,
                c: this.TotalColumn -1
            }
        });
        const address = Excel.getCellAddress({
            c: 0,
            r: TITLE_ROW_INDEX
        });
        this.worksheet[address] = {
            t: "s",
            v: this.title,
            s: titleCellStyle
        }
    }

    _createHeader() {
        const length = (configInfo.TOTAL_STATIC_COLUMN - 1) + this.selectedProductList.length;

        for (let i = 0; i < length; i++) {
            if (i === configInfo.INDEX_ALL_SELECT_PRODUCT_COLUMN) {
                this._buildColspanColumn(HEADER_ROW_INDEX, configInfo.INDEX_TOTAL_TURNOVER_COLUMN, configInfo.COLSPAN_OF_ONE_PRODUCT, headerText.AllSelectedProducts);
            } else if (i > configInfo.INDEX_ALL_SELECT_PRODUCT_COLUMN) {
                const index = i - configInfo.INDEX_DYNAMIC_PRODUCT_COLUMN;
                const productInfo = this.selectedProductList[index];
                const indexTurnoverColumnOfProduct = configInfo.TOTAL_STATIC_COLUMN + (index * configInfo.COLSPAN_OF_ONE_PRODUCT);
                this._buildColspanColumn(HEADER_ROW_INDEX, indexTurnoverColumnOfProduct, configInfo.COLSPAN_OF_ONE_PRODUCT, productInfo.name);
            } else {
                const fieldName = this.columnConfigs[i].field;
                let address = Excel.getCellAddress({
                    c: i,
                    r: HEADER_ROW_INDEX
                });
                this.worksheet[address] = {
                    t: "s",
                    v: headerText[fieldName],
                    s: headerCellStyle
                }

                let nextRowAddress = Excel.getCellAddress({
                    c: i,
                    r: HEADER_ROW_INDEX + 1
                });
                this.worksheet[nextRowAddress] = {
                    t: "s",
                    s: mergedHeaderCellByRowspanStyle
                }

                this.mergeConfig.push({
                    s: {
                        r: HEADER_ROW_INDEX,
                        c: i
                    },
                    e: {
                        r: HEADER_ROW_INDEX + 1,
                        c: i
                    }
                });
            }
        }
    }

    _buildColspanColumn(rowIndex, colIndex, colSpan, colSpanheaderText) {
        const colSpanCellAddress = Excel.getCellAddress({
            c: colIndex,
            r: rowIndex
        });
        this.worksheet[colSpanCellAddress] = {
            t: "s",
            v: colSpanheaderText,
            s: headerCellStyle
        }

        const totalColumn = colIndex + colSpan;
        this.mergeConfig.push({
            s: {
                r: rowIndex,
                c: colIndex
            },
            e: {
                r: rowIndex,
                c: totalColumn - 1
            }
        });

        for (let i = colIndex; i < totalColumn; i++) {
            const address = Excel.getCellAddress({
                c: i,
                r: rowIndex + 1
            });

            const fieldName = this.columnConfigs[i].field;
            this.worksheet[address] = {
                t: "s",
                v: headerText[fieldName],
                s: headerCellStyle
            }
        }
    }

    _createDataRow = (item, colIndexStart, style) => {
        try {
            const totalStaticColumn = configInfo.TOTAL_STATIC_COLUMN;
            
            for (let j = colIndexStart; j < totalStaticColumn; j++) {
                const address = Excel.getCellAddress({
                    c: j,
                    r: this.currentRowIndex
                });

                this.worksheet[address] = this._buildDataColumn(item, style, j);
            }

            let indexDynamicColumn = 0;
            this.selectedProductList.forEach((product, productIndex) => {
                try {
                    const productInfo = item.ProductReportList && item.ProductReportList[product.key] 
                        ? item.ProductReportList[product.key] 
                        : defaultGgrProductReport;

                    for (let j = 0; j < configInfo.COLSPAN_OF_ONE_PRODUCT; j++) {
                        const colIndex = totalStaticColumn + indexDynamicColumn;

                        const address = Excel.getCellAddress({
                            c: colIndex,
                            r: this.currentRowIndex
                        });

                        this.worksheet[address] = this._buildDataColumn(productInfo, style, colIndex);

                        indexDynamicColumn++;
                    }
                } catch (productError) {
                    throw productError;
                }
            });
        } catch (error) {
            throw error;
        }
    }

    _createBodyData() {
        const mainData = this.data.MainData;

        for (let item of mainData) {
            this._createDataRow(item, configInfo.INDEX_AFFILIATE_COLUMN, MAIN_SECTION_STYLE);
            this.currentRowIndex++;
        }
    }

    _createBodyDataInBatches() {
        const mainData = this.data.MainData;
        const totalBatches = Math.ceil(mainData.length / maxPageSize);
        
        try {
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const startIndex = batchIndex * maxPageSize;
                const endIndex = Math.min(startIndex + maxPageSize, mainData.length);
                const batch = mainData.slice(startIndex, endIndex);
                
                for (let itemIndex = 0; itemIndex < batch.length; itemIndex++) {
                    const item = batch[itemIndex];
                    try {
                        this._createDataRow(item, configInfo.INDEX_AFFILIATE_COLUMN, MAIN_SECTION_STYLE);
                        this.currentRowIndex++;
                    } catch (rowError) {
                        throw rowError;
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    }

    _createTotalRow() {
        const itemTotal = this.data.Total;
        if (itemTotal) {
            this.mergeConfig.push({
                s: {
                    r: this.currentRowIndex,
                    c: 0
                },
                e: {
                    r: this.currentRowIndex,
                    c: configInfo.INDEX_PLAYER_COLUMN
                }
            });

            const addressTotal = Excel.getCellAddress({
                c: 0,
                r: this.currentRowIndex
            });
            this.worksheet[addressTotal] = {
                t: "s",
                v: totalText,
                s: totalCellStyle.right
            }

            this._createDataRow(itemTotal, configInfo.INDEX_REGISTRATION_DATE_COLUMN, TOTAL_SECTION_STYLE);
        }
    }

    _buildDataColumn(item, sectionStyleName, colIndex) {
        const columnConfig = this.columnConfigs[colIndex];

        const value = item[columnConfig.field];

        return {
            t: Excel.getCellType(value),
            v: value,
            s: columnConfig[sectionStyleName]
        }
    }

    _createExcelConfig() {
        const cellStart = Excel.getCellAddress({
            r: 0,
            c: 0
        });
        const cellEnd = Excel.getCellAddress({
            r: this.currentRowIndex,
            c: this.TotalColumn
        });

        this.worksheet["!merges"] = this.mergeConfig;
        this.worksheet["!ref"] = `${cellStart}:${cellEnd}`;

        const cols = [{
            wpx: 125
        }, {
            wpx: 125
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 125
        }, {
            wpx: 125
        }];

        this.selectedProductList.map(item => {
            cols.push(
                {
                    wpx: 125
                }, {
                    wpx: 125
                }
            )
        })

        this.worksheet['!cols'] = cols;
    }

    _getcolumnConfigs(selectedProductList) {
        const styleOfColumnTotal = {
            ...bodyCellStyle.decimal,
            font: { bold: true }
        }
        const columnConfigList = [{
            field: fields.AffName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            [TOTAL_SECTION_STYLE]: totalCellStyle.default
        },
        {
            field: fields.PlayerName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            [TOTAL_SECTION_STYLE]: totalCellStyle.default
        },
        {
            field: fields.RegistrationDateText,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            [TOTAL_SECTION_STYLE]: totalCellStyle.default
        },
        {
            field: fields.FdmDateText,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            [TOTAL_SECTION_STYLE]: totalCellStyle.default
        },
        {
            field: fields.TotalTurnover,
            [MAIN_SECTION_STYLE]: styleOfColumnTotal,
            [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
        },
        {
            field: fields.TotalGgr,
            [MAIN_SECTION_STYLE]: styleOfColumnTotal,
            [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
        }];

        selectedProductList.map(item => {
            columnConfigList.push(
                {
                    field: fields.Turnover,
                    [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
                    [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
                },
                {
                    field: fields.Ggr,
                    [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
                    [TOTAL_SECTION_STYLE]: totalCellStyle.decimal
                }
            )
        })

        return columnConfigList;
    }
}