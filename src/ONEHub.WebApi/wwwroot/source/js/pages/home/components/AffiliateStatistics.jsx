import React from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';

import Panel from './Panel';
import { resolveClientUrl } from '../../../modules/utils';
import { format } from '../../../modules/numberFormat';

export const AffiliateStatistics = (props) => {

    const { isUpToNow, generalInfo } = props;

    return (
        <Panel heading={`Affiliate statistics (${isUpToNow ? 'up to now' : 'this month'})`} className={"icon-home01"}>
            <Row>
                <Col sm={12} className="pl-4">
                    <span>We have <strong>{format(isUpToNow ? generalInfo.AffInProAllNum : generalInfo.AffInProMonthNum)}</strong> affiliates in the program</span>
                </Col>
                <Col sm={12} className="pl-4">
                    {
                        isUpToNow ? (
                            <span>
                                <a href={resolveClientUrl("Portal/Affiliate?Status=Pending&IsFromHome=true")}><strong>{format(generalInfo.PendingAllNum)}</strong></a>{' Pending / '}
                                <a href={resolveClientUrl("Portal/Affiliate?Status=Approved&IsFromHome=true")}><strong>{format(generalInfo.ApprovedAllNum)}</strong></a>{' Approved / '}
                                <a href={resolveClientUrl("Portal/Affiliate?Status=Disapproved&IsFromHome=true")}><strong>{format(generalInfo.DisapprovedAllNum)}</strong></a>{' Disapproved / '}
                                <a href={resolveClientUrl("Portal/Affiliate?Status=Suspended&IsFromHome=true")}><strong>{format(generalInfo.SuspendedAllNum)}</strong></a> Suspended
                            </span>
                        ) : (
                                <span>
                                    <strong>{format(generalInfo.PendingMonthNum)}</strong> Pending / <strong>{format(generalInfo.ApprovedMonthNum)}</strong> Approved / <strong>{format(generalInfo.DisapprovedMonthNum)}</strong> Disapproved / <strong>{format(generalInfo.SuspendedMonthNum)}</strong> Suspended
                                </span>
                            )
                    }
                </Col>
            </Row>
        </Panel>
    );
}

function mapStateToProps({ generalInfo }) {
    return Object.assign({}, { generalInfo });
}

export default connect(mapStateToProps)(React.memo(AffiliateStatistics));