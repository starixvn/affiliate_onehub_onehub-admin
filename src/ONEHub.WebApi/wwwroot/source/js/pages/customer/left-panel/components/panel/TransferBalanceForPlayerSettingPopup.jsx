import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert, Row } from 'reactstrap'
import { getAffiliateInfo, updateTransferLimitSetting } from '../../actions';
import { messages } from '../../libs/constants';
import { money } from '../../../../../modules/constants';
import { isValidNumber } from '../../../../../modules/utils';
import { format } from '../../../../../modules/numberFormat';

export const TransferBalanceForPlayerSettingPopup = (props) => {
    const { settingInfo, affId, affName } = props;
    const [alertInfo, setAlertInfo] = useState({ isSuccess: true, isShowMessage: false, message: '' });
    const [isEnable, setEnable] = useState(!settingInfo.IsDisabledTransfer);
    const [transferLimit, setTransferLimit] = useState(settingInfo.IsUnlimited ? 0 : settingInfo.TransferLimit);
    const [isUnlimited, setIsUnlimited] = useState(settingInfo.IsUnlimited);

    const isDisabledInput = !isEnable || isUnlimited;

    const handleChange = (event) => {
        const { value } = event.target;
        const textValue = value.replace(/,/g, '');
        const numberValue = Number(textValue);
        const isValid = isValidNumber(numberValue);

        if (isValid && numberValue < money.AllowedMaxValue) {
            setTransferLimit(numberValue);
        }
    }

    const handleSave = async () => {
        const isValid = validateTransferLimit();

        if (isValid) {
            const param = {
                affId,
                disabledTransfer: !isEnable,
                transferLimit: isUnlimited ? money.AllowedMaxValue : transferLimit,
            }

            const result = await props.updateTransferLimitSetting(param)

            if (result.IsSuccessful) {
                _handleShowAlert(true, messages.transferSettingUpdatedSuccess);
            }
            else {
                _handleShowAlert(false, result.Message);
            }
        }
    }

    const validateTransferLimit = () => {
        if (isEnable && !isUnlimited) {
            const isNotValid = !isValidNumber(transferLimit);
            if (isNotValid || transferLimit == 0) {
                _handleShowAlert(false, isNotValid ? 'Limit must be a whole positive number' : 'Daily Limit Per Member is required')
                return false;
            }
        }

        return true;
    }

    const _handleShowAlert = (isSuccess, message) => {
        setAlertInfo({
            message,
            isSuccess,
            isShowMessage: true,
        });

        window.setTimeout(() => _hideMessage(isSuccess), 3000)
    }

    const _hideMessage = (isSuccess) => {
        setAlertInfo({
            isSuccess: isSuccess,
            isShowMessage: false,
            message: ''
        });

        if (isSuccess) {
            props.getAffiliateInfo(affName);
            props.onClose();
        }
    }

    const handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault()
            handleSave();
        }
    }

    return (
        <Modal isOpen={true} toggle={props.onClose} backdrop='static'>
            <ModalHeader toggle={props.onClose}><span className="iconpopup"></span>Edit Transfer Balance For Player Setting</ModalHeader>
            <ModalBody>
                <div className="modal-body-wrapper">
                    <div className="change-password-form-container">
                        <Alert color={alertInfo.isSuccess ? 'success' : 'danger'} isOpen={alertInfo.isShowMessage}>
                            <div dangerouslySetInnerHTML={{ __html: alertInfo.message }}></div>
                        </Alert>
                        <Form tag="form" className="px-4 mb-4" autoComplete="off">
                            <FormGroup row>
                                <Col sm={12}>
                                    <Input type="checkbox" id="isEnable" checked={isEnable} onChange={() => setEnable((isEnable) => !isEnable)} />
                                    <Label htmlFor="isEnable">Enable affiliate to transfer balance for its players</Label>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col sm={5}>
                                    <Label>Linked Player Account</Label>
                                </Col>
                                <Label><strong>{settingInfo.PlayerUsername}</strong></Label>
                            </FormGroup>
                            <FormGroup row className="flex-nowrap">
                                <Col sm={5}>
                                    <Label>Daily Limit Per Member</Label>
                                </Col>
                                <Row>
                                    <Col sm={1}>
                                        <Label>{settingInfo.PlayerCurrency}</Label>
                                    </Col>
                                    <Col sm={7}>
                                        <Input type="text" name="TransferLimit" id="TransferLimit" autoComplete="false" disabled={isDisabledInput}
                                            value={isDisabledInput || !transferLimit ? '' : format(transferLimit)} onKeyPress={handlePressEnter} onChange={handleChange} />
                                    </Col>
                                    <FormGroup check>
                                        <Label check>
                                            <Input checked={isUnlimited} type="checkbox" name="radio2" disabled={!isEnable}
                                                onChange={() => setIsUnlimited((isUnlimited) => !isUnlimited)} />{' '}
                                            Unlimited
                                        </Label>
                                    </FormGroup>
                                </Row>
                            </FormGroup>
                        </Form>
                        <Button className="mr-3" type="button" color="success" onClick={handleSave}>Save</Button>
                        <Button type="button" color="info" onClick={props.onClose}>Cancel</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAffiliateInfo, updateTransferLimitSetting }, dispatch)
}

export default connect(() => ({}), mapDispatchToProps)(React.memo(TransferBalanceForPlayerSettingPopup))