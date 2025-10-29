import React, { useState, useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { showConfirmToast } from '@/pages/common/components/Toast';

import { updateModuleComponent } from '../../actions';
import { defaultModuleIds } from '../../../libs/constants';

const ModuleSelector = ({ moduleId, value, error, moduleList, moduleComponents, updateModuleComponent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [dropDirection, setDropDirection] = useState('down');
    const [showTooltip, setShowTooltip] = useState(false);
    const dropdownRef = useRef(null);

    const toggleTooltip = () => {
        if (showTooltip) {
            setShowTooltip(false);
        } else {
            showConfirmToast({
                title: "Background Module",
                content: "This module must be selected first and is required for the landing page to display.",
                onConfirm: () => {
                    setShowTooltip(false);
                },
                onCancel: () => {
                    setShowTooltip(false);
                },
                cancelText: "Cancel",
                submitText: "OK",
                isNotification: true
            });
        };
    };

    const toggle = useCallback(() => {
        if (value === defaultModuleIds.Background) {
            return;
        }

        if (!isOpen && dropdownRef.current) {
            // Calculate available space when opening dropdown
            const rect = dropdownRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = 300; // maxHeight of dropdown
            
            // If not enough space below but more space above, drop up
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropDirection('up');
            } else {
                setDropDirection('down');
            }
        }
        setIsOpen(prevState => !prevState);
    }, [isOpen]);

    // Effect to handle module selection and force dropdown close
    useEffect(() => {
        if (selectedModuleId !== null) {
            // Close dropdown immediately
            setIsOpen(false);
            
            // Use setTimeout to ensure state updates happen after dropdown closes
            setTimeout(() => {
                updateModuleComponent(moduleId, 'moduleId', selectedModuleId);
                
                if (selectedModuleId === defaultModuleIds.LoginBtn) {
                    updateModuleComponent(moduleId, 'extraInfo', "/login");
                }
                // Reset source when module changes
                updateModuleComponent(moduleId, 'mediaId', null);
                
                // Note: fetchModuleSources is handled by SourceSelector with proper country/language parameters
                
                // Reset selection trigger
                setSelectedModuleId(null);
            }, 10);
        }
    }, [selectedModuleId, updateModuleComponent, moduleId]);

    // Effect to handle window resize and recalculate dropdown direction
    useEffect(() => {
        const handleResize = () => {
            if (isOpen && dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - rect.bottom;
                const spaceAbove = rect.top;
                const dropdownHeight = 300;
                
                if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                    setDropDirection('up');
                } else {
                    setDropDirection('down');
                }
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize);
        };
    }, [isOpen]);

    const handleModuleSelect = useCallback((moduleIdToSelect) => {
        setSelectedModuleId(moduleIdToSelect);
    }, []);


    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const filteredModules = moduleList.filter(module => {
        // Filter by search term
        if (!module.ModuleName || !module.ModuleName.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        
        // If module is unique and already used by another component, exclude it
        if (module.IsUnique) {
            const isAlreadyUsed = moduleComponents.some(comp => 
                comp.moduleId === module.ModuleId && comp.id !== moduleId
            );
            if (isAlreadyUsed) {
                return false;
            }
        }
        
        return true;
    });

    const selectedModule = moduleList.find(m => m.ModuleId === value);
    const displayText = selectedModule ? selectedModule.ModuleName : 'Please select...';
    const isBackgroundModule = value === defaultModuleIds.Background;

    return (
        <div className="module-selector" ref={dropdownRef}>
            <style>
                {`
                .dropdown-menu-up {
                    bottom: 100% !important;
                    top: auto !important;
                    transform: translateY(-2px) !important;
                    margin-bottom: 2px !important;
                }
                .dropdown-item {
                    color: #495057 !important;
                    font-size: 13px !important;
                }
                .dropdown-item:hover {
                    background-color: #f8f9fa !important;
                    color: #495057 !important;
                }
                .dropdown-item.active {
                    background-color: #007bff !important;
                    color: white !important;
                }
                .dropdown-item.active:hover {
                    background-color: #0056b3 !important;
                    color: white !important;
                }
                `}
            </style>
            <Dropdown 
                isOpen={isOpen}
                toggle={toggle} 
                className="w-100"
            >
                <DropdownToggle
                    disabled={isBackgroundModule}
                    caret
                    className={`form-control text-left ${error ? 'is-invalid border-danger' : ''}`}
                    style={{ backgroundColor: 'white', border: '1px solid #ced4da', color: '#495057' }}
                >
                    {displayText}
                </DropdownToggle>
                {
                    isBackgroundModule && (
                        <div 
                            className="rounded-circle note-info"
                            style={{ cursor: 'pointer', top: '2px', right: '2px', position: 'absolute' }}
                            onClick={toggleTooltip}
                        >
                            <span class="oi oi-info"></span>
                        </div>
                    )
                }
                <DropdownMenu 
                    className={`w-100 ${dropDirection === 'up' ? 'dropdown-menu-up' : ''}`}
                    style={{ 
                        maxHeight: '300px', 
                        overflowY: 'auto',
                        zIndex: 1050,
                        position: 'absolute',
                        width: '100%'
                    }}
                    flip={false}
                    right={dropDirection === 'up'}
                >
                    <DropdownItem header>
                        <Input
                            type="text"
                            placeholder="Search modules..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </DropdownItem>
                    <DropdownItem divider />
                    {filteredModules.length > 0 ? (
                        filteredModules.map(module => (
                            <DropdownItem
                                key={module.ModuleId}
                                tag="button"
                                type="button"
                                onClick={(e) => {
                                    handleModuleSelect(module.ModuleId);
                                }}
                                active={module.ModuleId === value}
                            >
                                {module.ModuleName}
                            </DropdownItem>
                        ))
                    ) : (
                        <DropdownItem disabled>
                            No modules found
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

function mapStateToProps({ moduleList, moduleComponents }) {
    return Object.assign({}, { moduleList, moduleComponents });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateModuleComponent }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ModuleSelector));
