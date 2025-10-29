import React, { useState } from 'react';
import { Input, Modal, ModalHeader, ModalBody, Form, FormGroup, Button } from 'reactstrap';
import { urlFormatExampleImage } from '../../../libs/urlFormatExampleImage';
import { showConfirmToast } from '@/pages/common/components/Toast';

const TextInputSelector = ({ 
    moduleId, 
    value, 
    error, 
    isDisabled, 
    onChange,
    placeholder = "",
    className = ""
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const toggle = () => {
        if (showTooltip) {
            setShowTooltip(false);
        } else {
            showConfirmToast({
                title: "How to insert YouTube link?",
                content: ["You need to use the YouTube embed link to ensure it works properly.",
                    `<img 
                        src=${urlFormatExampleImage}
                        alt="YouTube embed link"
                        style="max-Width: 600px"
                    />`
                ],
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
        }
    };
    
    return (
        <div className="source-selector">
            <FormGroup>
                <div className="d-flex align-items-center" style={{ width: '100%' }}>
                    <Input
                        id={`text-input-${moduleId}`}
                        key={`moduleId-text-${moduleId}`}
                        type="text"
                        placeholder={placeholder || "Please enter URL"}
                        value={value || ''}
                        onChange={onChange}
                        invalid={!!error}
                        disabled={isDisabled}
                        className={`${className} flex-grow-1`}
                    />
                    <div 
                        className="position-relative rounded-circle note-info"
                        onClick={toggle}
                        style={{ cursor: 'pointer', marginLeft: '8px', flexShrink: 0 }}
                    >
                        <span class="oi oi-info"></span>
                    </div>
                </div>
            </FormGroup>
        </div>
    );
};

export default TextInputSelector;
