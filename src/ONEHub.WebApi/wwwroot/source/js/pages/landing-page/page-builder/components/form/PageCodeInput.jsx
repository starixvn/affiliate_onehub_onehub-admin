import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup, Label, Input, Row, Col } from 'reactstrap';

import { updateFormField, setValidationErrors } from '../../actions';
import { pageBuilderLabels, validationMessages, pageCodePattern } from '../../libs/constants';

const PageCodeInput = ({ value, error, required = false, validation, isEditMode, pageBuilderDetail, updateFormField, setValidationErrors }) => {
    const [localValue, setLocalValue] = useState('');
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        // Sync with external value changes
        if (value !== localValue) {
            setLocalValue(value || '');
            // Only validate pattern if value exists and is not empty
            // Skip validation if there are no existing validation errors (likely a programmatic reset)
            if (value && value.trim().length > 0 && validation && validation.errors && Object.keys(validation.errors).length > 0) {
                if (!pageCodePattern.test(value)) {
                    setValidationErrors({
                        pageCode: validationMessages.pageCodeInvalid
                    });
                }
            }
        }
    }, [value, validation, setValidationErrors]);

    // Validate page code when initialized from pageBuilderDetail (edit mode)
    useEffect(() => {
        if (isEditMode && pageBuilderDetail && pageBuilderDetail.PageCode && !validation.isValidating) {
            // Only validate if this is the initial load and we have a page code from pageBuilderDetail
            const pageCodeFromDetail = pageBuilderDetail.PageCode;
            
            // Validate the existing page code and show errors if invalid
            if (pageCodeFromDetail && pageCodeFromDetail.trim().length > 0) {
                // First check pattern
                if (!pageCodePattern.test(pageCodeFromDetail)) {
                    setValidationErrors({
                        pageCode: validationMessages.pageCodeInvalid
                    });
                    return;
                }
            }
        }
    }, [isEditMode, pageBuilderDetail, validation.isValidating, setValidationErrors]);

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const handleChange = useCallback((event) => {
        const newValue = event.target.value;
        setLocalValue(newValue);
        updateFormField('pageCode', newValue);
    }, [updateFormField]);

    const { isValidating } = validation;

    return (
        <FormGroup>
            <Row className='align-items-center'>
                <Label xl={3} for="pageCodeInput" className={required ? 'required' : ''}>
                    {pageBuilderLabels.pageCode}
                </Label>
                <Col xl={9}>
                    <Input
                        type="text"
                        id="pageCodeInput"
                        value={localValue}
                        disabled={isEditMode}
                        onChange={handleChange}
                        invalid={!!error}
                        placeholder="e.g.: LP-2025-NY"
                        maxLength={50}
                    />
                    {isValidating && (
                        <small className="text-muted">
                            <i className="fa fa-spinner fa-spin me-1"></i>
                            Checking availability...
                        </small>
                    )}
                </Col>
            </Row>
        </FormGroup>
    );
};

function mapStateToProps({ validation, isEditMode, pageBuilderDetail }) {
    return Object.assign({}, { validation, isEditMode, pageBuilderDetail });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateFormField, setValidationErrors }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PageCodeInput));
