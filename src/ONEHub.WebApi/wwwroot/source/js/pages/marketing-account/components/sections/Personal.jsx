import React from 'react';
import { Form, FormGroup, Label, Input, Col } from 'reactstrap';
import RowField from './RowField';

export const Personal = (props) => {
    const { personalInfo, setPersonalInfo } = props;

    const safePersonalInfo = personalInfo || {};
    
    const isMale = safePersonalInfo.gender === 'true' || safePersonalInfo.gender === true;
    const onChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo({
            ...safePersonalInfo,
            [name]: value
        });
    }

    const _renderGenderForm = () => {
        return (
            <FormGroup row>
                <Label sm={3}>Gender</Label>
                <Col sm={4} className="gender-group">
                    <FormGroup check className="d-inline-block mr-3">
                        <Label check>
                            <Input name="gender" type="radio" checked={isMale} onChange={onChange} value={true}/>{' '} Male
                        </Label>
                    </FormGroup>
                    <FormGroup check className="d-inline-block">
                        <Label check>
                            <Input name="gender" type="radio" checked={!isMale} onChange={onChange} value={false}/>{' '} Female
                        </Label>
                    </FormGroup>
                </Col>
            </FormGroup>
        )
    }

    return (
        <fieldset>
            <legend><h6 className="font-weight-bold">Personal Information</h6></legend>
            <Form>
            
                <RowField
                    label="First Name"
                    name="firstName"
                    value={safePersonalInfo.firstName}
                    onChange={onChange}
                />
                <RowField
                    label="Last Name"
                    name="lastName"
                    value={safePersonalInfo.lastName}
                    onChange={onChange}
                />
                {_renderGenderForm()}
                <RowField
                    label="Email Address"
                    name="email"
                    value={safePersonalInfo.email}
                    onChange={onChange}
                    labelProps={{ className: 'required' }}
                />
                <RowField
                    label="Contact Number"
                    name="phone"
                    value={safePersonalInfo.phone}
                    onChange={onChange}
                />
            </Form>
        </fieldset>
    );
};

export default React.memo(Personal);