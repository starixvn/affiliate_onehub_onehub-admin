import React, { useState, useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    Modal, 
    ModalHeader, 
    ModalBody, 
    Button, 
    FormGroup, 
    Label, 
    Input,
    Alert,
    Form,
    Col
} from 'reactstrap';

import { insertLandingPageCampaign, fetchCampaigns, updateFormField } from '../../actions';
import { globalResource } from '@/modules/globalResource';

const AddNewCampaignModal = ({ isOpen, toggle, insertLandingPageCampaign, fetchCampaigns, updateFormField }) => {
    const [campaignName, setCampaignName] = useState('');
    const [campaignDescription, setCampaignDescription] = useState('');
    const [alertState, setAlertState] = useState({ message: '', type: '', show: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const alertTimeoutRef = useRef(null);

    const showAlert = useCallback((message, type = 'danger') => {
        setAlertState({ message, type, show: true });
        
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
        
        if (type === 'success') {
            alertTimeoutRef.current = setTimeout(() => {
                setAlertState(prev => ({ ...prev, show: false }));
                setTimeout(() => {
                    toggle();
                }, 300);
            }, 3000);
        }
    }, [toggle]);

    const hideAlert = useCallback(() => {
        setAlertState(prev => ({ ...prev, show: false }));
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
    }, []);

    const handleCampaignNameChange = useCallback((e) => {
        setCampaignName(e.target.value);
    }, []);

    const handleCampaignDescriptionChange = useCallback((e) => {
        setCampaignDescription(e.target.value);
    }, []);

    const handleAdd = useCallback(async () => {
        if (!campaignName.trim()) {
            showAlert('Please enter a campaign name.', 'danger');
            return;
        }

        setIsSubmitting(true);
        hideAlert();

        try {
            const result = await insertLandingPageCampaign(campaignName.trim(), campaignDescription.trim());
            
            if (result && result.IsSuccessful) {
                updateFormField('campaignId', Number(result.Message));

                // Refresh the campaign list from server and select the first campaign (newly created)
                await fetchCampaigns(true); // true = selectFirst

                showAlert('Campaign added successfully!', 'success');

                setCampaignName('');
                setCampaignDescription('');
            } else {
                showAlert(result?.Message || 'Failed to add campaign. Please try again.', 'danger');
            }
        } catch (error) {
            showAlert('An unexpected error occurred. Please try again.', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    }, [campaignName, campaignDescription, insertLandingPageCampaign, fetchCampaigns, updateFormField, showAlert, hideAlert]);

    const handleCancel = useCallback(() => {
        setCampaignName('');
        setCampaignDescription('');
        hideAlert();
        toggle();
    }, [toggle, hideAlert]);

    useEffect(() => {
        if (!isOpen) {
            setCampaignName('');
            setCampaignDescription('');
            hideAlert();
            setIsSubmitting(false);
        }
    }, [isOpen, hideAlert]);

    useEffect(() => {
        return () => {
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop='static'>
            <ModalHeader toggle={toggle}><span className="iconpopup"></span>Add New Campaign</ModalHeader>
            <ModalBody>
                <div className="modal-body-wrapper">
                    <div className="banner-list-form-container">
                        {alertState.show && (
                            <Alert 
                                color={alertState.type} 
                                className="mb-3"
                                toggle={hideAlert}
                            >
                                <i className={`fa ${alertState.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                {alertState.message}
                            </Alert>
                        )}
                        <Form tag="form" className="mb-3">
                            <FormGroup row>
                                <Label for="campaignNameInput" className="required" sm={4}>
                                    Campaign Name
                                </Label>
                                <Col sm={8} className='align-self-center'>
                                    <Input
                                        type="text"
                                        id="campaignNameInput"
                                        placeholder="e.g. Holiday Season FTD Campaign"
                                        value={campaignName}
                                        onChange={handleCampaignNameChange}
                                        className={alertState.show && alertState.type === 'danger' && !campaignName.trim() ? 'is-invalid border-danger' : ''}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="campaignDescriptionInput" sm={4}>
                                    Campaign Description
                                </Label>
                                <Col sm={8} className='align-self-center'>
                                    <Input
                                        type="textarea"
                                        id="campaignDescriptionInput"
                                        placeholder="Describe the campaign purpose, target audience, and key features..."
                                        value={campaignDescription}
                                        onChange={handleCampaignDescriptionChange}
                                        rows={6}
                                        className={alertState.show && alertState.type === 'danger' && !campaignDescription.trim() ? 'is-invalid border-danger' : ''}
                                    />
                                </Col>
                            </FormGroup>
                        </Form>
                        <Button 
                            type="button"
                            color="success"
                            className="mr-3"
                            disabled={!campaignName.trim() || isSubmitting}
                            onClick={handleAdd}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fa fa-spinner fa-spin me-1"></i>
                                    Adding...
                                </>
                            ) : (
                                globalResource.Add
                            )}
                        </Button>
                        <Button type="button" color="info" onClick={handleCancel}>{globalResource.Cancel}</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ insertLandingPageCampaign, fetchCampaigns, updateFormField }, dispatch);
}

export default connect(null, mapDispatchToProps)(React.memo(AddNewCampaignModal));
