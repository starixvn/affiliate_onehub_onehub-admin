import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, Label, Col, Input, Button, Form } from 'reactstrap';
import { ActionCreators } from '../actions';
import { v4 as uuidv4 } from 'uuid';
import { showErrorToast } from '@/pages/common/components/Toast';
import { confirmPopupContent } from '../constants/settings';

// Campaign Form Modal Component
const CampaignFormModal = ({
    title,
    formData,
    errors,
    statusList,
    onInputChange,
    onBlur,
    onSubmit,
    onClose,
    isAdd,
    showStatusNote
}) => (
    <div className="modal-backdrop">
        <div className="campaign-form-modal">
            <div className="modal-header form-header">
                <div className="header-content">
                    <span className={isAdd ? "oi oi-plus" : "oi oi-pencil"}></span>{title}
                </div>
                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            <div className="modal-content form-content">
                <Form onSubmit={onSubmit} autoComplete="off" acceptCharset="UTF-8">
                    {!isAdd && (
                        <FormGroup row className="mb-2">
                            <Label sm={3} htmlFor="campaignCode">Campaign Code</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="campaignCode"
                                    id="campaignCode"
                                    value={formData.campaignCode}
                                    disabled={true}
                                />
                            </Col>
                        </FormGroup>
                    )}

                    <FormGroup row className="mb-2">
                        <Label sm={3} htmlFor="campaignName" className="required">
                            Campaign Name
                        </Label>
                        <Col sm={9}>
                            <Input
                                type="text"
                                name="campaignName"
                                id="campaignName"
                                placeholder="e.g. Holiday Season FTD Campaign"
                                value={formData.campaignName}
                                onChange={onInputChange}
                                onBlur={onBlur}
                                className={errors.campaignName ? 'form-validation-warning' : ''}
                                required
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row className="mb-2">
                        <Label sm={3} htmlFor="description">Campaign Description</Label>
                        <Col sm={9}>
                            <Input
                                type="textarea"
                                name="description"
                                id="description"
                                placeholder="Describe the campaign purpose, target audience, and key features"
                                value={formData.description}
                                onChange={onInputChange}
                                rows="4"
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row className="mb-3">
                        <Label sm={3} htmlFor="statusId">Status</Label>
                        <Col sm={9}>
                            <Input
                                type="select"
                                name="statusId"
                                id="statusId"
                                value={formData.statusId}
                                onChange={onInputChange}
                            >
                                {statusList.map(statusOption => (
                                    <option key={statusOption.key} value={statusOption.key}>
                                        {statusOption.name}
                                    </option>
                                ))}
                            </Input>
                        </Col>
                    </FormGroup>

                    {showStatusNote && (
                        <div className="status-change-note">
                            <div className="status-note-content">
                                <div className="status-note-line">
                                    {confirmPopupContent.content[0]}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="campaign-form-actions text-right">
                        <Button
                            type="button"
                            color="info"
                            className="mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="success"
                            disabled={!formData.campaignName}
                        >
                            {isAdd ? 'Add' : 'Update'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
);

const CampaignFormPopup = () => {
    const dispatch = useDispatch();
    const [
        popupState,
        param,
        statusList,
        selectedStatus,
        searchCampaign,
        searchDescription,
        pagingOption
    ] = useSelector(state => [
        state.popupState,
        state.param,
        state.statusList,
        state.selectedStatus,
        state.searchCampaign,
        state.searchDescription,
        state.pagingOption
    ]);
    const { insertCampaign, updateCampaign, setParam, closeCampaignPopup, openCampaignPopup } = ActionCreators;

    const { isOpen, isAdd, selectedItem } = popupState;


    const [formData, setFormData] = useState({
        campaignId: '',
        campaignCode: '',
        campaignName: '',
        description: '',
        statusId: 0
    });

    const [state, setState] = useState({
        errors: {
            campaignName: false
        },
        originalStatusId: null,
        showStatusNote: false
    });

    useEffect(() => {
        if (!isAdd && selectedItem) {
            const originalStatus = selectedItem.StatusId || 0;
            setFormData({
                campaignId: selectedItem.CampaignId || '',
                campaignCode: selectedItem.CampaignCode || '',
                campaignName: selectedItem.CampaignName || '',
                description: selectedItem.Description || '',
                statusId: originalStatus
            });
            setState({
                errors: {
                    campaignName: false
                },
                originalStatusId: originalStatus,
                showStatusNote: false
            });
        } else if (isAdd) {
            setFormData({
                campaignId: '',
                campaignCode: '',
                campaignName: '',
                description: '',
                statusId: 0
            });
            setState({
                errors: {
                    campaignName: false
                },
                originalStatusId: null,
                showStatusNote: false
            });
        }
    }, [isAdd, selectedItem]);



    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setState(prev => {
            const newState = {
                ...prev,
                errors: {
                    ...prev.errors,
                    [name]: false
                }
            };

            newState.showStatusNote = name === 'statusId';

            return newState;
        });
    }, [isAdd]);

    const handleCampaignNameBlur = useCallback((e) => {
        const value = e.target.value;
        if (!value) {
            setState(prev => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    campaignName: true
                }
            }));
        }
    }, []);


    const handleClosePopup = useCallback(() => {
        setFormData({
            campaignId: '',
            campaignCode: '',
            campaignName: '',
            description: '',
            statusId: 0
        });

        setState({
            errors: {
                campaignName: false
            },
            originalStatusId: null,
            showStatusNote: false
        });

        dispatch(closeCampaignPopup());
    }, [dispatch, closeCampaignPopup]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const newErrors = {
            campaignName: !formData.campaignName
        };

        setState(prev => ({ ...prev, errors: newErrors }));

        if (newErrors.campaignName) {
            showErrorToast('Validation Error', 'Campaign Name is required.');
            return;
        }

        const newParam = param
            ? { ...param, RequestId: uuidv4() }
            : {
                StatusIds: selectedStatus,
                Search: searchCampaign,
                Description: searchDescription,
                PageIndex: 1,
                PageSize: pagingOption.PageSize,
                RequestId: uuidv4()
            };

        if (isAdd) {
            dispatch(insertCampaign(formData, () => {
                dispatch(setParam(newParam));
                handleClosePopup();
            }));
        } else {
            dispatch(updateCampaign(formData, () => {
                dispatch(setParam(newParam));
                handleClosePopup();
            }));
        }
    }, [formData, isAdd, selectedItem, param, dispatch, insertCampaign, updateCampaign, setParam, handleClosePopup]);

    if (!isOpen) return null;

    const title = isAdd ? 'Add New Campaign' : 'Edit Campaign';

    return (
        <CampaignFormModal
            title={title}
            formData={formData}
            errors={state.errors}
            statusList={statusList}
            onInputChange={handleInputChange}
            onBlur={handleCampaignNameBlur}
            onSubmit={handleSubmit}
            onClose={handleClosePopup}
            isAdd={isAdd}
            showStatusNote={state.showStatusNote}
        />
    );
};

export default CampaignFormPopup;
