import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Button, FormGroup, Label, Input } from 'reactstrap';

import { setSelectedMediaId, getAssetDetail, fetchData, uploadAssets, updateAsset, toggleLoader, setNotification } from '../actions/index';
import { validateInputFile } from '../../libs/utils';
import { globalResource } from '../../libs/constants';
import BaseMediaUploaderForm from '../../common/components/BaseMediaUploaderForm';

export const AssetUploaderForm = (props) => {
    const { selectedMediaId, isModifyInAssetUploader } = props;

    const handleGetAssetDetail = useCallback(async (selectedMediaId) => {
        const queryParam = { mediaId: selectedMediaId };
        return await props.getAssetDetail(queryParam);
    }, [props]);

    const validateInputFileName = useCallback((state) => {
        const { inputFileNames, isInsert, files } = state;

        let validInputFileNames = {
            isOK: true,
            message: ''
        };

        if (isInsert) {
            for (let i = 0; i < inputFileNames.length; i++) {
                let inputFileName = inputFileNames[i];

                if (inputFileName) {
                    let result = validateInputFile(inputFileName.trim(), props.allowedExtensions);

                    if (!result.isOK) {
                        result.message = `File Name ${i + 1} incorrect.<br />` + result.message;
                        validInputFileNames = result;
                        break;
                    }
                } else {
                    if (files && files.length > 0) {
                        let result = validateInputFile(files[i].name, props.allowedExtensions);

                        if (!result.isOK) {
                            validInputFileNames = result;
                            break;
                        }
                    } else {
                        validInputFileNames = {
                            isOK: false,
                            message: 'You must browse a file.'
                        };
                        break;
                    }
                }
            }
        } else {
            const inputFileName = inputFileNames[0];
            if (inputFileName) {
                let result = validateInputFile(inputFileNames[0], props.allowedExtensions);

                if (!result.isOK) {
                    validInputFileNames = result;
                }
            } else {
                if (files && files.length > 0) {
                    let result = validateInputFile(files[0].name, props.allowedExtensions);

                    if (!result.isOK) {
                        validInputFileNames = result;
                    }
                } else {
                    validInputFileNames = {
                        isOK: false,
                        message: 'You must either enter a file name for asset or browse other file.'
                    };
                }
            }
        }

        return validInputFileNames;
    }, [props.allowedExtensions]);

    const renderCustomFields = useCallback(({ state, isInsert, handleRemoveImageAt }) => {
        const { inputFileNames, files } = state;

        return (
            <>
                {
                    isInsert ? inputFileNames && inputFileNames.map((value, index) => {
                        let inputFileName = `inputFileName${index}`;

                        return (
                            <FormGroup row className="mb-2" key={`FileName${index + 1}`}>
                                <Label sm={3} htmlFor={inputFileName}>{`File Name ${index + 1}`}</Label>
                                <Col sm={7} className='align-self-center'>
                                    <Input type="text"
                                        name={inputFileName}
                                        id={inputFileName}
                                        title={value}
                                        value={value}
                                        disabled={true} />
                                </Col>
                                <div className='align-self-center'>
                                    <Button className="mr-3"
                                        type="button"
                                        color="danger"
                                        disabled={files && !files.length}
                                        onClick={() => handleRemoveImageAt(index)}>
                                        {globalResource.Remove}
                                    </Button>
                                </div>
                            </FormGroup>
                        );
                    }) : (
                        <FormGroup row className="mb-2">
                            <Label sm={3} htmlFor="inputFileName">File Name</Label>
                            <Col sm={7} className='align-self-center'>
                                <Input type="text"
                                    name="inputFileName"
                                    id="inputFileName"
                                    value={inputFileNames && inputFileNames[0]}
                                    disabled={true} />
                            </Col>
                        </FormGroup>
                    )
                }
            </>
        );
    }, []);

    const title = !selectedMediaId ? "Add New Asset" : "Edit Asset";
    const buttonLabel = !selectedMediaId ? "Add" : "Update";

    return (
        <BaseMediaUploaderForm
            {...props}
            title={title}
            buttonLabel={buttonLabel}
            isModuleDisabled={false}
            defaultModuleId=""
            showMediaNames={false}
            showPreviewImages={false}
            onGetDetail={handleGetAssetDetail}
            onUpload={props.uploadAssets}
            onUpdate={props.updateAsset}
            onFetchData={props.fetchData}
            onSetSelectedMediaId={props.setSelectedMediaId}
            onToggleLoader={props.toggleLoader}
            onSetNotification={props.setNotification}
            isModifyInMediaUploader={isModifyInAssetUploader}
            validateCustomFields={validateInputFileName}
            renderCustomFields={renderCustomFields}
        />
    );
}

function mapStateToProps({ selectedMediaId, param, moduleList, targetCountryList, allLanguagesInSystem, maximumFiles, maxFileSize, allowedExtensions, isModifyInAssetUploader }) {
    return Object.assign({}, {
        selectedMediaId, param, moduleList, targetCountryList, allLanguagesInSystem, maximumFiles, maxFileSize, allowedExtensions, isModifyInAssetUploader
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedMediaId, getAssetDetail, fetchData, uploadAssets, updateAsset, toggleLoader, setNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AssetUploaderForm));