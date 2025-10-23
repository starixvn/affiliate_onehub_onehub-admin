export const convertSelectedColumnList = (columnList) => {
    return columnList.reduce((result, currentValue) => {
        if (currentValue.checked) {
            result[currentValue.columnKey] = true;
        }

        return result;
    }, {});
}