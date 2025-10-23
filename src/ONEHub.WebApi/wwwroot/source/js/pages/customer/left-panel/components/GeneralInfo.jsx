import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button } from 'reactstrap';

import { statusForSuspend, resource } from '../libs/constants';
import { htmlDecode } from '../../../../modules/htmlHelper';
import Language from './general-info/Language';
import ContactApp from './general-info/ContactApp';
import ApprovedStatusInfo from './general-info/ApprovedStatusInfo';
import { setAffName } from '../actions';
import { getAffiliateInfo } from '../../mainpage/actions/loadingDataAction';

export const GeneralInfo = (props) => {
    const { affiliateInfo } = props;
    const status = affiliateInfo.Status.toLowerCase();
    const isApproved = status === statusForSuspend.Approved || status === statusForSuspend.Suspended;
    const siteUrl = htmlDecode(affiliateInfo.SiteUrl.indexOf('http://') === -1 ? 'http://' + affiliateInfo.SiteUrl : affiliateInfo.SiteUrl);

    const _handleClickParentAffiliate = (parentAffName) => {
        props.setAffName(parentAffName);
        props.getAffiliateInfo(parentAffName);
    }

    return (
        <div className="general-info pt-2">
            <Row className="border-0 py-1">
                <Col sm={5}>{resource.ParentAffiliate}</Col>
                <Col sm={7} className='text-right d-inline-block'>
                    <Button color="link" className="p-0" onClick={() => _handleClickParentAffiliate(affiliateInfo.ParentAffName)}>
                        {affiliateInfo.ParentAffName}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.Affiliate}</Col>
                <Col sm={7} className='text-right d-inline-block'>
                    {
                        isApproved ?
                            (<a href={affiliateInfo.AffLink} target='_blank'>{affiliateInfo.AffName}</a>) :
                            (<span>{affiliateInfo.AffName}</span>)
                    }
                </Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.AffiliateCode}</Col>
                <Col sm={7} className='text-right'>{affiliateInfo.AffCode}</Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.FirstName}</Col>
                <Col sm={7} className='text-right'>{htmlDecode(affiliateInfo.FirstName)}</Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.LastName}</Col>
                <Col sm={7} className='text-right'>{htmlDecode(affiliateInfo.LastName)}</Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.Gender}</Col>
                <Col sm={7} className='text-right'>{affiliateInfo.Gender === null ? '' : (affiliateInfo.Gender ? resource.Male : resource.Female)}</Col>
            </Row>
            <Row>
                <Col sm={5} className="pr-0">{resource.ContactNumber}</Col>
                <Col sm={7} className='text-right'>{htmlDecode(affiliateInfo.Phone)}</Col>
            </Row>
            <ContactApp />
            <Row>
                <Col sm={5}>{resource.ApprovedBy}</Col>
                <Col sm={7} className='text-right'>{htmlDecode(affiliateInfo.ApprovedBy) || 'N/A'}</Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.TargetCountry}</Col>
                <Col sm={7} className='text-right'>{htmlDecode(affiliateInfo.TargetCountryName)}</Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.Language}</Col>
                <Col sm={7} className='text-right text-primary'><Language /></Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.WebsiteUrl}</Col>
                <Col sm={7} className='text-right text-truncate'>
                    <a target='_blank' title={siteUrl} href={`http://anonym.to/?${siteUrl}`}>
                        {htmlDecode(affiliateInfo.SiteUrl.replace('http://', '').replace('www.', ''))}
                    </a>
                </Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.LastLogin}</Col>
                <Col sm={7} className='text-right'>{affiliateInfo.LastLoginDateText}</Col>
            </Row>
            <Row>
                <Col sm={5}>{resource.LastLoginIp}</Col>
                <Col sm={7} className='text-right'>
                    <a target='_blank' href={`http://anonym.to/?http://legacytools.dnsstuff.com/tools/ipall.ch?tool_id=67&token=&toolhandler_redirect=0&ip=${affiliateInfo.LastLoginIp}&j=1`}>
                        {affiliateInfo.LastLoginIp}
                    </a>
                </Col>
            </Row>
            {
                isApproved && <ApprovedStatusInfo />
            }
        </div>
    )
}

function mapStateToProps({ leftPanel }) {
    const { affiliateInfo } = leftPanel;
    return Object.assign({}, { affiliateInfo });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAffiliateInfo, setAffName }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(GeneralInfo));