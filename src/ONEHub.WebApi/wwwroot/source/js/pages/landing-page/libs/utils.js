import { maxLength, fileUpload } from './constants';

export const validateFileExtension = (fileName, allowedExtensions = fileUpload.AllowedImageExtensions) => {
    const result = {
        isOK: false,
        message: `Invalid file type. Please upload only ${allowedExtensions.join(', ')} files.`,
    }
    
    if (!!fileName && allowedExtensions && allowedExtensions.length > 0) {
        const fileExtension = '.' + fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
        const isOK = allowedExtensions.some(ext => ext.toLowerCase() === fileExtension);

        if (isOK) {
            result.isOK = true;
            result.message = '';
        }
    }

    return result;
}

export const validateInputFile = (inputFileName, allowedExtensions = fileUpload.AllowedImageExtensions) => {
    const result = validateFileExtension(inputFileName, allowedExtensions);

    if (!!inputFileName && inputFileName.length > maxLength) {
        result.isOK = false;
        result.message = 'The maximum length of file name is 50. Please choose another name.';
    }

    return result;
}

export const validateFileSize = (file, maxSizeMB = fileUpload.MaxFileSize) => {
    const result = {
        isOK: true,
        message: ''
    };

    if (file && file.size) {
        const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
        
        if (fileSizeMB > maxSizeMB) {
            result.isOK = false;
            result.message = `File size exceeds ${maxSizeMB}MB limit. Please upload a smaller file.`;
        }
    }

    return result;
}