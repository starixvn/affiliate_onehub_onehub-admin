import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup, Label, Input, Row, Col } from 'reactstrap';

import { updateFormField } from '../../actions';
import { pageBuilderLabels } from '../../libs/constants';

const PageNameInput = ({ value, error, required = false, updateFormField }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        if (value !== localValue) {
            setLocalValue(value || '');
        }
    }, [value]);

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
        updateFormField('pageName', newValue);
        
        // Debounced validation
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    }, [updateFormField]);

    return (
        <FormGroup>
            <Row className='align-items-center'>
                <Label xl={3} for="pageNameInput" className={required ? 'required' : ''}>
                    {pageBuilderLabels.pageName}
                </Label>
                <Col xl={9}>
                    <Input
                        type="text"
                        id="pageNameInput"
                        value={localValue}
                        onChange={handleChange}
                        invalid={!!error}
                        placeholder="e.g.: New Year Promotion Page"
                        maxLength={50}
                    />
                </Col>
            </Row>
        </FormGroup>
    );
};

function mapStateToProps({  }) {
    return Object.assign({}, {  });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateFormField }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PageNameInput));
