import Excel from '../../../../modules/excel';
import { titleCellStyle, headerCellStyle, bodyCellStyle, totalCellStyle } from '../../../../modules/excelStyleConstant';
import { formatDateTime } from '../../../../modules/utils';
import { reportName, totalText } from './constants';

const resource = {
    reportName,
    space: ' ',
    dash: ' - '
};

const reportKey = {
    Index: 'index',
    Month: 'month',
    Affiliate: 'affiliate',
    DealName: 'dealName',
    DealType: 'dealType',
    InstantPayment: 'instantPayment',
    Quota: 'quota',
    CPAAmount: 'cpaAmount',
    EstimatedCPAAmount: 'estimatedCPAAmount',
    ApprovedCPAAmount: 'approvedCPAAmount'
};

const TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 3;

const MAIN_SECTION_STYLE = 'mainSectionStyle';
const COL_WIDTH = 'wpx';

const colConfig = {
    [reportKey.Index]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 50
    },
    [reportKey.Month]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 100
    },
    [reportKey.Affiliate]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [COL_WIDTH]: 150
    },
    [reportKey.DealName]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.left,
        [COL_WIDTH]: 200
    },
    [reportKey.DealType]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 150
    },
    [reportKey.InstantPayment]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 120
    },
    [reportKey.Quota]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.center,
        [COL_WIDTH]: 100
    },
    [reportKey.CPAAmount]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [COL_WIDTH]: 120
    },
    [reportKey.EstimatedCPAAmount]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [COL_WIDTH]: 150
    },
    [reportKey.ApprovedCPAAmount]: {
        [MAIN_SECTION_STYLE]: bodyCellStyle.decimal,
        [COL_WIDTH]: 150
    }
};

export default class ExportExcel {
    constructor(data, title, header) {
        this.worksheet = {};
        this.title = title;
        this.data = data;
        this.header = header;

        this.currentRowIndex = DATA_ROW_INDEX;
        this.mergeConfig = [];
        this.columnConfigs = this._getColumnConfigs();
        this.totalColumn = this.columnConfigs.length;
        this.lastColumnIndex = this.totalColumn - 1;
    }

    export() {
        Excel.process(() => {
            this._createTitle();
            this._createHeader();
            this._createBodyData();
            this._createTotalRow();
            this._createExcelConfig();

            const fileName = resource.reportName + resource.space + resource.dash + formatDateTime(new Date(), 'MM.dd.yyyy hh.mm.ss');
            Excel.export(this.worksheet, fileName);
        });
    }

    _createTitle() {
        this.mergeConfig.push({
            s: { r: TITLE_ROW_INDEX, c: 0 },
            e: { r: TITLE_ROW_INDEX, c: this.lastColumnIndex }
        });
        const address = Excel.getCellAddress({ c: 0, r: TITLE_ROW_INDEX });
        this.worksheet[address] = {
            t: "s",
            v: this.title,
            s: titleCellStyle
        };
    }

    _createHeader() {
        const showableCells = this.header.getCols ? this.header.getCols().filter(c => c.isShowable) : this.header;
        showableCells.forEach((cell, index) => {
            const address = Excel.getCellAddress({ c: index, r: HEADER_ROW_INDEX });
            this.worksheet[address] = {
                t: "s",
                v: cell.text || cell.title,
                s: headerCellStyle
            };
            this._mergeCell(HEADER_ROW_INDEX, index, HEADER_ROW_INDEX + 1, index);
        });
    }

    _createBodyData() {
        const mainData = Array.isArray(this.data) ? this.data : this.data.mainData;
        if (!mainData) return;

        const _buildDataRow = (item, sectionStyleName, colIndex) => {
            const columnConfig = this.columnConfigs[colIndex];
            let value = item[columnConfig.field];
            if(typeof value === 'boolean') {
                value = value ? 'Yes' : 'No';
            }

            return {
                t: Excel.getCellType(value),
                v: value,
                s: columnConfig[sectionStyleName]
            };
        }

        for (let i = 0; i < mainData.length; i++) {
            const item = mainData[i];
            item.index = i + 1;

            for (let j = 0; j < this.totalColumn; j++) {
                const address = Excel.getCellAddress({
                    c: j,
                    r: this.currentRowIndex
                });

                this.worksheet[address] = _buildDataRow(item, MAIN_SECTION_STYLE, j);
            }

            this.currentRowIndex++;
        }
    }

    _createTotalRow() {     
        const {total, totalItem} = this.data;
        if(!totalItem) return;

        const renderCell = (colIndex, value, style) => {
            const address = Excel.getCellAddress({ c: colIndex, r: this.currentRowIndex });
            this.worksheet[address] = {
                t: Excel.getCellType(value),
                v: value,
                s: {...style, ...totalCellStyle.decimal }
            };
            this._mergeCell(this.currentRowIndex, colIndex, this.currentRowIndex + 1, colIndex);
        }

        const totalCells = [
            { colIndex: 0, value: totalText, style: totalCellStyle.left }, 
            { colIndex: 3, value: "", style: totalCellStyle.right }, 
            { colIndex: 4, value: "", style: totalCellStyle.right }, 
            { colIndex: 5, value: "", style: totalCellStyle.right }, 
            { colIndex: 6, value: "", style: totalCellStyle.right }, 
            { colIndex: 7, value: total.cpaAmount, style: totalCellStyle.right }, 
            { colIndex: 8, value: total.estimatedCPAAmount, style: totalCellStyle.right }, 
            { colIndex: 9, value: total.approvedCPAAmount, style: totalCellStyle.right }
        ];
        totalCells.forEach(cell => {
            renderCell(cell.colIndex, cell.value, cell.style);
        });
        this._mergeCell(this.currentRowIndex, 0, this.currentRowIndex + 1, 2);
    }

    _createExcelConfig() {
        const cellStart = Excel.getCellAddress({ r: 0, c: 0 });
        const cellEnd = Excel.getCellAddress({ r: this.currentRowIndex, c: this.lastColumnIndex });

        this.worksheet["!merges"] = this.mergeConfig;
        this.worksheet["!ref"] = `${cellStart}:${cellEnd}`;
        this.worksheet['!cols'] = this.columnConfigs.map(item => {
            return { [COL_WIDTH]: item[COL_WIDTH] };
        });

    }

    _getColumnConfigs() {
        return this.header.map(col => {
            const key = col.field;
            return {
                field: col.field,
                [MAIN_SECTION_STYLE]: colConfig[key] ? colConfig[key][MAIN_SECTION_STYLE] : bodyCellStyle.left,
                [COL_WIDTH]: colConfig[key] ? colConfig[key][COL_WIDTH] : 120
            };
        });
    }

    _mergeCell(startRow, startCol, endRow, endCol) {
        this.mergeConfig.push({
            s: { r: startRow, c: startCol },
            e: { r: endRow, c: endCol }
        });
    }
}