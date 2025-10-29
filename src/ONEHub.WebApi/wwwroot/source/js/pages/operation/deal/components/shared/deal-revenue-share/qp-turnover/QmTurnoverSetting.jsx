import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, Label, Input } from 'reactstrap';

import { setDealInfo } from '../../../../actions';
import { format } from '../../../../../../../modules/numberFormat';
import { isValidNumber } from '../../../../../../../modules/utils';
import { money } from '../../../../../../../modules/constants';

export const QmTurnoverSetting = (props) => {
    const handleChange = (event) => {
        const { name, value } = event.target;
        const textValue = value.replace(/,/g, '');
        const numberValue = Number(textValue);
        const isValid = isValidNumber(numberValue);

        if (isValid && numberValue <= money.AllowedMaxValue) {
            props.setDealInfo({ [name]: numberValue });
        }
    }

    const { QmTurnover } = props.dealInfo;

    return (
        <fieldset>
            <legend><h6 className="font-weight-bold">QP Turnover</h6></legend>
            <p>A member is considered a Qualified Player (QP) when his/her turnover in a month is equivalent to</p>
            <Form inline>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="QmTurnover" className="mr-sm-2">USD</Label>
                    <Input name="QmTurnover" id="QmTurnover" value={format(QmTurnover)}
                        onChange={handleChange} />
                </FormGroup>
            </Form>
        </fieldset>
    )
}

const mapStateToProps = ({ dealInfo }) => {
    return { dealInfo };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setDealInfo }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(QmTurnoverSetting));