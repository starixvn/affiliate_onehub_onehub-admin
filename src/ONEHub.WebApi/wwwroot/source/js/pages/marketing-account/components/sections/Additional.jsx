import React from 'react';
import { Form } from 'reactstrap';
import { countriesList } from '../../../user-panel/user-account/modules/constants';
import RowField from './RowField';

export const Additional = (props) => {
    const { additionalInfo, setAdditionalInfo } = props;

    const safeAdditionalInfo = additionalInfo || {};

    const contriesOption = Object.keys(countriesList).map((key) => {
        return {
            label: countriesList[key],
            value: key
        }
    })

    const onChange = (e) => {
        setAdditionalInfo({
            ...safeAdditionalInfo,
            [e.target.name]: e.target.value
        });
    }

    return (
        <fieldset>
            <legend><h6 className="font-weight-bold">Additional Information</h6></legend>
            <Form>
                <RowField
                    label="Address"
                    name="address"
                    value={safeAdditionalInfo.address}
                    onChange={onChange}
                />
                <RowField
                    label="City"
                    name="city"
                    value={safeAdditionalInfo.city}
                    onChange={onChange}
                />
                <RowField
                    label="State"
                    name="state"
                    value={safeAdditionalInfo.state}
                    onChange={onChange}
                />
                <RowField
                    label="Postcode/Zip"
                    name="postcode"
                    value={safeAdditionalInfo.postcode}
                    onChange={onChange}
                />
                <RowField
                    label="Country"
                    name="country"
                    value={safeAdditionalInfo.country}
                    onChange={onChange}
                    selectOptions={contriesOption}
                />
                <RowField
                    label="Security Question"
                    name="question"
                    value={safeAdditionalInfo.question}
                    onChange={onChange}
                    colComponent={
                        <p className="form-control-plaintext" style={{ fontSize: '0.7rem' }}>{safeAdditionalInfo.question}</p>
                    }
                />
                <RowField
                    label="Answer"
                    name="answer"
                    value={safeAdditionalInfo.answer}
                    onChange={onChange}
                    colComponent={
                        <p className="form-control-plaintext" style={{ fontSize: '0.7rem' }}>{safeAdditionalInfo.answer}</p>
                    }
                />
                
            </Form>
        </fieldset>
    );
}

export default React.memo(Additional);
