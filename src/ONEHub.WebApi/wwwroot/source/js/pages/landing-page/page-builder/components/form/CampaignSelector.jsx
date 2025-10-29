import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup, Label, Row, Col } from 'reactstrap';

import SearchableDropdown from '@/components/SearchableDropdown';
import AddNewCampaignModal from '../modals/AddNewCampaignModal';

import { updateFormField, fetchDeals, clearValidationErrors } from '../../actions';
import { pageBuilderLabels } from '../../libs/constants';
import { claimResource } from '@/modules/claim';

const CampaignSelector = ({ value, error, required = false, campaignList, updateFormField, clearValidationErrors, isModifyCampaign }) => {
    const [isAddCampaignModalOpen, setIsAddCampaignModalOpen] = useState(false);

    const handleCampaignSelect = useCallback((campaignId) => {
        updateFormField('campaignId', campaignId);
        
        if (error && campaignId) {
            clearValidationErrors();
        }
    }, [updateFormField, error, clearValidationErrors]);

    const handleAddCampaign = useCallback(() => {
        setIsAddCampaignModalOpen(true);
    }, []);

    const handleAddCampaignModalToggle = useCallback(() => {
        setIsAddCampaignModalOpen(prevState => !prevState);
    }, []);

    const handleNewCampaignAdded = useCallback(() => {
        // Campaign is automatically selected by fetchCampaigns(true) in AddNewCampaignModal
        // Just close the modal after successful addition
        setIsAddCampaignModalOpen(false);
    }, []);

    // Custom display value renderer
    const renderDisplayValue = (selectedValue) => {
        if (!selectedValue) return 'Select campaign name';
        const selectedCampaign = campaignList?.find(campaign => campaign.CampaignId === selectedValue);
        
        return selectedCampaign 
        ? `${selectedCampaign.CampaignCode} | ${selectedCampaign.CampaignName}` 
        : 'Select campaign name';
    };

    // Custom filter function
    const filterCampaigns = (items, searchTerm) => {
        return items ? items.filter(campaign => 
            campaign.CampaignName && 
            (campaign.CampaignName.toLowerCase().includes(searchTerm.toLowerCase()) || 
             campaign.CampaignCode.toLowerCase().includes(searchTerm.toLowerCase()))
        ) : [];
    };

    // Custom item renderer for campaigns
    const renderCampaignItem = (campaign, isSelected, onSelect, itemKey) => {
        const campaignTitle = `${campaign.CampaignCode} | ${campaign.CampaignName}`;

        return (
            <div
                key={itemKey}
                onClick={() => onSelect(!isSelected)} // Fixed: should toggle, so pass !isSelected
                className={`dropdown-item ${isSelected ? 'active' : ''}`}
                style={{ 
                    cursor: 'pointer', 
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    width: '100%',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '0.375rem 1.5rem'
                }}
            >
                <span 
                    className="text-truncate" 
                    style={{ minWidth: 0 }}
                    title={campaignTitle}
                >
                    {campaignTitle}
                </span>
            </div>
        );
    };

    return (
        <FormGroup>
            <Row className='align-items-center'>
                <Label xl={3} for="campaignSelector" className={required ? 'required' : ''}>
                    {pageBuilderLabels.campaignName}
                </Label>
                <Col xl={9}>
                    <SearchableDropdown
                        value={value}
                        error={error}
                        placeholder="Select campaign name"
                        searchPlaceholder="Search campaigns..."
                        
                        items={campaignList || []}
                        getItemKey={(campaign) => campaign.CampaignId}
                        getItemLabel={(campaign) => `${campaign.CampaignCode} | ${campaign.CampaignName}`}
                        renderDisplayValue={renderDisplayValue}
                        renderItem={renderCampaignItem}
                        
                        multiSelect={false}
                        onSelectionChange={handleCampaignSelect}
                        
                        showAddNew={isModifyCampaign}
                        onAddNew={handleAddCampaign}
                        addNewLabel="Add New Campaign..."
                        addNewIcon="fa fa-plus"
                        
                        filterItems={filterCampaigns}
                        
                        maxHeight={300}
                        className="w-100"
                        closeOnSelect={true}
                    >
                        {/* Empty states */}
                        {(!campaignList || campaignList.length === 0) && (
                            <div className="dropdown-item-text text-muted">
                                <em>No campaigns available</em>
                            </div>
                        )}
                    </SearchableDropdown>
                </Col>
            </Row>
            
            {/* Add New Campaign Modal */}
            <AddNewCampaignModal 
                isOpen={isAddCampaignModalOpen}
                toggle={handleAddCampaignModalToggle}
                onAddCampaign={handleNewCampaignAdded}
            />
        </FormGroup>
    );
};

function mapStateToProps({ campaignList, claimsPrincipal }) {
    const isModifyCampaign = claimsPrincipal.hasWriteClaim(claimResource.AllCampaigns);

    return Object.assign({}, { campaignList, isModifyCampaign });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateFormField, fetchDeals, clearValidationErrors }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(CampaignSelector));
