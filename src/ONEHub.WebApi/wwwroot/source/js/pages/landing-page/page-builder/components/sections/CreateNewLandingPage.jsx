import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, Alert } from 'reactstrap';

import CampaignSelector from '../form/CampaignSelector';
import TargetCountrySelector from '../form/TargetCountrySelector';
import LanguageSelector from '../form/LanguageSelector';
import DealSelector from '../form/DealSelector';
import PageNameInput from '../form/PageNameInput';
import PageCodeInput from '../form/PageCodeInput';
import StatusSelector from '../form/StatusSelector';
import ActionButtons from '../actions/ActionButtons';

const CreateNewLandingPage = ({ formData, validation, isEditMode, pageBuilderDetail }) => {
    const title = isEditMode
        ? `Update the Landing Page "${pageBuilderDetail.PageName}"`
        : 'Create New Landing Page';

    const formErrorFields = ['campaignId', 'targetCountryCode', 'pageName', 'languageCode', 'pageCode', 'dealIds', 'status'];
    const formErrors = {};
    
    if (validation && validation.errors) {
        formErrorFields.forEach(field => {
            if (validation.errors[field]) {
                formErrors[field] = validation.errors[field];
            }
        });
    }
    
    const hasFormErrors = Object.keys(formErrors).length > 0;
    
    const getFieldDisplayName = (fieldKey) => {
        const fieldNames = {
            campaignId: 'Campaign Name',
            targetCountryCode: 'Target Country',
            pageName: 'Page Name',
            languageCode: 'Language',
            pageCode: 'Page Code',
            dealIds: 'Deal',
            status: 'Status'
        };
        return fieldNames[fieldKey] || fieldKey;
    };

    return (
        <Row>
            <Col sm={10}>
                <fieldset className='create-new-landing-page'>
                    <legend><h6 className="font-weight-bold text-success">
                        {title}
                    </h6></legend>
                    
                    {hasFormErrors && (
                        <Alert color="danger" className="mb-3">
                            <ul className="mb-0">
                                {Object.entries(formErrors).map(([key, error]) => (
                                    <li key={key} className="mb-1">
                                        <strong>{getFieldDisplayName(key)}:</strong> {typeof error === 'string' ? error : String(error || 'Validation error')}
                                    </li>
                                ))}
                            </ul>
                        </Alert>
                    )}
                        <Row>
                            <Col xs={6} className='align-self-center'>
                                <CampaignSelector 
                                    value={formData.campaignId}
                                    error={validation.errors.campaignId}
                                />
                            </Col>
                            <Col xs={6} className='align-self-center'>
                                <DealSelector 
                                    value={formData.dealIds}
                                    error={validation.errors.dealIds}
                                    campaignId={formData.campaignId}
                                    required={true}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} className='align-self-center'>
                                <TargetCountrySelector 
                                    value={formData.targetCountryCode}
                                    error={validation.errors.targetCountryCode}
                                />
                            </Col>
                            <Col xs={6} className='align-self-center'>
                                <PageNameInput 
                                    value={formData.pageName}
                                    error={validation.errors.pageName}
                                    required={true}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} className='align-self-center'>
                                <LanguageSelector 
                                    value={formData.languageCode}
                                    error={validation.errors.languageCode}
                                />
                            </Col>
                            <Col xs={6} className='align-self-center'>
                                <PageCodeInput 
                                    value={formData.pageCode}
                                    error={validation.errors.pageCode}
                                    required={true}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} className='align-self-center'>
                                <StatusSelector 
                                    value={formData.status}
                                    error={validation.errors.status}
                                />
                            </Col>
                        </Row>
                </fieldset>
            </Col>
            <Col sm={2}>
                <ActionButtons />
            </Col>
        </Row>
    );
};

function mapStateToProps({ formData, validation, isEditMode, pageBuilderDetail }) {
    return Object.assign({}, { formData, validation, isEditMode, pageBuilderDetail });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(CreateNewLandingPage));
