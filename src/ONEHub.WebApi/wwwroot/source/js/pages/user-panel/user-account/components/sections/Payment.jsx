import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

import { capitalizeFirstChar } from '../../modules/service';
import { setUserAccountInfo } from '../../actions';
import { playerMethod, moneybookersMethod, wireMethod, minimumPaymentText } from '../../modules/constants';
import { formatDecimal } from '../../../../../modules/numberFormat';

export class Payment extends PureComponent {
    constructor(props) {
        super(props);
    }

    handleChangePaymentMethod = (event) => {
        const newUserAccountInfo = Object.assign({}, this.props.userAccountInfo, { PreferredPayment: event.target.value })
        this.props.setUserAccountInfo(newUserAccountInfo);
    }

    handleChange = (event) => {
        const target = event.target;
        const name = capitalizeFirstChar(target.name);

        const newUserAccountInfo = Object.assign({}, this.props.userAccountInfo, { [name]: target.value })
        this.props.setUserAccountInfo(newUserAccountInfo);
    }

    _renderFormByMethod(userAccountInfo) {
        const isRequired = !userAccountInfo.IsMarketingAccount;
        return {
            [playerMethod]: this._renderPaymentForm('playerUsername', `${this.props.licenseeName} User Name`, userAccountInfo.PlayerUsername, isRequired, this.handleChange),
            [moneybookersMethod]: this._renderPaymentForm('moneybookersEmail', 'Moneybookers Email', userAccountInfo.MoneybookersEmail, isRequired, this.handleChange),
            [wireMethod]: this._renderWireForm(userAccountInfo, isRequired)
        }
    }

    _renderPaymentForm(name, label, inputValue, isRequired, changeHandler) {
        return (
            <FormGroup row>
                <Label for={name} sm={3} xl={2} className={isRequired ? "required" : ""}>{label}</Label>
                <Col sm={5} xl={6} className="input-item">
                    <Input type="text" id={name} name={name} value={inputValue} onChange={changeHandler} />
                </Col>
            </FormGroup>
        )
    }

    _renderWireForm(userAccountInfo, isRequired) {
        return (
            <React.Fragment>
                {this._renderPaymentForm('bankName', 'Wire Name', userAccountInfo.BankName, isRequired, this.handleChange)}
                {this._renderPaymentForm('bankAddress', 'Wire Address', userAccountInfo.BankAddress, isRequired, this.handleChange)}
                {this._renderPaymentForm('bankCode', 'Wire ABA/Swift/Sort Code', userAccountInfo.BankCode, false, this.handleChange)}
                {this._renderPaymentForm('bankAccountName', 'Wire Account Name', userAccountInfo.BankAccountName, isRequired, this.handleChange)}
                {this._renderPaymentForm('bankAccountNumber', 'Wire Account Number', userAccountInfo.BankAccountNumber, isRequired, this.handleChange)}
            </React.Fragment>
        )
    }

    render() {
        const { userAccountInfo, paymentMethodList, minimumPayment } = this.props;
        const renderFormByMethod = userAccountInfo && this._renderFormByMethod(userAccountInfo);

        return userAccountInfo && (
            <Form tag="div">
                <FormGroup row>
                    <Label htmlFor="preferredPayment" sm={3} xl={2}>Preferred Payment Method</Label>
                    <Col sm={5} xl={6} className="input-item">
                        <Input type="select" id="preferredPayment" name="preferredPayment" onChange={this.handleChangePaymentMethod} value={userAccountInfo.PreferredPayment}>
                            {paymentMethodList && paymentMethodList.map(item => {
                                return (<option key={item.Key} value={item.Key}>{item.Value}</option>)
                            })}
                        </Input>
                    </Col>
                    <span className="input-item">{minimumPaymentText + " " + formatDecimal(minimumPayment)}</span>
                </FormGroup>
                {renderFormByMethod[userAccountInfo.PreferredPayment]}
            </Form>
        )
    }
}

function mapStateToProps({ edit, licenseeName }) {
    const { userAccountInfo } = edit;
    return Object.assign({}, { userAccountInfo, licenseeName });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setUserAccountInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);