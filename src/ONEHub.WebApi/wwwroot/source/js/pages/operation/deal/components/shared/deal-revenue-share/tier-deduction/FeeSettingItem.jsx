import React, { Fragment } from 'react';

import { Col, FormGroup, Label, Input, Form } from 'reactstrap';
import { regExp, formatDecimal, format, commissionValueList, money } from '../../../../libs/revenue-share-constants';
import DeductedPercentageGroup from './DeductedPercentageGroup';

const regexCheckAmount = new RegExp(regExp.checkAmount);
const regexValidAmount = new RegExp(regExp.validAmount);
const regexShouldFormatAmount = new RegExp(regExp.shouldFormatAmount);

export default class FeeSettingItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const { name, value } = event.target;

        this.props.handleChange({ [name]: Number(value) });
    }

    handleChangeAmount = (event) => {
        if (this.props.isInitial) {
            this.props.handleUpdateState();
        }

        const { name, value } = event.target;

        const amount = value.replace(/,/g, '');
        if (regexCheckAmount.test(amount) && Number(amount) >= 0 && Number(amount) <= money.AllowedMaxValue) {
            if (regexShouldFormatAmount.test(amount)) {
                this.props.handleChange({ [name]: format(Number(amount)) })
            } else {
                this.props.handleChange({ [name]: value });
            }
        }
    }

    handleCheck = (value) => {
        this.props.handleChange({ IsDeductedPercent: value });
    }

    render() {
        const { label, data, basedValueName, isInitial, defaultCurrency } = this.props;
        const isDeductedPercent = data && data.IsDeductedPercent;
        const deductionAmount = isInitial && data && regexValidAmount.test(data.DeductedAmount) && formatDecimal(Number(data.DeductedAmount));
        
        return (
            <FormGroup row className="align-items-center">
                <Label sm={3} className="font-weight-bold">{label}</Label>
                {
                    isDeductedPercent ? (
                        <Fragment>
                            <Col sm={{ size: 4, offset: 1 }}>
                                <Form inline>
                                    <DeductedPercentageGroup
                                        value={data && data.DeductedPercentage}
                                        label={basedValueName}
                                        valueList={commissionValueList}
                                        onChange={this.handleChange} />
                                </Form>
                            </Col>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Col sm={4}>
                                <Form inline>
                                    <FormGroup className="label-group">
                                        <Label className="label-amount">Amount</Label>
                                    </FormGroup>
                                    <FormGroup>
                                        <Input type="text" name="DeductedAmount" className={`form-control ${data && data.DeductedAmount ? '' : 'has-error'}`}
                                            value={deductionAmount || (data && data.DeductedAmount) || ''}
                                            onChange={this.handleChangeAmount} style={{ width: 120 }} />
                                    </FormGroup>
                                </Form>
                            </Col>
                            <Col sm={1}>
                                <p className="deducted-amount"><span className="text-danger required">*</span>{` (${defaultCurrency})`}</p>
                            </Col>
                        </Fragment>
                    )
                }
                <Col sm={3}>
                    <Form inline>
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" checked={!isDeductedPercent} name="IsDeductionPercent"
                                    onChange={() => this.handleCheck(!isDeductedPercent)} /> Fixed Amount
                            </Label>
                        </FormGroup>
                    </Form>
                </Col>
            </FormGroup>
        )
    }
}