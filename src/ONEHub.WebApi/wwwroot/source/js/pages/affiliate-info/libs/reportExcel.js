import Excel from '../../../modules/excel';
import { htmlDecode } from '../../../modules/htmlHelper';
import {
    titleCellStyle,
    headerCellStyle,
    bodyCellStyle
} from '../../../modules/excelStyleConstant';
import {
    headerText,
    resource,
    defaultColumns
} from './constants';
import {
    format,
    formatDecimal
} from '../../../modules/numberFormat';

const REPORT_TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 2;

const TOTAL_COLUMN = 21;

const MAIN_SECTION_STYLE = 'mainSectionStyle';

const fields = {
    Index: 'Index',
    ParentAffName: 'ParentAffName',
    UserName: 'UserName',
    AffCode: 'AffCode',
    Status: 'Status',
    FirstName: 'FirstName',
    LastName: 'LastName',
    TargetCountryCode: 'TargetCountryCode',
    Language: 'Language',
    Phone: 'Phone',
    Email: 'Email',
    CommissionGroup: 'CommissionGroup',
    BalanceBf: 'BalanceBf',
    Member: 'Member',
    NoOfSubAff: 'NoOfSubAff',
    RegistrationDateText: 'RegistrationDateText',
    ApprovalDateText: 'ApprovalDateText',
    ApprovedByText: 'ApprovedByText',
    Currency: 'Currency',
    PlayerUserName: 'PlayerUserName',
    PlayerCurrency: 'PlayerCurrency',
}

export default class ReportExcel {
    constructor(data, title, targetCountryList, languageList, selectedColumnList) {
        this.title = title;
        this.data = data;
        this.targetCountryList = targetCountryList;
        this.languageList = languageList;
        this.selectedColumnList = selectedColumnList;

        this.worksheet = {};
        this.currentRowIndex = DATA_ROW_INDEX;
        this.mergeConfig = [];
        this.columnConfigs = this._getcolumnConfigs();
    }

    export() {
        Excel.process(() => {
            this._createReportTitle();
            this._createHeader();
            this._createBodyData();
            this._createExcelConfig();

            Excel.export(this.worksheet, this.title);
        })
    }

    _canBindColumn(columnKey) {
        return defaultColumns.includes(columnKey) || !!this.selectedColumnList[columnKey];
    }

    _createReportTitle() {
        this.mergeConfig.push({
            s: {
                r: REPORT_TITLE_ROW_INDEX,
                c: 0
            },
            e: {
                r: REPORT_TITLE_ROW_INDEX,
                c: Object.keys(this.selectedColumnList).length + 2
            }
        });
        const address = Excel.getCellAddress({
            c: 0,
            r: REPORT_TITLE_ROW_INDEX
        });
        this.worksheet[address] = {
            t: "s",
            v: this.title,
            s: titleCellStyle
        }
    }

    _createHeader() {
        let columnIndex = 0;
        for (let i = 0; i < TOTAL_COLUMN; i++) {
            const fieldName = this.columnConfigs[i].field;

            if (this._canBindColumn(fieldName)) {
                let address = Excel.getCellAddress({
                    c: columnIndex,
                    r: HEADER_ROW_INDEX
                });
                this.worksheet[address] = {
                    t: "s",
                    v: headerText[fieldName].label,
                    s: headerCellStyle
                }

                columnIndex++;
            }
        }
    }

    _createBodyData() {
        const mainData = this.data.MainData;
        for (let i = 0; i < mainData.length; i++) {
            const item = mainData[i];

            let columnIndex = 0;
            for (let j = 0; j < TOTAL_COLUMN; j++) {
                const columnConfig = this.columnConfigs[j];

                if (this._canBindColumn(columnConfig.field)) {
                    const address = Excel.getCellAddress({
                        c: columnIndex,
                        r: this.currentRowIndex
                    });

                    this.worksheet[address] = this._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, i);
                    columnIndex++;
                }
            }

            this.currentRowIndex++;
        }
    }

    _getValue(item, columnConfig, rowIndex) {
        const fieldName = columnConfig.field;
        let value = fieldName === fields.Index ? rowIndex + 1 : item[fieldName];

        if (fieldName === fields.BalanceBf) {
            value = value === null ? resource.NA : formatDecimal(value);
        } else if (fieldName === fields.Member || fieldName === fields.NoOfSubAff) {
            value = value === null ? resource.NA : format(value);
        } else if (fieldName === fields.TargetCountryCode) {
            value = this.targetCountryList[value] || '';
        } else if (fieldName === fields.Language) {
            value = this.languageList[value] || '';
        } else if (fieldName === fields.ParentAffName) {
            value = value || resource.NA;
        } else if (!value && fieldName === fields.CommissionGroup) {
            value = resource.NA;
        }

        return value;
    }

    _buildDataRow(item, sectionStyleName, columnConfig, rowIndex) {
        const value = this._getValue(item, columnConfig, rowIndex);

        return {
            t: Excel.getCellType(value),
            v: htmlDecode(value),
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
            c: TOTAL_COLUMN
        });

        this.worksheet["!merges"] = this.mergeConfig;
        this.worksheet["!ref"] = `${cellStart}:${cellEnd}`;
        this.worksheet['!cols'] = this.columnConfigs.reduce((result, currentItem) => {
            if (this._canBindColumn(currentItem.field)) {
                result.push({
                    wpx: currentItem.width
                });
            }

            return result;
        }, []);
    }

    _getcolumnConfigs() {
        return [{
            field: fields.Index,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            width: 70
        }, {
            field: fields.ParentAffName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.UserName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.AffCode,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.Status,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.FirstName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 170
        }, {
            field: fields.LastName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 170
        }, {
            field: fields.TargetCountryCode,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.Language,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.Phone,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.Email,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 250
        }, {
            field: fields.RegistrationDateText,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 200
        }, {
            field: fields.ApprovalDateText,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 200
        }, {
            field: fields.ApprovedByText,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 200
        }, {
            field: fields.CommissionGroup,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 250
        }, {
            field: fields.BalanceBf,
            [MAIN_SECTION_STYLE]: bodyCellStyle.right,
            width: 200
        }, {
            field: fields.Currency,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 120
        }, {
            field: fields.PlayerUserName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 200
        }, {
            field: fields.PlayerCurrency,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 140
        }, {
            field: fields.Member,
            [MAIN_SECTION_STYLE]: bodyCellStyle.right,
            width: 150
        }, {
            field: fields.NoOfSubAff,
            [MAIN_SECTION_STYLE]: bodyCellStyle.right,
            width: 150
        }]
    }
}