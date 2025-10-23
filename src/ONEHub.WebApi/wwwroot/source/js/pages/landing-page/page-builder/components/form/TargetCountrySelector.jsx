import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup, Label, Input, Row, Col } from 'reactstrap';

import { updateFormField } from '../../actions';
import { pageBuilderLabels } from '../../libs/constants';

const TargetCountrySelector = ({ value, error, targetCountryList, updateFormField }) => {
    // Set initial value to first country in the list if no value is set
    useEffect(() => {
        if (!value && targetCountryList && targetCountryList.length > 0) {
            const firstCountryCode = targetCountryList[0].TargetCountryCode;
            updateFormField('targetCountryCode', firstCountryCode);
            updateFormField('languageCode', targetCountryList[0].LanguageCode);
        }
    }, [value, targetCountryList, updateFormField]);

    const handleChange = useCallback((event) => {
        const targetCountryCode = event.target.value || null;
        updateFormField('targetCountryCode', targetCountryCode);
        updateFormField('languageCode', targetCountryList.find(country => country.TargetCountryCode === targetCountryCode)?.LanguageCode);
    }, [updateFormField]);

    return (
        <FormGroup>
            <Row className='align-items-center'>
                <Label xl={3} for="targetCountrySelector">
                    {pageBuilderLabels.targetCountry}
                </Label>
                <Col xl={9}>
                    <Input
                        type="select"
                        id="targetCountrySelector"
                        value={value || ''}
                        onChange={handleChange}
                        invalid={!!error}
                    >
                        {targetCountryList && targetCountryList.map(country => (
                            <option key={country.TargetCountryCode} value={country.TargetCountryCode}>
                                {country.TargetCountryName}
                            </option>
                        ))}
                    </Input>
                </Col>
            </Row>
        </FormGroup>
    );
};

function mapStateToProps({ targetCountryList }) {
    return Object.assign({}, { targetCountryList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateFormField }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(TargetCountrySelector));
