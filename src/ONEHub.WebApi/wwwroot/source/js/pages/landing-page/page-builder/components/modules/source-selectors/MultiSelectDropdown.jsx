import React from 'react';

import SearchableDropdown from '@/components/SearchableDropdown';
import ImageHoverPreview from './ImageHoverPreview';

const MultiSelectDropdown = ({ 
    value,
    error,
    sources,
    isDisabled,
    onMultipleSelect,
    onSelectAll,
    bannerRootUrl
}) => {
    // Handle selection change from SearchableDropdown
    const handleSelectionChange = (selectedIds) => {
        // For compatibility with existing onMultipleSelect interface
        // We need to determine which items were added or removed
        const currentValue = Array.isArray(value) ? value : [];
        
        // Find newly selected items
        const newlySelected = selectedIds.filter(id => !currentValue.includes(id));
        const newlyDeselected = currentValue.filter(id => !selectedIds.includes(id));
        
        // Call onMultipleSelect for each change (maintaining backward compatibility)
        newlySelected.forEach(id => onMultipleSelect(id, true));
        newlyDeselected.forEach(id => onMultipleSelect(id, false));
    };


    // Custom item renderer for sources with images
    const renderSourceItem = (source, isSelected, onSelect, itemKey) => {
        return (
            <div
                key={itemKey}
                onClick={() => onSelect(!isSelected)} // Fixed: should toggle, so pass !isSelected
                className="dropdown-item d-flex align-items-center"
                style={{ 
                    overflow: 'hidden',
                    maxWidth: '100%',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '0.375rem 1.5rem'
                }}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mr-2"
                />
                {source.FileName ? (
                    <ImageHoverPreview
                        src={`${bannerRootUrl}/${source.FileName}`}
                        alt={source.MediaName}
                        maxPreviewSize={{ width: 400, height: 300 }}
                        className="d-flex align-items-center flex-grow-1"
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

    // Custom display value renderer
    const renderDisplayValue = (selectedValue) => {
        if (isDisabled) return 'Please select module first';
        
        const selectedCount = Array.isArray(selectedValue) ? selectedValue.length : 0;

        if (selectedCount == 1) {
            const selectedItem = sources.find(item => item.MediaId == value);
            return selectedItem ? selectedItem.MediaName : 'Please select...';
        }

        return selectedCount > 0 ? `${selectedCount} selected` : 'Please select...';
    };

    // Custom filter function
    const filterSources = (items, searchTerm) => {
        return items.filter(source => 
            source.MediaName && source.MediaName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
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
                
                multiSelect={true}
                onSelectionChange={handleSelectionChange}
                
                showSelectAll={true}
                onSelectAll={onSelectAll} // Pass the external onSelectAll handler
                filterItems={filterSources}
                
                maxHeight={300}
                className="w-100"
            />
    );
};

export default MultiSelectDropdown;
