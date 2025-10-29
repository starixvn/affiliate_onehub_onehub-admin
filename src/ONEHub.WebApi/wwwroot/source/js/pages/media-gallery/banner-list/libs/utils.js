import { maxLength } from './constants';

export const validateFileExtension = (fileName) => {
    const result = {
        isOK: false,
        message: "Sorry! We just support these file types : '.jpg', '.gif' , '.png','.jpeg'",
    }
    if (!!fileName) {
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();

        const isOK = (fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png" || fileExtension === "gif");

        if (isOK) {
            result.isOK = isOK
            result.message = '';
        }
    }

    return result;

}

export const validateInputFile = (inputFileName) => {
    const result = validateFileExtension(inputFileName);

    if (!!inputFileName && inputFileName.length > maxLength) {
        result.isOK = false;
        result.message = 'The maximum length of file name is 50. Please choose another name.';
    }

    return result;

}

export const resizeWidthHeight = (realWidth, realHeight, size = 500) => {
    let width = Number(realWidth);
    let height = Number(realHeight);

    if (width < size && height < size) {
        return { width, height }
    }

    if (width > height) {
        height = (size * height) / width;
        width = size;
    } else {
        width = (size * width) / height;
        height = size;
    }

    return { width, height }
}

export const convertCatelogyListByUserTypeToMuptileSelected = (categoryList, userType) => {
    return categoryList.filter(c => c.UserType === userType).map(item => {
        return {
            categoryName: item.CategoryName,
            key: item.CategoryName,
            name: item.CategoryName,
            checked: true
        };
    });
};