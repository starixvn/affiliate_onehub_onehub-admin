import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Alert } from 'reactstrap';
import ModuleComponentsSection from '../modules/ModuleComponentsSection';

const ModuleComponents = ({ validation, moduleComponents, ui }) => {
    const moduleErrors = {};
    
    if (validation && validation.errors) {
        Object.entries(validation.errors).forEach(([key, error]) => {
            if (key === 'moduleComponents' || key.startsWith('module_') || key.startsWith('media_') || key.startsWith('required_module_')) {
                moduleErrors[key] = error;
            }
        });
    }
    
    const hasModuleErrors = Object.keys(moduleErrors).length > 0;
    
    const getModuleFieldDisplayName = (fieldKey) => {
        if (fieldKey === 'moduleComponents') {
            return 'Module Components';
        } else if (fieldKey.startsWith('module_')) {
            const moduleId = fieldKey.replace('module_', '');
            const moduleComponent = moduleComponents?.find(comp => comp.id == moduleId);
            const orderNumber = moduleComponent?.orderId || moduleId;
            return `Module Selection (Order ${orderNumber})`;
        } else if (fieldKey.startsWith('media_')) {
            const moduleId = fieldKey.replace('media_', '');
            const moduleComponent = moduleComponents?.find(comp => comp.id == moduleId);
            const orderNumber = moduleComponent?.orderId || moduleId;
            return `Source Selection (Order ${orderNumber})`;
        } else if (fieldKey.startsWith('required_module_')) {
            // For required_module_ errors, don't show the key, just show the error message directly
            return '';
        }
        return fieldKey;
    };
    

    return (
        <Row>
            <Col>
                <fieldset className='module-components'>
                    <legend><h6 className="font-weight-bold text-success">Module Components</h6></legend>
                    
                    {/* Show module validation errors */}
                    {hasModuleErrors && (
                        <Alert color="danger" className="mb-3">
                            <ul className="mb-0">
                                {Object.entries(moduleErrors).map(([key, error]) => {
                                    const fieldDisplayName = getModuleFieldDisplayName(key);
                                    const errorMessage = typeof error === 'string' ? error : String(error || 'Validation error');
                                    
                                    return (
                                        <li key={key} className="mb-1">
                                            {fieldDisplayName ? (
                                                <><strong>{fieldDisplayName}:</strong> {errorMessage}</>
                                            ) : (
                                                errorMessage
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </Alert>
                    )}

                    <ModuleComponentsSection />
                </fieldset>
            </Col>
        </Row>
    );
};

function mapStateToProps({ validation, moduleComponents, ui }) {
    return Object.assign({}, { validation, moduleComponents, ui });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ModuleComponents));
