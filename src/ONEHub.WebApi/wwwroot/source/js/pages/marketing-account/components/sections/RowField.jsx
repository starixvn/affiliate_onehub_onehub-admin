import React from 'react'
import { Label, Input, Col, FormGroup } from 'reactstrap';

export default function RowField({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
    maxLength,
    selectOptions,
    labelProps = {},
    colProps = {},
    colComponent = null,
    disabled = false
}) {

    return (
        <FormGroup row> 
            <Label htmlFor={name} xs={3} {...labelProps}>{label}</Label>
            <Col xs={5} {...colProps}>
                {
                    colComponent ? colComponent : <Input
                        type={selectOptions ? 'select' : type}
                        name={name}
                        id={label}
                        maxLength={maxLength}
                        onChange={onChange}
                        value={value}
                        placeholder={placeholder}
                        disabled={disabled}
                    >
                        {selectOptions && selectOptions.map((option) => (
                            <option key={option.value} value={option.value} selected={option.value === value}>{option.label}</option>
                        ))}
                    </Input>
                }
            </Col>
        </FormGroup>
    )
}
