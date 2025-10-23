const EXCEL_TYPE = "xlsx";
const MapExcelType = {
    "number": "n",
    "string": "s",
    "boolean": "b",
    "object": "d"
};

let _XLSX = null;
export default class Excel {
    static async process(callback) {
        try {
            _XLSX = await import( /* webpackChunkName: "xlsx-style" */ 'xlsx-style-sparta');
            
            if (_XLSX) {
                if (callback) {
                    callback();
                }
            } else {
                throw new Error('XLSX library failed to load');
            }
        } catch (error) {
            throw error;
        }
    }

    static
        export(worksheet, fileName, sheetName = 'Sheet 1') {
        const option = { bookType: EXCEL_TYPE, bookSST: false, type: 'binary' };
        const workbook = { SheetNames: [sheetName], Sheets: {}, Props: {} };
        workbook.Sheets[sheetName] = worksheet;

        var workbookOutput = _XLSX.write(workbook, option);
        this.download(workbookOutput, fileName);
    }

    static exportMultiSheet(workbookData, fileName) {
        try {
            const option = { bookType: EXCEL_TYPE, bookSST: false, type: 'binary' };
            const workbook = { 
                SheetNames: Object.keys(workbookData), 
                Sheets: {}, 
                Props: {} 
            };

            // Add each sheet to the workbook
            Object.keys(workbookData).forEach(sheetName => {
                const sheetData = workbookData[sheetName];
                workbook.Sheets[sheetName] = sheetData.worksheet;
            });

            var workbookOutput = _XLSX.write(workbook, option);
            
            this.download(workbookOutput, fileName);
        } catch (error) {
            throw error;
        }
    }

    static getCellType(value) {
        return MapExcelType[typeof value];
    }

    static getCellAddress(cellObject) {
        return _XLSX.utils.encode_cell(cellObject);
    }

    static download(workbookOut, fileName) {
        try {
            const arrayBuffer = this.sheetToArrayBuffer(workbookOut);
            const blob = new Blob([arrayBuffer], {
                type: "application/octet-stream"
            });
            
            this.downloadFromBolb(blob, fileName);
        } catch (error) {
            throw error;
        }
    }

    static downloadFromBolb(blob, fileName) {
        const fileNameDownload = `${fileName}.${EXCEL_TYPE}`;

        try {
            // IE 10+
            if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(blob, fileNameDownload);
            } else {
                const element = window.document.createElement('a');
                const objectUrl = window.URL.createObjectURL(blob);
                
                element.href = objectUrl;
                element.download = fileNameDownload;
                element.style.display = 'none'; // Hide the element
                
                document.body.appendChild(element);
                element.click();
                
                // Clean up
                document.body.removeChild(element);
                window.URL.revokeObjectURL(objectUrl);
            }
        } catch (error) {
            throw error;
        }
    }

    static sheetToArrayBuffer(s) {
        const buffer = new ArrayBuffer(s.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i <= s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buffer;
    }
}