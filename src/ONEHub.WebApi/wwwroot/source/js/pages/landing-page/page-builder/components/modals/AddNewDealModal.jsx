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
    Dropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem,
    Input,
    Alert,
    Form,
    Col
} from 'reactstrap';

import { fetchNormalDealList, insertLandingPageDeal, addDealToList } from '../../actions';
import { globalResource } from '@/modules/globalResource';

const AddNewDealModal = ({ isOpen, toggle, onAddDeal, normalDealList, dealList, fetchNormalDealList, insertLandingPageDeal, addDealToList }) => {
    const [selectedDealType, setSelectedDealType] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropDirection, setDropDirection] = useState('down');
    const [alertState, setAlertState] = useState({ message: '', type: '', show: false });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef(null);
    const alertTimeoutRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (!normalDealList || normalDealList.length === 0) {
                setIsLoading(true);
                fetchNormalDealList();
                
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
            }
        }
    }, [isOpen, normalDealList, fetchNormalDealList]);

    useEffect(() => {
        if (normalDealList && normalDealList.length > 0) {
            setIsLoading(false);
        }
    }, [normalDealList]);

    const toggleDropdown = useCallback(() => {
        if (!isDropdownOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = 250;
            
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropDirection('up');
            } else {
                setDropDirection('down');
            }
        }
        setIsDropdownOpen(prevState => !prevState);
    }, [isDropdownOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (isDropdownOpen && dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - rect.bottom;
                const spaceAbove = rect.top;
                const dropdownHeight = 250;
                
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
    }, [isDropdownOpen]);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const showAlert = useCallback((message, type = 'danger') => {
        setAlertState({ message, type, show: true });
        
        // Clear any existing timeout
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
        
        // Auto-close success alerts after 3 seconds
        if (type === 'success') {
            alertTimeoutRef.current = setTimeout(() => {
                setAlertState(prev => ({ ...prev, show: false }));
                // Close modal after alert fades
                setTimeout(() => {
                    toggle();
                }, 300); // Allow time for alert to fade out
            }, 3000);
        }
    }, [toggle]);

    const hideAlert = useCallback(() => {
        setAlertState(prev => ({ ...prev, show: false }));
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
    }, []);

    const handleDealTypeSelect = useCallback((dealType) => {
        setSelectedDealType(dealType);
        hideAlert();
    }, [hideAlert]);

    const allDealTypes = normalDealList || [];
    const existingDealList = dealList || [];
    
    const availableDealTypes = allDealTypes.filter(normalDeal => {
        return !existingDealList.some(existingDeal => 
            existingDeal.key === normalDeal.GroupId
        );
    });

    const filteredDealTypes = availableDealTypes.filter(dealType => 
        dealType.GroupName && dealType.GroupName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedDealTypeObj = availableDealTypes.find(d => d.GroupId == selectedDealType);
    const displayText = isLoading ? 'Loading...' : (selectedDealTypeObj ? selectedDealTypeObj.GroupName : 'Please select');

    const handleAdd = useCallback(async () => {
        if (!selectedDealType) {
            showAlert('Please select a deal type.', 'danger');
            return;
        }

        setIsSubmitting(true);
        hideAlert();

        try {
            const result = await insertLandingPageDeal(selectedDealType);
            
            if (result && result.IsSuccessful) {
                const selectedDealTypeObj = availableDealTypes.find(d => d.GroupId == selectedDealType);
                
                const newDealForList = {
                    key: selectedDealTypeObj.GroupId,
                    name: selectedDealTypeObj.GroupName,
                    checked: true
                };
                addDealToList(newDealForList);

                if (onAddDeal) {
                    onAddDeal(selectedDealTypeObj);
                }

                showAlert(result.Message || 'Deal added successfully!', 'success');

                setSelectedDealType('');
                setSearchTerm('');
            } else {
                showAlert(result?.Message || 'Failed to add deal. Please try again.', 'danger');
            }
        } catch (error) {
            showAlert('An unexpected error occurred. Please try again.', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedDealType, onAddDeal, availableDealTypes, insertLandingPageDeal, addDealToList, showAlert, hideAlert]);

    const handleCancel = useCallback(() => {
        setSelectedDealType('');
        setSearchTerm('');
        hideAlert();
        toggle();
    }, [toggle, hideAlert]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedDealType('');
            setSearchTerm('');
            hideAlert();
            setIsDropdownOpen(false);
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
        <Modal isOpen={isOpen} toggle={toggle} backdrop='static' size='xs'>
            <ModalHeader toggle={toggle}><span className="iconpopup"></span>Add New Deal</ModalHeader>
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
                        <fieldset>
                            <legend>
                                <h6>Deal</h6>
                            </legend>
                        <Form tag="form" className="mb-3">
                            <FormGroup row>
                                <Label for="dealNameDropdown" className="required" sm={3}>
                                    Deal Name
                                </Label>
                                <Col sm={9} className='align-self-center'>
                                    <div className="deal-selector" ref={dropdownRef}>
                                        <style>
                                            {`
                                            .dropdown-menu-up {
                                                bottom: 100% !important;
                                                top: auto !important;
                                                transform: translateY(-2px) !important;
                                                margin-bottom: 2px !important;
                                            }
                                            `}
                                        </style>
                                        <Dropdown 
                                            isOpen={isDropdownOpen} 
                                            toggle={toggleDropdown} 
                                            className="w-100"
                                        >
                                            <DropdownToggle
                                                caret
                                                id="dealNameDropdown"
                                                className={`form-control text-left ${alertState.show && alertState.type === 'danger' ? 'is-invalid border-danger' : ''}`}
                                                style={{ backgroundColor: 'white', border: '1px solid #ced4da', color: 'black' }}
                                            >
                                                {displayText}
                                            </DropdownToggle>
                                            <DropdownMenu 
                                                className={`w-100 ${dropDirection === 'up' ? 'dropdown-menu-up' : ''}`}
                                                style={{ 
                                                    maxHeight: '250px', 
                                                    overflowY: 'auto',
                                                    zIndex: 1060,
                                                    position: 'absolute',
                                                    width: '100%'
                                                }}
                                                flip={false}
                                                right={dropDirection === 'up'}
                                            >
                                                <DropdownItem header>
                                                    <Input
                                                        type="text"
                                                        placeholder="Search deal name..."
                                                        value={searchTerm}
                                                        onChange={handleSearchChange}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </DropdownItem>
                                                <DropdownItem divider />
                                                {isLoading ? (
                                                    <DropdownItem disabled>
                                                        <i className="fa fa-spinner fa-spin me-2"></i>
                                                        Loading deals...
                                                    </DropdownItem>
                                                ) : filteredDealTypes.length > 0 ? (
                                                    filteredDealTypes.map(dealType => (
                                                        <DropdownItem
                                                            key={dealType.GroupId}
                                                            tag="button"
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDealTypeSelect(dealType.GroupId);
                                                            }}
                                                            active={dealType.GroupId == selectedDealType}
                                                        >
                                                            {dealType.GroupName}
                                                        </DropdownItem>
                                                    ))
                                                ) : (
                                                    <DropdownItem disabled>
                                                        {searchTerm ? 'No deals found' : 'No deals available'}
                                                    </DropdownItem>
                                                )}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Form>
                        </fieldset>
                        <Button 
                            type="button"
                            color="success"
                            className="mr-3"
                            disabled={!selectedDealType || isSubmitting}
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

function mapStateToProps({ normalDealList, dealList }) {
    return Object.assign({}, { normalDealList, dealList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchNormalDealList, insertLandingPageDeal, addDealToList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AddNewDealModal));
