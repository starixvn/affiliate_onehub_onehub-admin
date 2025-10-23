import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, FormGroup, Button, Col } from 'reactstrap';

import DealInfo from '../shared/DealInfo';
import DealPanel from '../shared/DealPanel';

import SubAffRateSetting from '../shared/sub-aff-rate';
import { messages, DEAL_HYBRID, DEAL_HYBRID_CPA_SECTION, DEAL_HYBRID_REVENUE_SHARE_SECTION } from '../../libs/constants';
import { dealPanelKey } from '../../libs/deal-panels';
import { setDealInfo, toggleLoader, addDeal, setParam, getDealDetail } from '../../actions';
import { buildDefaultDealInfo, validateDealInfo, _handleSaveParam } from '../../libs/service';

export const AddDeal = (props) => {

    const { dealId } = props;
    const [isShowMessage, setIsShowMessage] = useState(false);
    const [message, setMessage] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [activePanelWhenHasInvalid, setActivePanelWhenHasInvalid] = useState({ panel: dealPanelKey.cpa });

    useEffect(() => {
        if (dealId) {
            props.getDealDetail(dealId);
        } else {
            const newDealInfo = buildDefaultDealInfo(props.targetCountryList);
            props.setDealInfo(newDealInfo);
        }
    }, [dealId]);

    const _handleSave = async () => {
        const { dealInfo } = props;

        const { isValid, messageList } = validateDealInfo(dealInfo, props.today, true);
        if (!isValid) {
            if (dealInfo.DealType === DEAL_HYBRID) {
                const hasInvalidCPA = messageList.some(m => m.includes(DEAL_HYBRID_CPA_SECTION));
                const hasInvalidRevenueShare = messageList.some(m => m.includes(DEAL_HYBRID_REVENUE_SHARE_SECTION));

                const panel = hasInvalidCPA
                    ? dealPanelKey.cpa
                    : hasInvalidRevenueShare
                        ? dealPanelKey.revenueShare
                        : dealPanelKey.cpa;

                setActivePanelWhenHasInvalid({ panel });
            }
            _handleShowMessage(false, messageList);
        } else {
            if (dealInfo.DealType === DEAL_HYBRID) {
                setActivePanelWhenHasInvalid({ panel: dealPanelKey.cpa });
            }
            props.toggleLoader(true);
            const param = _handleSaveParam(dealInfo);

            const response = await props.addDeal(param);
            if (response && response.status === 200) {
                const result = response.data;
                if (result.IsSuccessful) {
                    setTimeout(props.onClose, 3000);
                    const { pagingOption, param } = props;
                    const gettingParam = {
                        ...param,
                        PageIndex: pagingOption.PageIndex,
                        PageSize: pagingOption.PageSize,
                    };
                    props.setParam(gettingParam);
                }

                _handleShowMessage(result.IsSuccessful, [result.IsSuccessful ? messages.addDealSuccessfully : result.Message]);
            }

            props.toggleLoader(false);
        }
        setTimeout(props.onSave, 100);
    }

    const _handleShowMessage = (isSuccess, message) => {
        setIsShowMessage(true);
        setIsSuccess(isSuccess);
        setMessage(message);
    }

    return props.dealInfo && (
        <React.Fragment>
            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                <div dangerouslySetInnerHTML={{ __html: message.join('<br>') }}></div>
            </Alert>
            <DealInfo />
            <SubAffRateSetting />
            <DealPanel dealType={props.dealInfo.DealType} activePanelWhenHasInvalid={activePanelWhenHasInvalid} />
            <FormGroup row inline className="align-items-center">
                <Col sm={1}>
                    <Button type="button"
                        className="my-2 btn btn-success btn-save"
                        onClick={_handleSave}
                        disabled={isSuccess}>
                        SAVE
                    </Button>
                </Col>
                <Col sm={1}>
                    <Button type="button"
                        className="my-2 btn btn-info btn-cancel"
                        onClick={props.onClose}>
                        CANCEL
                    </Button>
                </Col>
            </FormGroup>
        </React.Fragment>
    )
}

const mapStateToProps = ({ dealInfo, pagingOption, targetCountryList, param, today }) => {
    return {
        dealInfo,
        targetCountryList,
        pagingOption,
        param,
        today
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setDealInfo,
        toggleLoader,
        addDeal,
        setParam,
        getDealDetail
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AddDeal));