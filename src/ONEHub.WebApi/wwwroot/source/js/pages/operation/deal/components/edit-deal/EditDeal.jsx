import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, FormGroup, Button, Col } from 'reactstrap';

import DealInfo from '../shared/DealInfo';
import SubAffRateSetting from '../shared/sub-aff-rate';
import DealPanel from '../shared/DealPanel';

import { messages, DEAL_HYBRID, DEAL_HYBRID_CPA_SECTION, DEAL_HYBRID_REVENUE_SHARE_SECTION } from '../../libs/constants';
import { dealPanelKey } from '../../libs/deal-panels';
import { getDealDetail, toggleLoader, updateDeal, setParam } from '../../actions';
import { validateDealInfo, _handleSaveParam } from '../../libs/service';

export const EditDeal = (props) => {

    const [isShowMessage, setIsShowMessage] = useState(false);
    const [message, setMessage] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [activePanelWhenHasInvalid, setActivePanelWhenHasInvalid] = useState({ panel: dealPanelKey.cpa });

    useEffect(() => {
        if (props.dealId) {
            props.getDealDetail(props.dealId);
        }
    }, [props.dealId]);

    const _handleSave = async () => {
        const { dealInfo } = props;

        const { isValid, messageList } = validateDealInfo(dealInfo, props.today, false);

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

            const response = await props.updateDeal(param);
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

                _handleShowMessage(result.IsSuccessful, [result.IsSuccessful ? messages.updateDealSuccessfully : result.Message]);
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
                {
                    props.isModifiable ? (
                        <React.Fragment>
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
                                    className="my-2 btn btn-info"
                                    onClick={props.onClose}>
                                    CANCEL
                                </Button>
                            </Col>
                        </React.Fragment>
                    ) : (
                        <Col sm={1}>
                            <Button type="button" className="my-2 btn-close" onClick={props.onClose}>CLOSE</Button>
                        </Col>
                    )
                }
            </FormGroup>
        </React.Fragment>
    )
}

const mapStateToProps = ({ dealInfo, pagingOption, targetCountryList, param, isModifiable, today }) => {
    return {
        dealInfo,
        targetCountryList,
        pagingOption,
        param,
        isModifiable,
        today
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getDealDetail,
        toggleLoader,
        updateDeal,
        setParam
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(EditDeal));