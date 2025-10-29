import React from 'react';
import { FormGroup, Col, Button } from 'reactstrap';

import DealInfo from '../deal/components/shared/DealInfo';
import SubAffRateSetting from '../deal/components/shared/sub-aff-rate/SubAffRateSetting';
import DealPanel from '../deal/components/shared/DealPanel';

export const ViewDeal = (props) => {
    return (
        <React.Fragment>
            <DealInfo />
            <SubAffRateSetting />
            <DealPanel dealType={props.dealType} />
            <FormGroup row inline className="align-items-center">
                <Col sm={1}>
                    <Button type="button" className="my-2 btn-close" onClick={props.onClose}>CLOSE</Button>
                </Col>
            </FormGroup>
        </React.Fragment>
    );
}

export default React.memo(ViewDeal);