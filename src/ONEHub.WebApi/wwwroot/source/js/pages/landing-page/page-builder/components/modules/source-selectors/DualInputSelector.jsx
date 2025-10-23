import React from 'react';
import { Input, Label, FormGroup } from 'reactstrap';
import SingleSourceSelector from './SingleSourceSelector';

const DualInputSelector = ({ 
    moduleId, 
    value, 
    extraValue,
    error, 
    sources, 
    isDisabled, 
    onSourceChange,
    onExtraChange,
    extraPlaceholder = "extra info",
    extraLabel = "Extra Info",
    extraRequired = true,
    isLoginBtnModule,
    bannerRootUrl
}) => {
    return (
        <div className="source-selector">
            {/* Source Selection Dropdown */}
            <FormGroup>
                <SingleSourceSelector
                    moduleId={moduleId}
                    value={value}
                    error={error}
                    sources={sources}
                    isDisabled={isDisabled}
                    onChange={onSourceChange}
                    bannerRootUrl={bannerRootUrl}
                    className="mb-2"
                />
            </FormGroup>
            
            {/* Extra Info Input */}
            {
                !isLoginBtnModule && (
                <FormGroup>
                    <Label for={`extra-info-${moduleId}`}>
                        {extraLabel}
                        {extraRequired && <span className="text-danger ms-1">*</span>}
                    </Label>
                    <Input
                        id={`extra-info-${moduleId}`}
                        key={`moduleId-extra-info-${moduleId}`}
                        type="text"
                        placeholder={extraPlaceholder}
                        value={extraValue || ''}
                        onChange={onExtraChange}
                        invalid={!!error}
                        disabled={isDisabled}
                    />
                </FormGroup>
            )}
        </div>
    );
};

export default DualInputSelector;
