import React, { Fragment } from 'react';
import { FormGroup } from 'reactstrap';
import { format } from '../../../../libs/revenue-share-constants';

export const DeductedPercentageGroup = (props) => {

    const { value, valueList, label, onChange } = props;
    return (
        <Fragment>
            <FormGroup className="mr-2">
                <select name="DeductedPercentage" className="form-control"
                    value={format(value || 0, 3)}
                    onChange={onChange} style={{ width: 70 }}>
                    {
                        Object.keys(valueList).map((key, i) => {
                            return (<option key={`deducted-percentage-${i}`} value={key}>{valueList[key]}</option>);
                        })
                    }
                </select>
            </FormGroup>
            <div className="x-group">
                <label className="ml-3 x-content">{label}</label>
            </div>
        </Fragment>
    )
}

export default React.memo(DeductedPercentageGroup);