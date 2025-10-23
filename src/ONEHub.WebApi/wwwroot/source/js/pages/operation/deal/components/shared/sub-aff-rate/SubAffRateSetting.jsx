import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { FormGroup, Label, Col, Input } from 'reactstrap';

import { setDealInfo } from '../../../actions';
import { subAffRateValueList, defaultSubAffRate } from '../../../libs/constants';
import { format } from '../../../../../../modules/numberFormat';

export const SubAffRateSetting = (props) => {
    const { SubCommRate } = props;

    const _handleChangeCommRate = (event) => {
        const { value } = event.target;
        props.setDealInfo({ SubCommRate: Number(value) });
    }

    return (
        <fieldset>
            <legend><h6 className="font-weight-bold">Sub-Affiliate Rate</h6></legend>
            <FormGroup row className='align-items-center'>
                <Label htmlFor='SubCommRate' sm={2}>Fixed Rate</Label>
                <Col sm={3}>
                    <Input type="select"
                        className="form-control"
                        name="SubCommRate"
                        id='SubCommRate'
                        value={format(SubCommRate || defaultSubAffRate, 3)}
                        onChange={_handleChangeCommRate}>
                        {
                            Object.keys(subAffRateValueList).map((key, i) => {
                                return (<option key={`sub-aff-fixed-rate-${i}`} value={key}>{subAffRateValueList[key]}</option>);
                            })
                        }
                    </Input>
                </Col>
            </FormGroup>
        </fieldset>
    );
};

const mapStateToProps = ({ dealInfo }) => {
    const { SubCommRate } = dealInfo;
    return {
        SubCommRate
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setDealInfo
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SubAffRateSetting));