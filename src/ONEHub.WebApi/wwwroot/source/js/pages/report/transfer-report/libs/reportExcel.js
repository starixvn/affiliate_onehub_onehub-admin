import Excel from '../../../../modules/excel';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle, mergedHeaderCellByColspanStyle, mergedHeaderCellByRowspanStyle } from '../../../../modules/excelStyleConstant';
import { headerText, totalText, mappingColumns as fields } from './constants';

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

const MAIN_SECTION_STYLE = 'mainSectionStyle';
const TOTAL_SECTION_STYLE = 'totalSectionStyle';

export default class ReportExcel {
    constructor(data, title) {
        this.worksheet = {};
        this.title = title;
        this.data = data;

        this.currentRowIndex = DATA_ROW_INDEX;
        this.mergeConfig = [];
        this.columnConfigs = this._getcolumnConfigs();
    }

    export() {
        Excel.process(() => {
            this._createTitle();
            this._createHeader();
            this._createBodyData();
            this._createTotalRow();
            this._createExcelConfig();

            Excel.export(this.worksheet, this.title);
        })
    }

    _createTitle() {
        this.mergeConfig.push({
            s: {
                r: TITLE_ROW_INDEX,
                c: 0
            },
            e: {
                r: TITLE_ROW_INDEX,
                c: configInfo.TOTAL_COLUMN - 1
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
        const length = configInfo.TOTAL_STATIC_COLUMN;

        for (let i = 0; i < length; i++) {
            if (i === configInfo.INDEX_AMOUNT_COLUMN) {
                this._buildColspanColumn(HEADER_ROW_INDEX, configInfo.INDEX_AMOUNT_COLUMN, configInfo.COLSPAN_OF_AMOUNT_COLUMN, headerText.Amount, subColSpanOfAmountCloumn);
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

    _buildColspanColumn(rowIndex, colIndex, colSpan, colSpanHeaderText, subColSpans) {
        this._buildMergeColumn(rowIndex, colIndex, colSpan, colSpanHeaderText)

        const totalColumn = colIndex + colSpan;

        for (let i = colIndex; i < totalColumn; i++) {
            const subColSpan = subColSpans && subColSpans[i];
            if (!!subColSpan) {
                subColSpan.isShowColumn && this._buildMergeColumn(SUB_HEADER_ROW_INDEX, subColSpan.colIndex, subColSpan.colSpan, subColSpan.colSpanHeaderText);
            } else {
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
    }

    _buildMergeColumn(rowIndex, colIndex, colSpan, colSpanHeaderText) {
        const colSpanCellAddress = Excel.getCellAddress({
            c: colIndex,
            r: rowIndex
        });
        this.worksheet[colSpanCellAddress] = {
            t: "s",
            v: colSpanHeaderText,
            s: headerCellStyle
        }

        for (let i = 1; i < colSpan; i++) {
            const nextCellAddress = Excel.getCellAddress({
                c: colIndex + i,
                r: rowIndex
            });
            this.worksheet[nextCellAddress] = {
                t: "s",
                s: mergedHeaderCellByColspanStyle
            }
        }

        this.mergeConfig.push({
            s: {
                r: rowIndex,
                c: colIndex
            },
            e: {
                r: rowIndex,
                c: (colIndex + colSpan) - 1
            }
        });
    }

    _createDataRow = (item, colIndexStart, style) => {
        const totalStaticColumn = configInfo.TOTAL_COLUMN;
        for (let j = colIndexStart; j < totalStaticColumn; j++) {
            const address = Excel.getCellAddress({
                c: j,
                r: this.currentRowIndex
            });

            this.worksheet[address] = this._buildDataColumn(item, style, j);
        }
    }

    _createBodyData() {
        const mainData = this.data.MainData;

        for (let item of mainData) {
            this._createDataRow(item, configInfo.INDEX_OF_INDEX_COLUMN, MAIN_SECTION_STYLE);
            this.currentRowIndex++;
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
                    c: configInfo.INDEX_BASE_CURRENCY - 1
                }
            });

            const addressTotal = Excel.getCellAddress({
                c: 0,
                r: this.currentRowIndex
            });
            this.worksheet[addressTotal] = {
                t: "s",
                v: totalText,
                s: totalCellStyle.center
            }

            this._createDataRow(itemTotal, configInfo.INDEX_BASE_CURRENCY, TOTAL_SECTION_STYLE);
        }
    }

    _buildDataColumn(item, sectionStyleName, colIndex) {
        const columnConfig = this.columnConfigs[colIndex];
        const fieldName = columnConfig.field;

        const value = fieldName === fields.Index ? this.currentRowIndex - 2 : item[columnConfig.field];

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
            c: configInfo.TOTAL_COLUMN
        });

        this.worksheet["!merges"] = this.mergeConfig;
        this.worksheet["!ref"] = `${cellStart}:${cellEnd}`;

        const cols = [{
            wpx: 50
        }, {
            wpx: 150
        }, {
            wpx: 200
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 150
        }, {
            wpx: 100
        }, {
            wpx: 150
        },{
            wpx: 100
        }, {
            wpx: 150
        }, {
            wpx: 150
        }];

        this.worksheet['!cols'] = cols;
    }

    _getcolumnConfigs() {
        return [
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
    }
}