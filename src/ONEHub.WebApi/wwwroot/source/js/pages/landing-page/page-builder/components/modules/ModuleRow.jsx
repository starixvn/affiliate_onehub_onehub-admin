import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button } from 'reactstrap';

import ModuleSelector from './ModuleSelector';
import SourceSelector from './SourceSelector';
import { removeModuleComponent, insertModuleAfter } from '../../actions';
import { pageBuilderLabels } from '../../libs/constants';

const ModuleRow = ({ module, isFirst, isLast, canRemove, validation, moduleComponents, moduleList, removeModuleComponent, insertModuleAfter }) => {
    const handleRemove = useCallback(() => {
        if (canRemove) {
            removeModuleComponent(module.id);
        }
    }, [canRemove, removeModuleComponent, module.id]);

    const handleAddModule = useCallback(() => {
        insertModuleAfter(module.id);
    }, [insertModuleAfter, module.id]);

    const getModuleError = useCallback(() => {
        return validation.errors[`module_${module.id}`];
    }, [validation.errors, module.id]);

    const getSourceError = useCallback(() => {
        return validation.errors[`media_${module.id}`];
    }, [validation.errors, module.id]);

    // Get the selected module's properties
    const selectedModuleInfo = moduleList.find(m => m.ModuleId === module.moduleId);
    
    // Check if this module can be removed
    const canRemoveModule = useCallback(() => {
        if (!canRemove) return false;
        
        // If module is required, check if there are other instances of this module
        if (selectedModuleInfo?.IsRequired) {
            // Special case: "Logo $ Sponsorship" (moduleId 2) can be removed if "Logo Sponsorship & Register" (moduleId 3) is present
            if (module.moduleId === 2) {
                const hasLogoSponsorshipRegister = moduleComponents.some(comp => comp.moduleId === 3);
                if (hasLogoSponsorshipRegister) {
                    return true; // Can remove "Logo $ Sponsorship" when "Logo Sponsorship & Register" is present
                }
            }
            
            const sameModuleCount = moduleComponents.filter(comp => comp.moduleId === module.moduleId).length;
            return sameModuleCount > 1; // Can remove only if there are multiple instances
        }
        
        return true;
    }, [canRemove, selectedModuleInfo, moduleComponents, module]);

    // Check if we can add more instances of the selected module
    const canAddModule = useCallback(() => {
        if (!selectedModuleInfo) return true; // Can add if no module selected
        
        // If module is unique, check if it's already used by OTHER components
        if (selectedModuleInfo.IsUnique) {
            const existingCount = moduleComponents.filter(comp => 
                comp.moduleId === selectedModuleInfo.ModuleId && comp.id !== module.id
            ).length;
            return existingCount === 0; // Can add only if not already used by others
        }
        
        return true; // Can add multiple instances for non-unique modules
    }, [selectedModuleInfo, moduleComponents, module]);

    return (
        <Row className="mb-3 align-items-start module-row">
            {/* Order */}
            <Col xs={1} className="text-center">
                <div className="module-order">
                    <span className="badge badge-secondary">
                        {module.orderId}
                    </span>
                </div>
            </Col>

            <Col xs={9}>
                <Row>
                    <Col xs={6}>
                        <ModuleSelector 
                            moduleId={module.id}
                            value={module.moduleId}
                            error={getModuleError()}
                        />
                    </Col>
                    <Col xs={6}>
                        <SourceSelector 
                            moduleId={module.id}
                            selectedModuleId={module.moduleId}
                            value={module.mediaId}
                            error={getSourceError()}
                        />
                    </Col>
                </Row>
            </Col>

            {/* Actions */}
            <Col xs={2} className="text-center">
                <div className="module-actions d-flex gap-2 justify-content-center">
                    {/* Add Button */}
                    {canAddModule() && (
                        <Button
                            color="success"
                            outline
                            size="sm"
                            onClick={handleAddModule}
                            title={selectedModuleInfo?.IsUnique 
                                ? "This module can only be used once" 
                                : "Add module after this one"
                            }
                        >
                            <i className="fa fa-plus"></i>
                            <span className="d-none d-md-inline ms-1">
                                Add
                            </span>
                        </Button>
                    )}
                    
                    <Button
                            className="ml-2"
                            color="danger"
                            outline
                            size="sm"
                            disabled={moduleComponents.length === 1}
                            onClick={handleRemove}
                            title={selectedModuleInfo?.IsRequired 
                                ? "Required module - at least one must remain" 
                                : "Remove this module"
                            }
                        >
                            <i className="fa fa-trash"></i>
                            <span className="d-none d-md-inline ms-1">
                                {pageBuilderLabels.remove}
                            </span>
                        </Button>
                </div>
            </Col>
        </Row>
    );
};

function mapStateToProps({ validation, moduleComponents, moduleList }) {
    return Object.assign({}, { validation, moduleComponents, moduleList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ removeModuleComponent, insertModuleAfter }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ModuleRow));
