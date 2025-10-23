import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Button, FormGroup, Label, Input } from 'reactstrap';

import { setSelectedMediaId, getFormDetail, fetchData, uploadForms, updateForm, toggleLoader, setNotification } from '../actions/index';
import { defaultModuleIds } from '../../libs/constants';
import { regSpecialCharacters, globalResource } from '../../libs/constants';
import BaseMediaUploaderForm from '../../common/components/BaseMediaUploaderForm';

const regexSpecialCharacters = new RegExp(regSpecialCharacters);

export const RegistrationForm = (props) => {
    const { selectedMediaId, isModifyInFormUploader } = props;

    const handleGetFormDetail = useCallback(async (selectedMediaId) => {
        return await props.getFormDetail(selectedMediaId);
    }, [props]);

    const validateMediaNames = useCallback((state) => {
        const { mediaNames, isInsert, files } = state;

        let validMediaNames = {
            isOK: true,
            message: ''
        };

        if (isInsert) {
            for (let i = 0; i < mediaNames.length; i++) {
                let mediaName = mediaNames[i];

                if (!mediaName || mediaName.trim() === '') {
                    validMediaNames = {
                        isOK: false,
                        message: `Form Name ${i + 1} is required.`
                    };
                    break;
                } else if (regexSpecialCharacters.test(mediaName.trim())) {
                    validMediaNames = {
                        isOK: false,
                        message: `Form Name ${i + 1} contains invalid characters.`
                    };
                    break;
                }
            }
        } else {
            const mediaName = mediaNames[0];
            if (!mediaName || mediaName.trim() === '') {
                if (files && files.length > 0) {
                    // Use the original file name if no form name provided
                } else {
                    validMediaNames = {
                        isOK: false,
                        message: 'You must either enter a form name or browse a file.'
                    };
                }
            } else if (regexSpecialCharacters.test(mediaName.trim())) {
                validMediaNames = {
                    isOK: false,
                    message: 'Form Name contains invalid characters.'
                };
            }
        }

        return validMediaNames;
    }, []);

    const renderCustomFields = useCallback(({ state, isInsert, handleChangeMediaName, handleRemoveImageAt }) => {
        const { mediaNames, previewImages, files } = state;

        return (
            <>
                {
                    isInsert ? mediaNames && mediaNames.map((value, index) => {
                        let mediaNameId = `mediaName${index}`;
                        let previewImageId = `previewImage${index}`;

                        return (
                            <React.Fragment key={`FormSection${index + 1}`}>
                                <FormGroup row className="mb-2">
                                    <Label sm={3} htmlFor={mediaNameId}>{`Form Name ${index + 1}`}</Label>
                                    <Col sm={7} className='align-self-center'>
                                        <Input type="text"
                                            name={mediaNameId}
                                            id={mediaNameId}
                                            title={value}
                                            value={value} 
                                            onChange={(e) => handleChangeMediaName(e, index)} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="mb-2">
                                    <Label sm={3} className='pr-0' htmlFor={previewImageId}>{`Preview Image ${index + 1}`}</Label>
                                    <Col sm={7} className='align-self-center'>
                                        <Input type="text"
                                            name={previewImageId}
                                            id={previewImageId}
                                            value={previewImages[index] || ''}
                                            disabled={true}/>
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
                            </React.Fragment>
                        )
                    }) : (
                        <React.Fragment>
                            <FormGroup row className="mb-2">
                                <Label sm={3} htmlFor="mediaName">Form Name</Label>
                                <Col sm={7} className='align-self-center'>
                                    <Input type="text"
                                        name="mediaName"
                                        id="mediaName"
                                        value={mediaNames && mediaNames[0]}
                                        onChange={(e) => handleChangeMediaName(e, 0)} />
                                </Col>
                            </FormGroup>
                            <FormGroup row className="mb-2">
                                <Label sm={3} htmlFor="previewImage">Preview Image</Label>
                                <Col sm={7} className='align-self-center'>
                                    <Input type="text"
                                        name="previewImage"
                                        id="previewImage"
                                        value={previewImages && previewImages[0]}
                                        disabled={true} />
                                </Col>
                            </FormGroup>
                        </React.Fragment>
                    )
                }
            </>
        );
    }, []);

    const title = !selectedMediaId ? "Registration Form" : "Update Registration Form";
    const buttonLabel = !selectedMediaId ? "Add" : "Update";

    return (
        <BaseMediaUploaderForm
            {...props}
            title={title}
            buttonLabel={buttonLabel}
            isModuleDisabled={true}
            defaultModuleId={defaultModuleIds.RegistrationForm}
            showMediaNames={true}
            showPreviewImages={true}
            onGetDetail={handleGetFormDetail}
            onUpload={props.uploadForms}
            onUpdate={props.updateForm}
            onFetchData={props.fetchData}
            onSetSelectedMediaId={props.setSelectedMediaId}
            onToggleLoader={props.toggleLoader}
            onSetNotification={props.setNotification}
            isModifyInMediaUploader={isModifyInFormUploader}
            validateCustomFields={validateMediaNames}
            renderCustomFields={renderCustomFields}
        />
    );
}

function mapStateToProps({ selectedMediaId, param, moduleList, targetCountryList, allLanguagesInSystem, maximumFiles, maxFileSize, allowedExtensions, isModifyInFormUploader }) {
    return Object.assign({}, {
        selectedMediaId, param, moduleList, targetCountryList, allLanguagesInSystem, maximumFiles, maxFileSize, allowedExtensions, isModifyInFormUploader
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedMediaId, getFormDetail, fetchData, uploadForms, updateForm, toggleLoader, setNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(RegistrationForm));