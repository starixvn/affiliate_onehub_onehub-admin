import React from 'react';

import SearchableDropdown from '@/components/SearchableDropdown';
import ImageHoverPreview from './ImageHoverPreview';

const SingleSourceSelector = ({ 
    value, 
    error, 
    sources, 
    isDisabled, 
    onChange,
    bannerRootUrl,
    className = ""
}) => {
    // Handle selection change from SearchableDropdown
    const handleSelectionChange = (selectedId) => {
        // Create synthetic event object to match expected onChange signature
        const syntheticEvent = {
            target: { value: selectedId }
        };
        onChange(syntheticEvent);
    };

    // Custom display value renderer
    const renderDisplayValue = (selectedValue) => {
        if (isDisabled) return 'Please select module first';
        
        // Handle both string and number comparisons for MediaId
        const selectedSource = sources.find(s => s.MediaId == selectedValue);
        return selectedSource ? selectedSource.MediaName : 'Please select...';
    };

    // Custom filter function
    const filterSources = (items, searchTerm) => {
        return items.filter(source => 
            source.MediaName && source.MediaName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Custom item renderer for sources with images
    const renderSourceItem = (source, isSelected, onSelect, itemKey) => {
        return (
            <div
                key={itemKey}
                onClick={() => onSelect(!isSelected)} // Fixed: should toggle, so pass !isSelected
                className={`dropdown-item d-flex align-items-center ${isSelected ? 'active' : ''}`}
                style={{ 
                    cursor: 'pointer', 
                    border: 'none', 
                    backgroundColor: 'transparent',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.375rem 1.5rem'
                }}
            >
                {source.FileName ? (
                    <ImageHoverPreview
                        src={`${bannerRootUrl}/${source.FileName}`}
                        alt={source.MediaName}
                        maxPreviewSize={{ width: 400, height: 300 }}
                        className="d-flex align-items-center w-100"
                    >
                        <span 
                            className="me-auto text-truncate" 
                            style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
                            title={source.MediaName}
                        >
                            {source.MediaName}
                        </span>
                        <img 
                            src={`${bannerRootUrl}/${source.FileName}`} 
                            alt={source.MediaName}
                            className="ml-2 flex-shrink-0"
                            style={{ 
                                maxWidth: '50px',
                                maxHeight: '24px',
                                objectFit: 'cover', 
                                cursor: 'pointer',
                                borderRadius: '3px',
                                border: '1px solid #dee2e6'
                            }}
                        />
                    </ImageHoverPreview>
                ) : (
                    <span 
                        className="me-auto text-truncate" 
                        style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
                        title={source.MediaName}
                    >
                        {source.MediaName}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="source-selector">
            <SearchableDropdown
                value={value}
                error={error}
                isDisabled={isDisabled}
                placeholder="Please select..."
                searchPlaceholder="Search sources..."
                
                items={sources}
                getItemKey={(source) => source.MediaId}
                getItemLabel={(source) => source.MediaName}
                renderDisplayValue={renderDisplayValue}
                renderItem={renderSourceItem}
                
                multiSelect={false}
                onSelectionChange={handleSelectionChange}
                
                filterItems={filterSources}
                
                maxHeight={300}
                className={`w-100 ${className}`}
                closeOnSelect={true}
            />
        </div>
    );
};

export default SingleSourceSelector;
