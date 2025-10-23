import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col} from 'reactstrap';
import { fetchCampaigns, reloadAllModuleSources, validateAndResetInvalidSources } from '../actions';

import CreateNewLandingPage from './sections/CreateNewLandingPage';
import ModuleComponents from './sections/ModuleComponents';
import LandingPagePreview from './sections/LandingPagePreview';

const LandingPageForm = ({ 
    formData, 
    moduleComponents, 
    sources,
    reloadAllModuleSources, 
    validateAndResetInvalidSources 
}) => {
    const previousCountryCode = useRef(null);
    const previousLanguageCode = useRef(null);
    // Watch for changes in targetCountryCode or languageCode
    useEffect(() => {
        const currentCountryCode = formData?.targetCountryCode;
        const currentLanguageCode = formData?.languageCode;
        
        // Skip if no country/language values are set
        if (!currentCountryCode || !currentLanguageCode) {
            previousCountryCode.current = currentCountryCode;
            previousLanguageCode.current = currentLanguageCode;
            return;
        }

        // Check if country or language has changed
        const countryChanged = previousCountryCode.current !== null && 
                              previousCountryCode.current !== currentCountryCode;
        const languageChanged = previousLanguageCode.current !== null && 
                               previousLanguageCode.current !== currentLanguageCode;
        
        // Initial load: if we have modules but no previous values set, load sources
        const isInitialLoad = previousCountryCode.current === null && 
                             previousLanguageCode.current === null &&
                             moduleComponents && moduleComponents.length > 0;

        if (countryChanged || languageChanged || isInitialLoad) {
            // Reload sources for all modules with new country/language parameters
            if (moduleComponents && moduleComponents.length > 0) {
                reloadAllModuleSources(moduleComponents, currentCountryCode, currentLanguageCode)
                    .then(() => {
                        // Add another small delay to ensure React has updated the sources prop
                        setTimeout(() => {
                            // Call validation with fresh sources using a thunk
                            validateAndResetInvalidSources(moduleComponents, null); // null signals to get fresh sources
                        }, 200);
                    })
                    .catch(error => {
                        console.error('LandingPageForm - Error reloading sources:', error);
                    });
            }
        }

        // Update previous values
        previousCountryCode.current = currentCountryCode;
        previousLanguageCode.current = currentLanguageCode;
    }, [formData?.targetCountryCode, formData?.languageCode, moduleComponents, sources, reloadAllModuleSources, validateAndResetInvalidSources]);

    return (
        <Container fluid className="landing-page-builder">
            <Row>
                <Col lg={9}>
                    <CreateNewLandingPage />
                    <ModuleComponents />
                </Col>
                <Col lg={3}>
                    <LandingPagePreview />
                </Col>
            </Row>
        </Container>
    );
};

function mapStateToProps({ formData, validation, ui, moduleComponents, sources }) {
    return Object.assign({}, { formData, validation, ui, moduleComponents, sources });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchCampaigns, 
        reloadAllModuleSources, 
        validateAndResetInvalidSources 
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(LandingPageForm));
