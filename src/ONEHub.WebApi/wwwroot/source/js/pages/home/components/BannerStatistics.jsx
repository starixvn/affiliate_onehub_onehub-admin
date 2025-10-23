import React from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';

import { resolveClientUrl } from '../../../modules/utils';
import { format } from '../../../modules/numberFormat';

export const BannerStatistics = (props) => {

    const { generalInfo } = props;

    return (
        <div className="banner-statistics">
            <Row>
                <span className="home-title">Banner Statistics</span>
            </Row>
            <Row className="background-gray border">
                <Col sm={12}>
                    <span>We have <a href={resolveClientUrl("Portal/MediaGallery?IsFromHome=true")}><strong>{format(generalInfo.BannerNum)}</strong></a> banners in the program</span>
                </Col>
                <Col sm={12}>
                    <span>
                        <a href={resolveClientUrl("Portal/MediaGallery?UserType=1&IsFromHome=true")}><strong>{format(generalInfo.PlayerBannerNum)}</strong></a> Players banners / <a href={resolveClientUrl("Portal/MediaGallery?UserType=2&IsFromHome=true")}><strong>{generalInfo.AffiliateBannerNum}</strong></a> Sub-affiliate banners
                    </span>
                </Col>
            </Row>
        </div>
    )
}

function mapStateToProps({ generalInfo }) {
    return Object.assign({}, { generalInfo });
}

export default connect(mapStateToProps)(React.memo(BannerStatistics));