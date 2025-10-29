import React from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';

import AppLayout from '../../../layouts/AppLayout';
import Loader from '../../../components/Loader';
import TasksWaitingForApproval from './TasksWaitingForApproval';
import BannerStatistics from './BannerStatistics';
import AffiliateStatistics from './AffiliateStatistics';
import MemberStatistics from './MemberStatistics';
import OnlineList from './OnlineList';

export const AppContainer = (props) => {
    return (
        <AppLayout>
            <Loader show={props.isShowLoader} />
            <div className="pt-2 pb-2">
                Below you see tasks that are waiting for your approval and overview of the affiliate program
            </div>
            <Col xl={7} className="home">
                <Row>
                    <Col sm={6}>
                        <TasksWaitingForApproval />
                    </Col>
                    <Col className="home-right">
                        <BannerStatistics />
                    </Col>
                </Row>
                <Row>
                    <Col className="home-panel" sm={6}>
                        <AffiliateStatistics isUpToNow={true} />
                    </Col>
                    <Col className="home-panel home-right">
                        <AffiliateStatistics isUpToNow={false} />
                    </Col>
                </Row>
                <Row>
                    <Col className="home-panel" sm={6}>
                        <MemberStatistics isUpToNow={true} />
                    </Col>
                    <Col className="home-panel home-right">
                        <MemberStatistics isUpToNow={false} />
                    </Col>
                </Row>
            </Col>
            <OnlineList />
        </AppLayout>
    );
}

function mapStateToProps({ isShowLoader }) {
    return Object.assign({}, { isShowLoader });
}

export default connect(mapStateToProps)(React.memo(AppContainer));