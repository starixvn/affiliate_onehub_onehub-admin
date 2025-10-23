import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Row } from 'reactstrap';

import { resolveClientUrl } from '../../../modules/utils';
import { getGeneralInfo } from '../actions';
import { format } from '../../../modules/numberFormat';

export class TasksWaitingForApproval extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getGeneralInfo();
    }

    render() {
        const { generalInfo } = this.props;

        return (
            <div className="waiting-approval">
                <Row>
                    <span className="home-title">Tasks waiting for approval</span>
                    <Col sm={12} className="background-gray">
                        <Col sm={3} className="text-border">
                            <span><strong>Affiliate</strong></span>
                        </Col>
                        <Col sm={2} className="text-border">
                            <a href={resolveClientUrl("Portal/Affiliate?Status=Pending&IsFromHome=true")}><strong>{format(generalInfo.PendingAllNum)}</strong></a>
                        </Col>
                        <Col sm={5} className="text-border">
                            <span><strong>Payment Request</strong></span>
                        </Col>
                        <Col sm={2} className="text-border">
                            <a href={resolveClientUrl("Portal/PaymentRequest?SearchBy=2&Status=Processing&FromDate=01/01/2020&IsFromHome=true")}><strong>{format(generalInfo.PaymentReqNum)}</strong></a>
                        </Col>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps({ generalInfo }) {
    return Object.assign({}, { generalInfo });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getGeneralInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksWaitingForApproval);