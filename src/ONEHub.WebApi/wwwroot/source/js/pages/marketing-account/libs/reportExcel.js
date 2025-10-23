import Excel from '../../../modules/excel';
import { htmlDecode } from '../../../modules/htmlHelper';
import {
    titleCellStyle,
    headerCellStyle,
    bodyCellStyle
} from '../../../modules/excelStyleConstant';
import {
    headerText
} from './constants';

const REPORT_TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 2;

const TOTAL_COLUMN = 12;

const MAIN_SECTION_STYLE = 'mainSectionStyle';

const fields = {
    Index: 'Index',
    UserName: 'UserName',
    AffCode: 'AffCode',
    FirstName: 'FirstName',
    LastName: 'LastName',
    Phone: 'Phone',
    Status: 'Status',
    TargetCountryCode: 'TargetCountryCode',
    Language: 'Language',
    CommissionGroup: 'CommissionGroup',
    RegistrationDateText: 'RegistrationDateText',
    ApprovedByText: 'ApprovedByText'
}

export default class ReportExcel {
    constructor(data, title, targetCountryList, languageList) {
        this.title = title;
        this.data = data;
        this.targetCountryList = targetCountryList;
        this.languageList = languageList;

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

    _createReportTitle() {
        this.mergeConfig.push({
            s: {
                r: REPORT_TITLE_ROW_INDEX,
                c: 0
            },
            e: {
                r: REPORT_TITLE_ROW_INDEX,
                c: TOTAL_COLUMN - 1
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
        for (let i = 0; i < TOTAL_COLUMN; i++) {
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
        }
    }

    _createBodyData() {
        const mainData = this.data.MainData;
        for (let i = 0; i < mainData.length; i++) {
            const item = mainData[i];

            for (let j = 0; j < TOTAL_COLUMN; j++) {
                const columnConfig = this.columnConfigs[j];
                const address = Excel.getCellAddress({
                    c: j,
                    r: this.currentRowIndex
                });

                this.worksheet[address] = this._buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, i);
            }

            this.currentRowIndex++;
        }
    }

    _getValue(item, columnConfig, rowIndex) {
        const fieldName = columnConfig.field;
        let value = fieldName === fields.Index ? rowIndex + 1 : item[fieldName];

        if (fieldName === fields.TargetCountryCode) {
            value = this.targetCountryList[value] || '';
        } else if (fieldName === fields.Language) {
            value = this.languageList[value] || '';
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
        this.worksheet['!cols'] = this.columnConfigs.map(config => ({
            wpx: config.width
        }));
    }

    _getcolumnConfigs() {
        return [{
            field: fields.Index,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            width: 70
        }, {
            field: fields.UserName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.AffCode,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 120
        }, {
            field: fields.FirstName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.LastName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.Phone,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.Status,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 100
        }, {
            field: fields.TargetCountryCode,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.Language,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.CommissionGroup,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 200
        }, {
            field: fields.RegistrationDateText,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }, {
            field: fields.ApprovedByText,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 150
        }]
    }
}
