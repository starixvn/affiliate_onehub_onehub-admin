import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup } from 'reactstrap';

import { updateModuleComponent, fetchModuleSources } from '../../actions';
import SingleSourceSelector from './source-selectors/SingleSourceSelector';
import TextInputSelector from './source-selectors/TextInputSelector';
import MultiSelectDropdown from './source-selectors/MultiSelectDropdown';
import DualInputSelector from './source-selectors/DualInputSelector';

const SourceSelector = ({ 
    moduleId, 
    selectedModuleId, 
    value, 
    error, 
    allSources, 
    moduleList, 
    moduleComponents, 
    bannerRootUrl,
    formData,
    updateModuleComponent, 
    fetchModuleSources 
}) => {
    useEffect(() => {
        if (selectedModuleId) {
            fetchModuleSources(
                selectedModuleId, 
                formData?.targetCountryCode, 
                formData?.languageCode
            );
        }
    }, [selectedModuleId, formData?.targetCountryCode, formData?.languageCode, fetchModuleSources]);

    const isDisabled = !selectedModuleId;
    const sources = selectedModuleId ? allSources[selectedModuleId] || [] : [];
    const currentModule = moduleComponents.find(m => m.id === moduleId);
    const selectedModuleInfo = moduleList.find(m => m.ModuleId === selectedModuleId);
    
    const isMultipleUpload = selectedModuleInfo?.IsMultipleUpload;
    const selectedModuleType = selectedModuleInfo?.ModuleType;
    const isYoutubeModule = selectedModuleType === 4;
    const isContactUsModule = selectedModuleType === 2;
    const isLoginBtnModule = selectedModuleType === 5;
    
    const forceMultiSelectModules = ['hero image', 'favorite games', 'provider', 'promo list'];
    const shouldBeMultiSelect = forceMultiSelectModules.some(name => 
        selectedModuleInfo?.ModuleName?.toLowerCase().includes(name.toLowerCase())
    );
    const finalIsMultipleUpload = isMultipleUpload || shouldBeMultiSelect;

    const handleSingleSelect = useCallback((event) => {
        const mediaId = event.target.value || null;
        updateModuleComponent(moduleId, 'mediaId', mediaId);
    }, [updateModuleComponent, moduleId]);

    const handleExtraInfoInput = useCallback((event) => {
        const extraInfo = event.target.value || null;
        updateModuleComponent(moduleId, 'extraInfo', extraInfo);
    }, [updateModuleComponent, moduleId]);

    const handleYouTubeInput = useCallback((event) => {
        const url = event.target.value || null;
        updateModuleComponent(moduleId, 'extraInfo', url);
    }, [updateModuleComponent, moduleId]);

    const handleMultipleSelect = useCallback((sourceId, isChecked) => {
        const currentValues = Array.isArray(value) ? value : [];
        let newValues;
        
        if (isChecked) {
            newValues = [...currentValues, sourceId];
        } else {
            newValues = currentValues.filter(id => id !== sourceId);
        }
        
        updateModuleComponent(moduleId, 'mediaId', newValues.length > 0 ? newValues : null);
    }, [updateModuleComponent, moduleId, value]);

    const handleSelectAllSources = useCallback(() => {
        const currentValues = Array.isArray(value) ? value : [];
        const allSourceIds = sources.map(source => source.MediaId);
        
        const allSelected = allSourceIds.every(sourceId => currentValues.includes(sourceId));
        
        if (allSelected) {
            const newValues = currentValues.filter(sourceId => !allSourceIds.includes(sourceId));
            updateModuleComponent(moduleId, 'mediaId', newValues.length > 0 ? newValues : null);
        } else {
            const newValues = [...new Set([...currentValues, ...allSourceIds])];
            updateModuleComponent(moduleId, 'mediaId', newValues);
        }
    }, [value, sources, updateModuleComponent, moduleId]);

    if (isContactUsModule) {
        return (
            <DualInputSelector
                moduleId={moduleId}
                value={value}
                extraValue={currentModule?.extraInfo}
                error={error}
                sources={sources}
                isDisabled={isDisabled}
                onSourceChange={handleSingleSelect}
                onExtraChange={handleExtraInfoInput}
                extraPlaceholder="contact link"
                extraLabel="Contact"
                bannerRootUrl={bannerRootUrl}
            />
        );
    }

    if (isLoginBtnModule) {
        return (
            <DualInputSelector
                moduleId={moduleId}
                value={value}
                extraValue={currentModule?.extraInfo}
                error={error}
                isLoginBtnModule={isLoginBtnModule}
                sources={sources}
                isDisabled={isDisabled}
                onSourceChange={handleSingleSelect}
                onExtraChange={handleExtraInfoInput}
                extraPlaceholder="path"
                extraLabel="Login Endpoint"
                bannerRootUrl={bannerRootUrl}
            />
        );
    }

    if (isYoutubeModule) {
        return (
            <TextInputSelector
                moduleId={moduleId}
                value={currentModule?.extraInfo}
                error={error}
                isDisabled={isDisabled}
                onChange={handleYouTubeInput}
                placeholder="https://www.youtube.com/watch?v="
            />
        );
    }

    if (finalIsMultipleUpload) {
        return (
            <MultiSelectDropdown
                moduleId={moduleId}
                value={value}
                error={error}
                sources={sources}
                isDisabled={isDisabled}
                bannerRootUrl={bannerRootUrl}
                onMultipleSelect={handleMultipleSelect}
                onSelectAll={handleSelectAllSources}
            />
        );
    }

    return (
        <div className="source-selector">
            <FormGroup>
                <SingleSourceSelector
                    moduleId={moduleId}
                    value={value}
                    error={error}
                    sources={sources}
                    isDisabled={isDisabled}
                    onChange={handleSingleSelect}
                    bannerRootUrl={bannerRootUrl}
                />
            </FormGroup>
        </div>
    );
};

function mapStateToProps({ sources, moduleList, moduleComponents, bannerRootUrl, formData }) {
    return Object.assign({}, { allSources: sources, moduleList, moduleComponents, bannerRootUrl, formData });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateModuleComponent, fetchModuleSources }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SourceSelector));