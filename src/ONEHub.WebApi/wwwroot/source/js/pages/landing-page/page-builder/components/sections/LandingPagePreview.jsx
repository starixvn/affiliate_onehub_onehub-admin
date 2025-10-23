import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Alert, Spinner } from 'reactstrap';

const LandingPagePreview = ({ validation, ui }) => {
    const formErrorFields = ['campaignId', 'targetCountryCode', 'pageName', 'languageCode', 'pageCode', 'dealIds', 'status'];
    const moduleErrorFields = ['moduleComponents', 'module_', 'media_', 'required_module_'];
    const previewErrors = {};
    
    if (validation && validation.errors) {
        Object.entries(validation.errors).forEach(([key, error]) => {
            const isFormError = formErrorFields.includes(key);
            const isModuleError = moduleErrorFields.some(prefix => key === prefix || key.startsWith(prefix));
            
            if (!isFormError && !isModuleError) {
                previewErrors[key] = error;
            }
        });
    }
    
    const hasPreviewErrors = Object.keys(previewErrors).length > 0;
    const [iframeBlocked, setIframeBlocked] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [cspDetected, setCspDetected] = useState(false);

    const handleIframeLoad = useCallback(() => {
        setIframeLoaded(true);
        setIframeBlocked(false);
    }, []);

    const handleIframeError = useCallback(() => {
        setIframeBlocked(true);
        setIframeLoaded(false);
    }, []);



    const handleOpenInNewTab = useCallback(() => {
        if (ui.previewUrl) {
            window.open(ui.previewUrl, '_blank');
        }
    }, [ui.previewUrl]);

    useEffect(() => {
        if (ui.previewUrl && !iframeBlocked) {
            setIframeLoaded(false);
            setCspDetected(false);
        }
    }, [ui.previewUrl, iframeBlocked]);
    
    useEffect(() => {
        const handleSecurityPolicyViolation = (event) => {
            if (event.violatedDirective && event.violatedDirective.includes('frame-src')) {
                setCspDetected(true);
                setIframeBlocked(true);
            }
        };
        
        document.addEventListener('securitypolicyviolation', handleSecurityPolicyViolation);
        
        return () => {
            document.removeEventListener('securitypolicyviolation', handleSecurityPolicyViolation);
        };
    }, []);

    return (
                <fieldset className='landing-page-preview'>
                    <legend className='d-flex'>
                        <h6 className="font-weight-bold text-success mb-0">Landing Page Preview</h6>
                        {
                            ui.previewUrl && (
                                <Button 
                                    className='ml-3'
                                    color="primary" 
                                    size="sm" 
                                    onClick={handleOpenInNewTab}
                                >
                                    Open in New Tab
                                </Button>
                            )
                        }
                    </legend>
                    
                    {ui.previewUrl && cspDetected && !iframeBlocked && (
                        <Alert color="warning" className="mb-3">
                            <i className="fa fa-exclamation-triangle me-2"></i>
                            <strong>Content Security Policy Detected</strong>
                            <br />
                            The landing page domain has blocked iframe display due to CSP restrictions.
                            Attempting to load the preview...
                        </Alert>
                    )}
                    
                    {hasPreviewErrors && (
                        <Alert color="danger" className="mb-3">
                            <h6 className="alert-heading">
                                <i className="fa fa-exclamation-triangle me-2"></i>
                                Preview Validation Errors
                            </h6>
                            <p className="mb-2">Please fix the following preview-related errors:</p>
                            <ul className="mb-0">
                                {Object.entries(previewErrors).map(([key, error]) => (
                                    <li key={key} className="mb-1">
                                        {typeof error === 'string' ? error : String(error || 'Validation error')}
                                    </li>
                                ))}
                            </ul>
                        </Alert>
                    )}
                
                    <div className="preview-container">
                        {ui.previewUrl && (
                            !iframeBlocked ? (
                                <div className="mobile-preview-wrapper" style={{
                                    width: '100%',
                                    maxWidth: '393px',
                                    margin: '0 auto'
                                }}>
                                    <div className="preview-iframe-container mobile-viewport" style={{ 
                                        border: '1px solid #dee2e6', 
                                        borderRadius: '0.375rem',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '393/852', // Maintain mobile aspect ratio
                                        minHeight: '400px' // Minimum height fallback
                                    }}>
                                        <iframe
                                            src={ui.previewUrl.includes('isPreview') ? ui.previewUrl : ui.previewUrl + '?refresh=true'}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                border: 'none',
                                                display: iframeLoaded ? 'block' : 'none'
                                            }}
                                            title="Landing Page Preview"
                                            onLoad={handleIframeLoad}
                                            onError={handleIframeError}
                                            key="preview-iframe"
                                        />
                                        {!iframeLoaded && (
                                            <div className="d-flex align-items-center justify-content-center" style={{ 
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: '#f8f9fa'
                                            }}>
                                                <div className="text-center">
                                                    <Spinner color="primary" />
                                                    <div className="mt-2">Loading preview...</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Alert color="warning" className="mb-4">
                                        <i className="fa fa-exclamation-triangle me-2"></i>
                                        <strong>Preview cannot be displayed in iframe</strong>
                                        <br />
                                        {cspDetected ? (
                                            <>This is due to Content Security Policy restrictions from the landing page domain.</>
                                        ) : (
                                            <>This may be due to Content Security Policy restrictions or network issues.</>
                                        )}
                                        <br />Please use the button below to open the preview in a new tab.
                                    </Alert>
                                    
                                    <div className="mb-3">
                                        <i className="fa fa-external-link fa-3x text-primary mb-3"></i>
                                        <h6>Preview Ready</h6>
                                        <p className="text-muted">
                                            Your landing page preview has been generated successfully.
                                        </p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <strong>Preview URL:</strong>
                                        <div className="mt-2">
                                            <code className="bg-light p-2 rounded d-inline-block" style={{ fontSize: '11px' }}>
                                                {ui.previewUrl}
                                            </code>
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        color="primary" 
                                        size="sm"
                                        onClick={handleOpenInNewTab}
                                        className="me-2"
                                    >
                                        <i className="fa fa-external-link me-2"></i>
                                        Open Preview in New Tab
                                    </Button>
                                    
                                    <Button
                                        className="ml-2"
                                        color="secondary" 
                                        size="sm"
                                        onClick={() => {
                                            setIframeBlocked(false);
                                            setIframeLoaded(false);
                                        }}
                                    >
                                        <i className="fa fa-refresh me-2"></i>
                                        Try Iframe Again
                                    </Button>
                                </div>
                            )
                        )}

                        {!ui.hasPreviewedOrCreated && (
                            <div className="preview-placeholder">
                                <div className="preview-icon">
                                    <i className="fa fa-file-o" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                </div>
                                <div className="preview-text">
                                    <p className="text-muted text-center mt-3">
                                        Create a new page, then select<br />
                                        components in order to start building.
                                    </p>
                                    <p className="text-muted text-center mt-2" style={{ fontSize: '12px' }}>
                                        Reference the Best Practice tips for<br />
                                        optimal layout.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </fieldset>
            );
};

function mapStateToProps({ validation, ui }) {
    return {
        validation,
        ui
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(LandingPagePreview));
