import Excel from '@/modules/excel';
import {
    titleCellStyle,
    headerCellStyle,
    bodyCellStyle,
    statusCellStyle
} from '@/modules/excelStyleConstant';
import { headerText, statusOptions } from '../constants/settings';

const REPORT_TITLE_ROW_INDEX = 0;
const HEADER_ROW_INDEX = 1;
const DATA_ROW_INDEX = 2;

const TOTAL_COLUMN = 9;

const MAIN_SECTION_STYLE = 'mainSectionStyle';

const fields = {
    Index: 'RowIdx',
    CampaignCode: 'CampaignCode',
    CampaignName: 'CampaignName',
    CampaignDescription: 'Description',
    CreatedDate: 'CreatedDateText',
    CreatedBy: 'Creator',
    LastModifiedDate: 'UpdatedDateText',
    LastModifiedBy: 'UpdatedBy',
    Status: 'Status',
    StatusId: 'StatusId',
}

export default function exportExcel(data, title) {
    // Local variables (previously instance variables)
    const worksheet = {};
    let currentRowIndex = DATA_ROW_INDEX;
    const mergeConfig = [];

    // Helper functions (previously private methods)
    const getColumnConfigs = () => {
        return [{
            field: fields.Index,
            header: headerText.Index,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            width: 70
        }, {
            field: fields.CampaignCode,
            header: headerText.CampaignCode,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            width: 150
        }, {
            field: fields.CampaignName,
            header: headerText.CampaignName,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 200
        }, {
            field: fields.CampaignDescription,
            header: headerText.CampaignDescription,
            [MAIN_SECTION_STYLE]: bodyCellStyle.left,
            width: 250
        }, {
            field: fields.CreatedDate,
            header: headerText.CreatedDate,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            width: 150
        }, {
            field: fields.CreatedBy,
            header: headerText.CreatedBy,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            width: 150
        }, {
            field: fields.LastModifiedDate,
            header: headerText.LastModifiedDate,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            width: 150
        }, {
            field: fields.LastModifiedBy,
            header: headerText.LastModifiedBy,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            width: 150
        }, {
            field: fields.Status,
            header: headerText.Status,
            [MAIN_SECTION_STYLE]: bodyCellStyle.center,
            width: 100
        }];
    };

    const columnConfigs = getColumnConfigs();

    // Helper function to get status display value and style
    const getStatusInfo = (statusValue) => {
        const statusOption = statusOptions.find(option => option.value === statusValue?.toString());
        if (statusOption) {
            return {
                label: statusOption.label,
                styleKey: statusOption.type
            };
        }
        return {
            label: statusValue || '',
            styleKey: 'default'
        };
    };

    const createReportTitle = () => {
        mergeConfig.push({
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
        worksheet[address] = {
            t: "s",
            v: title,
            s: titleCellStyle
        };
    };

    const createHeader = () => {
        let columnIndex = 0;
        for (let i = 0; i < TOTAL_COLUMN; i++) {
            const headerName = columnConfigs[i].header;

            let address = Excel.getCellAddress({
                c: columnIndex,
                r: HEADER_ROW_INDEX
            });
            worksheet[address] = {
                t: "s",
                v: headerName,
                s: headerCellStyle
            };

            columnIndex++;
        }
    };

    const getValue = (item, columnConfig, rowIndex) => {
        const fieldName = columnConfig.field;
        let value = fieldName === fields.Index ? rowIndex + 1 : item[fieldName];

        // Handle status field specially to convert to display label
        if (fieldName === fields.Status) {
            const statusInfo = getStatusInfo(value);
            return statusInfo.label;
        }

        // Handle specific field formatting if needed
        if (!value && value !== 0) {
            value = '';
        }

        return value;
    };

    const buildDataRow = (item, sectionStyleName, columnConfig, rowIndex) => {
        const value = getValue(item, columnConfig, rowIndex);
        const fieldName = columnConfig.field;

        // Apply status-specific styling for Status column
        let cellStyle = columnConfig[sectionStyleName];
        if (fieldName === fields.Status) {
            const statusInfo = getStatusInfo(item[fields.StatusId]);
            cellStyle = statusCellStyle[statusInfo.styleKey] || statusCellStyle.default;
        }

        return {
            t: Excel.getCellType(value),
            v: value,
            s: cellStyle
        };
    };

    const createBodyData = () => {
        const mainData = data.MainData;
        for (let i = 0; i < mainData.length; i++) {
            const item = mainData[i];

            let columnIndex = 0;
            for (let j = 0; j < TOTAL_COLUMN; j++) {
                const columnConfig = columnConfigs[j];

                const address = Excel.getCellAddress({
                    c: columnIndex,
                    r: currentRowIndex
                });

                worksheet[address] = buildDataRow(item, MAIN_SECTION_STYLE, columnConfig, i);
                columnIndex++;
            }

            currentRowIndex++;
        }
    };

    const createExcelConfig = () => {
        const cellStart = Excel.getCellAddress({
            r: 0,
            c: 0
        });
        const cellEnd = Excel.getCellAddress({
            r: currentRowIndex,
            c: TOTAL_COLUMN
        });

        worksheet["!merges"] = mergeConfig;
        worksheet["!ref"] = `${cellStart}:${cellEnd}`;

        // Freeze the first 2 rows (title and header)
        worksheet["!freeze"] = {
            xSplit: 0,
            ySplit: 2,
            topLeftCell: "A3",
            activePane: "bottomLeft",
            state: "frozen"
        };

        worksheet['!cols'] = columnConfigs.reduce((result, currentItem) => {
            result.push({
                wpx: currentItem.width
            });

            return result;
        }, []);
    };

    // Main execution logic (previously in export method)
    Excel.process(() => {
        createReportTitle();
        createHeader();
        createBodyData();
        createExcelConfig();

        Excel.export(worksheet, title);
    });
}