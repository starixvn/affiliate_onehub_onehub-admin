import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup, Label, Row, Col } from 'reactstrap';

import SearchableDropdown from '@/components/SearchableDropdown';
import AddNewDealModal from '../modals/AddNewDealModal';

import { updateFormField } from '../../actions';
import { pageBuilderLabels } from '../../libs/constants';

const DealSelector = ({ value = [], error, campaignId, dealList, updateFormField, required = false }) => {
    const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);

    const handleAddDeal = useCallback(() => {
        setIsAddDealModalOpen(true);
    }, []);

    const handleAddDealModalToggle = useCallback(() => {
        setIsAddDealModalOpen(prevState => !prevState);
    }, []);

    const handleNewDealAdded = useCallback((newDeal) => {
        // The deal is already added to Redux dealList by AddNewDealModal
        // Now also add it to the current form selection
        const currentDeals = Array.isArray(value) ? value : [];
        const newDealId = newDeal.GroupId;
        
        // Add the new deal to the selection if not already included
        if (!currentDeals.includes(newDealId)) {
            const updatedDeals = [...currentDeals, newDealId];
            updateFormField('dealIds', updatedDeals);
        }
    }, [value, updateFormField]);

    // Handle selection change from SearchableDropdown
    const handleSelectionChange = (selectedIds) => {
        updateFormField('dealIds', selectedIds);
    };

    // Custom display value renderer
    const renderDisplayValue = (selectedValue) => {
        const selectedCount = Array.isArray(selectedValue) ? selectedValue.length : 0;
        if (selectedCount == 1) {
            const selectedItem = dealList.find(item => item.key == value);
            return selectedItem ? selectedItem.name : 'Please select...';
        }

        return selectedCount > 0 ? `${selectedCount} deal(s) selected` : 'Please select...';
    };

    // Custom filter function
    const filterDeals = (items, searchTerm) => {
        return items.filter(deal => 
            deal.name && deal.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <FormGroup>
            <Row className='align-items-center'>
                <Label xl={3} for="dealSelector" className={required ? 'required' : ''}>
                    {pageBuilderLabels.deal}
                </Label>
                <Col xl={9}>
                    <SearchableDropdown
                        value={value}
                        error={error}
                        placeholder="Please select..."
                        searchPlaceholder="Search deal name..."
                        
                        items={dealList}
                        getItemKey={(deal) => deal.key}
                        getItemLabel={(deal) => deal.name}
                        renderDisplayValue={renderDisplayValue}
                        
                        multiSelect={true}
                        onSelectionChange={handleSelectionChange}
                        
                        showSelectAll={true}
                        showAddNew={true}
                        onAddNew={handleAddDeal}
                        addNewLabel="Add New Deal..."
                        
                        filterItems={filterDeals}
                        
                        maxHeight={300}
                        className="w-100"
                        closeOnSelect={false}
                    />
                </Col>
            </Row>
            
            {/* Add New Deal Modal */}
            <AddNewDealModal 
                isOpen={isAddDealModalOpen}
                toggle={handleAddDealModalToggle}
                onAddDeal={handleNewDealAdded}
            />
        </FormGroup>
    );
};

function mapStateToProps({ dealList }) {
    return Object.assign({}, { dealList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateFormField }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(DealSelector));
