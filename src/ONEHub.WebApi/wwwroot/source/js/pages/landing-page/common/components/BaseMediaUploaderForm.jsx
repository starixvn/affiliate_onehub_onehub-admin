import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { defaultState } from '../libs/constants';
import { regSpecialCharacters, globalResource, defaultInsertId } from '../../libs/constants';
import { htmlDecode } from '../../../../modules/htmlHelper';
import { validateFileExtension, validateFileSize } from '../../libs/utils';
import InputFile from '../../../common/components/InputFile';
import { showConfirmToast, showSuccessToast, showErrorToast } from '../../../common/components/Toast';

const regexSpecialCharacters = new RegExp(regSpecialCharacters);

export const BaseMediaUploaderForm = ({
    // Props
    moduleList,
    targetCountryList,
    allLanguagesInSystem,
    selectedMediaId,
    param,
    maximumFiles,
    maxFileSize,
    allowedExtensions,
    
    // Config
    title,
    buttonLabel,
    isModuleDisabled = false,
    defaultModuleId = '',
    showMediaNames = false,
    showPreviewImages = false,
    
    // Actions
    onGetDetail,
    onUpload,
    onUpdate,
    onFetchData,
    onSetSelectedMediaId,
    onToggleLoader,
    onSetNotification,
    isModifyInMediaUploader = false,
    
    // Validation
    validateCustomFields,
    getCustomParam,
    hasDuplicateCustomNames,
    
    // Render functions
    renderCustomFields
}) => {
    const [state, setState] = useState({
        ...defaultState,
        mediaNames: [''],
        previewImages: [''],
        marketId: '',
        moduleId: defaultModuleId,
        targetCountryCode: '',
        isMediaIdInUse: false,
        errors: {
            moduleId: false,
            targetCountryCode: false,
            marketId: false,
            file: false
        }
    });

    const modalRef = useRef();
    const messageTimeoutRef = useRef();

    // Filter languages based on selected target country
    const getFilteredLanguages = useCallback(() => {
        if (!allLanguagesInSystem || !state.targetCountryCode) {
            return [];
        }
        
        return allLanguagesInSystem.filter(language => 
            language.TargetCountryCode === state.targetCountryCode
        );
    }, [allLanguagesInSystem, state.targetCountryCode]);

    const languageList = getFilteredLanguages();

    // Extract media name from file name
    const getMediaNameFromFileName = useCallback((fileName, allowedExtensions) => {
        if (!fileName || !allowedExtensions || allowedExtensions.length === 0) {
            return fileName;
        }
        
        const cleanExtensions = allowedExtensions.map(ext => ext.replace(/^\./, ''));
        const extensionPattern = new RegExp(`\\.(${cleanExtensions.join('|')})$`, 'i');
        return fileName.replace(extensionPattern, '');
    }, []);

    useEffect(() => {
        setState(prev => ({ ...prev, isInsert: selectedMediaId === defaultInsertId }));
        if (selectedMediaId && onGetDetail) {
            handleGetDetail(selectedMediaId);
        }
    }, [selectedMediaId]);

    const handleGetDetail = useCallback(async (selectedMediaId) => {
        const assetInfo = await onGetDetail(selectedMediaId);

        if (assetInfo) {
            const mediaName = htmlDecode(assetInfo.MediaName);
            const fileName = htmlDecode(assetInfo.FileName);
            const indexOfShortFileName = fileName.lastIndexOf('/') + 1;
            const shortFileName = fileName.substring(indexOfShortFileName, fileName.length);

            setState(prev => ({
                ...prev,
                inputFileNames: [shortFileName],
                mediaNames: showMediaNames ? [mediaName] : prev.mediaNames,
                previewImages: showPreviewImages ? [shortFileName] : prev.previewImages,
                marketId: assetInfo.MarketId || prev.marketId,
                moduleId: assetInfo.ModuleId || prev.moduleId,
                targetCountryCode: assetInfo.TargetCountryCode || prev.targetCountryCode,
                isMediaIdInUse: assetInfo.IsMediaIdInUse || prev.isMediaIdInUse,
                initialFileName: shortFileName,
                isDisabled: false,
            }));
        }
    }, [onGetDetail, showMediaNames, showPreviewImages]);

    const handleChange = useCallback((event) => {
        const value = event.target.value;
        const name = event.target.name;

        setState(prev => {
            const newState = { 
                ...prev, 
                [name]: value,
                errors: {
                    ...prev.errors,
                    [name]: false
                }
            };

            // Set marketId to first available language when target country changes
            if (name === 'targetCountryCode' && value && allLanguagesInSystem) {
                const filteredLanguages = allLanguagesInSystem.filter(language => 
                    language.TargetCountryCode === value
                );
                
                if (filteredLanguages.length > 0) {
                    newState.marketId = filteredLanguages[0].LanguageCode;
                } else {
                    newState.marketId = '';
                }
                newState.errors.marketId = false;
            }

            return newState;
        });
    }, [allLanguagesInSystem]);

    const handleChangeMediaName = useCallback((event, index) => {
        const value = event.target.value;

        if (regexSpecialCharacters.test(value)) {
            showMessage(`A ${showMediaNames ? 'Form' : 'File'} Name can't contain any of the following characters: \\/:*?"<>|#%&+`, false);
        } else {
            setState(prev => {
                let mediaNames = [...prev.mediaNames];
                mediaNames[index] = value;
                return { ...prev, mediaNames };
            });
        }
    }, [showMediaNames]);

    const handleFile = useCallback((event) => {
        let { files } = event.target;

        if (files && files.length > 0) {
            let inputFileNames = [];
            let mediaNames = [];
            let previewImages = [];
            let allResults = {
                isOK: true,
                message: ''
            };

            for (let file of files) {
                let fileName = file.name;
                let mediaName = showMediaNames ? getMediaNameFromFileName(fileName, allowedExtensions) : fileName;
                inputFileNames.push(fileName);
                mediaNames.push(mediaName);
                previewImages.push(fileName);
                
                // Validate file extension
                let extensionResult = validateFileExtension(fileName, allowedExtensions);
                if (!extensionResult.isOK) {
                    allResults = extensionResult;
                    break;
                }
                
                // Validate file size
                let sizeResult = validateFileSize(file, maxFileSize);
                if (!sizeResult.isOK) {
                    allResults = sizeResult;
                    break;
                }
            }

            setState(prev => ({ 
                ...prev, 
                files: Array.from(files), 
                inputFileNames, 
                mediaNames: showMediaNames ? mediaNames : prev.inputFileNames,
                previewImages: showPreviewImages ? previewImages : prev.previewImages,
                isDisabled: !allResults.isOK,
                errors: {
                    ...prev.errors,
                    file: false
                }
            }));
            
            if (!allResults.isOK) {
                showMessage(allResults.message, false, 5000);
            }
        }
    }, [allowedExtensions, maxFileSize, getMediaNameFromFileName, showMediaNames, showPreviewImages]);

    const handleRemoveImageAt = useCallback((index) => {
        setState(prev => {
            let inputFileNames = prev.inputFileNames;
            let mediaNames = prev.mediaNames;
            let previewImages = prev.previewImages;
            let files = prev.files;
            
            if (!files || files.length == 0 || files.length < index + 1) {
                return prev;
            }

            inputFileNames = [...inputFileNames.slice(0, index), ...inputFileNames.slice(index + 1, inputFileNames.length)];
            mediaNames = [...mediaNames.slice(0, index), ...mediaNames.slice(index + 1, mediaNames.length)];
            previewImages = [...previewImages.slice(0, index), ...previewImages.slice(index + 1, previewImages.length)];
            files = [...files.slice(0, index), ...files.slice(index + 1, files.length)];
            
            if (files && files.length) {
                let allResults = {
                    isOK: true,
                    message: ''
                };

                for (let file of files) {
                    let fileName = file.name;
                    
                    let extensionResult = validateFileExtension(fileName, allowedExtensions);
                    if (!extensionResult.isOK) {
                        allResults = extensionResult;
                        break;
                    }
                    
                    let sizeResult = validateFileSize(file, maxFileSize);
                    if (!sizeResult.isOK) {
                        allResults = sizeResult;
                        break;
                    }
                }

                if (!allResults.isOK) {
                    showMessage(allResults.message, false);
                }
                return { ...prev, files, inputFileNames, mediaNames, previewImages, isDisabled: !allResults.isOK };
            } else {
                const emptyState = showMediaNames ? [''] : [''];
                return { 
                    ...prev, 
                    inputFileNames: emptyState, 
                    mediaNames: showMediaNames ? emptyState : prev.mediaNames,
                    previewImages: showPreviewImages ? emptyState : prev.previewImages,
                    files, 
                    isDisabled: true 
                };
            }
        });
    }, [allowedExtensions, maxFileSize, showMediaNames, showPreviewImages]);

    const handleClosePopup = useCallback(() => {
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        
        onSetSelectedMediaId(null);
        setState({
            ...defaultState,
            mediaNames: [''],
            previewImages: [''],
            marketId: '',
            moduleId: defaultModuleId,
            targetCountryCode: '',
            isMediaIdInUse: false,
            errors: {
                moduleId: false,
                targetCountryCode: false,
                marketId: false,
                file: false
            }
        });
    }, [onSetSelectedMediaId, defaultModuleId]);

    const showMessage = useCallback((message, isSuccess = false, duration) => {
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }

        modalRef.current && modalRef.current.scrollTo({ top: 0, behavior: "smooth" });

        setState(prev => ({
            ...prev,
            message,
            isSuccess,
            isShowMessage: true
        }));

        messageTimeoutRef.current = duration && setTimeout(() => {
            setState(prev => ({ ...prev, isShowMessage: false }));
        }, duration);
    }, [param, handleClosePopup, onFetchData]);

    const handleAfterSave = useCallback((isInsert, result) => {
        if (result) {
            const itemType = showMediaNames ? (isInsert ? "form(s)" : "form") : (isInsert ? "image(s)" : "image");
            const message = isInsert ? `Your ${itemType} has been added successfully!` : `Your ${itemType} has been updated successfully!`;

            if (result.IsSuccessful) {
                showSuccessToast(message);
                onFetchData(param);
                handleClosePopup();
            } else {
                showMessage(result.Message, false);
            }
            
        } else {
            const itemType = showMediaNames ? "form(s)" : "image(s)";
            const message = isInsert ? `Oops! Failed to add your ${itemType}!` : `Oops! Failed to update your ${itemType}!`;
            showMessage(message, false);
        }
    }, [showMessage, showMediaNames]);

    const save = useCallback(async () => {
        const { inputFileNames, isInsert, initialFileName, files } = state;
        const assetInfo = getParam();

        if (isInsert) {
            const result = await onUpload(assetInfo);
            handleAfterSave(isInsert, result);
        } else {
            const currentName = showMediaNames ? state.mediaNames[0] : inputFileNames[0];
            const originalName = showMediaNames ? state.mediaNames[0] : initialFileName;
            
            if (currentName === originalName && !!files.length) {
                const itemType = showMediaNames ? 'form' : 'file';
                showConfirmToast({
                    title: "File Already Exists",
                    content: [`This ${itemType} name exists already. Do you want to overwrite the current ${itemType}?`],
                    onConfirm: () => updateHandler(assetInfo),
                    onCancel: () => {
                        // Cancel callback - do nothing
                    }
                });
            } else {
                updateHandler(assetInfo);
            }
        }
    }, [state, onUpload, onUpdate, onSetNotification, showMediaNames]);

    const getParam = useCallback(() => {
        const { files, inputFileNames, mediaNames, isInsert, marketId, moduleId, targetCountryCode } = state;
        
        const baseParam = {
            MediaId: selectedMediaId,
            files,
            inputFileNames: isInsert ? inputFileNames.map(item => item.trim()).join('|') : inputFileNames[0] && inputFileNames[0].trim(),
            marketId,
            moduleId,
            targetCountryCode
        };

        if (showMediaNames) {
            baseParam.inputMediaNames = isInsert ? mediaNames.map(item => item.trim()).join('|') : mediaNames[0] && mediaNames[0].trim();
        }

        // Allow custom parameter extension
        return getCustomParam ? getCustomParam(baseParam, state) : baseParam;
    }, [state, selectedMediaId, showMediaNames, getCustomParam]);

    const updateHandler = useCallback(async (assetInfo) => {
        const result = await onUpdate(assetInfo);
        handleAfterSave(state.isInsert, result);
    }, [onUpdate, state.isInsert, handleAfterSave]);

    const hasDuplicateNames = useCallback((names) => {
        const length = names.length;
        for (let i = 0; i <= length - 1; i++) {
            let name = names[i].trim().toLowerCase();

            for (let j = i + 1; j < length; j++) {
                if (name == names[j].trim().toLowerCase()) {
                    return true;
                }
            }
        }
        return false;
    }, []);

    const handleSubmit = useCallback(() => {
        if (!isModifyInMediaUploader) {
            return;
        }

        onToggleLoader(true);

        const { files, isInsert, moduleId, targetCountryCode, marketId } = state;
        const names = showMediaNames ? state.mediaNames : state.inputFileNames;

        // Track validation errors
        const newErrors = {
            moduleId: !moduleId,
            targetCountryCode: !targetCountryCode,
            marketId: !marketId,
            file: isInsert && (!files || files.length === 0)
        };

        // Update state with errors
        setState(prev => ({ ...prev, errors: newErrors }));

        // Check if any validation failed
        const hasErrors = Object.values(newErrors).some(error => error);

        if (hasErrors) {
            let errorMessage = "";
            if (newErrors.moduleId) errorMessage += "Please select a module.<br />";
            if (newErrors.targetCountryCode) errorMessage += "Please select a target country.<br />";
            if (newErrors.marketId) errorMessage += "Please select a language.<br />";
            if (newErrors.file) errorMessage += "Please browse a file.<br />";
            
            showMessage(errorMessage, false);
            onToggleLoader(false);
            return;
        }

        if (names.length > maximumFiles) {
            showMessage(`Upload limit exceeded. You can only upload up to ${maximumFiles} files at a time.`, false);
            onToggleLoader(false);
            return;
        }

        const duplicateCheck = hasDuplicateCustomNames ? hasDuplicateCustomNames(names) : hasDuplicateNames(names);
        if (duplicateCheck) {
            const itemType = showMediaNames ? "form name(s)" : "file name(s)";
            showMessage(`Duplicate ${itemType} detected. Please rename or remove the ${itemType.replace('(s)', '(s)')} before uploading.`, false);
            onToggleLoader(false);
            return;
        }

        // Custom validation
        if (validateCustomFields) {
            const customValidation = validateCustomFields(state);
            if (!customValidation.isOK) {
                showMessage(customValidation.message, false);
                onToggleLoader(false);
                return;
            }
        }

        save();
        onToggleLoader(false);
    }, [state, onToggleLoader, maximumFiles, hasDuplicateNames, hasDuplicateCustomNames, validateCustomFields, save, showMessage, showMediaNames]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
        };
    }, []);

    const { mediaNames, previewImages, isShowMessage, isSuccess, message, isInsert, isDisabled, files, errors, isMediaIdInUse, inputFileNames } = state;
    const isShowPopup = selectedMediaId !== null;

    return (
        <React.Fragment>
            <Modal isOpen={isShowPopup} toggle={handleClosePopup} backdrop='static' innerRef={modalRef}>
                <ModalHeader toggle={handleClosePopup}><span className="iconpopup"></span>{title}</ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="banner-list-form-container">
                            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <Form tag="form" className="mb-3">
                                <div className='px-1 mb-3 border'>
                                    <p>[Valid Types: {allowedExtensions && allowedExtensions.join(', ')}]</p>
                                    <p className="d-block">[File Size Limit: {maxFileSize}MB]</p>
                                    <p className="d-block">[Maximum files: {maximumFiles}]</p>
                                    <span><strong>Note: </strong>
                                    {
                                        showMediaNames ? (
                                            <span>Target Country, and Language cannot be changed if the form is already used in an existing landing page.</span>
                                        ) : (
                                            <span>Module, Target Country, and Language cannot be changed if the image is already used in an existing landing page.</span>
                                        )
                                    }
                                    </span>
                                </div>
                                
                                {/* Module Selection */}
                                <FormGroup row className="mb-2">
                                    <Label sm={3} htmlFor="moduleId" className={!isModuleDisabled ? "required" : ""}>Module</Label>
                                    <Col sm={6} className='align-self-center'>
                                        <Input 
                                            type="select" 
                                            name="moduleId" 
                                            id="moduleId"
                                            disabled={isModuleDisabled || isMediaIdInUse} 
                                            value={state.moduleId} 
                                            onChange={handleChange}
                                            className={errors.moduleId ? 'border-danger' : ''}>
                                            <option value="">Please Select</option>
                                            {
                                                moduleList && moduleList.map(item => {
                                                    return (<option key={`module-${item.key}`} value={item.key}>{item.name}</option>)
                                                })
                                            }
                                        </Input>
                                    </Col>
                                </FormGroup>

                                {/* Target Country Selection */}
                                <FormGroup row className="mb-2">
                                    <Label sm={3} htmlFor="targetCountryCode" className="required pr-0">Target Country</Label>
                                    <Col sm={6} className='align-self-center'>
                                        <Input 
                                            type="select" 
                                            name="targetCountryCode" 
                                            id="targetCountryCode" 
                                            disabled={isMediaIdInUse} 
                                            value={state.targetCountryCode} 
                                            onChange={handleChange}
                                            className={errors.targetCountryCode ? 'border-danger' : ''}>
                                            <option value="">Please Select</option>
                                            {
                                                targetCountryList && targetCountryList.map(item => {
                                                    return (<option key={`country-${item.key}`} value={item.key}>{item.name}</option>)
                                                })
                                            }
                                        </Input>
                                    </Col>
                                </FormGroup>

                                {/* Language Selection */}
                                <FormGroup row className="mb-2">
                                    <Label sm={3} htmlFor="marketId" className="required">Language</Label>
                                    <Col sm={6} className='align-self-center'>
                                        <Input 
                                            type="select" 
                                            name="marketId" 
                                            id="marketId" 
                                            disabled={isMediaIdInUse || !state.targetCountryCode} 
                                            value={state.marketId} 
                                            onChange={handleChange}
                                            className={errors.marketId ? 'border-danger' : ''}>
                                            <option value="">{!state.targetCountryCode ? 'Please select target country first' : 'Please Select'}</option>
                                            {
                                                languageList && languageList.map(item => {
                                                    return (<option key={`language-${item.LanguageCode}`} value={item.LanguageCode}>{item.LanguageName}</option>)
                                                })
                                            }
                                        </Input>
                                    </Col>
                                </FormGroup>

                                {/* File Upload */}
                                <FormGroup row className="mb-2">
                                    <Label sm={3} htmlFor="file" className={isInsert ? "required" : ""}>Upload File</Label>
                                    <Col sm={9} className='align-self-center'>
                                        <InputFile id="file" 
                                            className={`input-file-group border ${errors.file ? "form-validation-warning" : isDisabled || files.length === 0 ? "text-danger" : "text-success"}`}
                                            lblText="No file chosen"
                                            btnName={globalResource.ChooseFile}
                                            isMultiple={isInsert} files={files}
                                            handleOnChangeFiles={handleFile}
                                            accept={allowedExtensions && allowedExtensions.map(ext => `image/${ext.replace('.', '')}`).join(', ')} />
                                    </Col>
                                </FormGroup>

                                {/* Custom Fields */}
                                {renderCustomFields && renderCustomFields({
                                    state,
                                    isInsert,
                                    handleChangeMediaName,
                                    handleRemoveImageAt,
                                    globalResource
                                })}
                            </Form>

                            <Button
                                type="button"
                                color="success"
                                className="mr-3"
                                disabled={
                                    !isModifyInMediaUploader ||
                                    (isInsert
                                        ? (
                                            isDisabled ||
                                            !inputFileNames ||
                                            !inputFileNames.length ||
                                            !inputFileNames[0]
                                        )
                                        : (
                                            isDisabled ||
                                            (!isMediaIdInUse && (!inputFileNames || !inputFileNames[0]))
                                        ))
                                }
                                onClick={handleSubmit}
                            >
                                {buttonLabel}
                            </Button>
                            <Button type="button" color="info" onClick={handleClosePopup}>{globalResource.Cancel}</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default BaseMediaUploaderForm;
