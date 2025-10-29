import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { toggleLoaderUserPanel, getBalanceBroughtForward, handleSubmit, getAffiliateInfo } from '../actions';
import { message, resource, regExp, userPanelMenuKey, money } from '../modules/constants';
import { formatDecimalWithCurrencySymbol, format } from '../../../../modules/numberFormat';

const regexCheckAmount = new RegExp(regExp.checkAmount);
const regexValidAmount = new RegExp(regExp.validAmount);
const regexShouldFormatAmount = new RegExp(regExp.shouldFormatAmount);

export class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            balanceBf: 0,
            amount: '',
            description: '',
            isShowMessage: false,
            isSuccess: true,
            message: ''
        }
    }

    componentDidMount() {
        this.getBalanceBroughtForward();
    }

    async getBalanceBroughtForward() {
        this.props.toggleLoaderUserPanel(true);

        const data = await this.props.getBalanceBroughtForward(this.props.affInfo);

        this.setState({ balanceBf: data });
        this.props.toggleLoaderUserPanel(false);
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeAmount = (event) => {
        const { name, value } = event.target;
        const amount = value.replace(/,/g, '');

        if (regexCheckAmount.test(amount)) {
            if (regexShouldFormatAmount.test(amount) && Number(amount) !== 0 && Number(amount) >= money.AllowedMinValue && Number(amount) <= money.AllowedMaxValue) {
                this.setState({ [name]: format(Number(amount)) })
            } else {
                this.setState({ [name]: value });
            }
        }
    }

    _isValidAmount = (amount) => {
        const absBalanceBf = Math.abs(this.state.balanceBf);

        return regexValidAmount.test(amount) && Number(amount) - absBalanceBf >= money.AllowedMinValue && Number(amount) + absBalanceBf <= money.AllowedMaxValue;
    }

    _validateAmount = () => {
        const amount = this.state.amount.replace(/,/g, '');
        const result = {
            isValid: this._isValidAmount(amount) && Number(amount) != 0,
            message: ''
        }

        if (!result.isValid) {
            result.message = amount === '' ? message.Required : message.Invalid;
        }

        return result;
    }

    handleSubmit = async () => {
        this.props.toggleLoaderUserPanel(true);

        const amountValidation = this._validateAmount();

        if (amountValidation.isValid) {
            const { affInfo } = this.props;
            const { amount, description } = this.state;
            const amountNumber = Number(amount.replace(/,/g, ''));
            const adjustmentInfo = Object.assign({}, { AffId: affInfo.AffId, Amount: amountNumber, Description: description });
            const result = await this.props.handleSubmit(adjustmentInfo);

            this.setState({
                isShowMessage: true,
                isSuccess: result.IsSuccessful,
                message: result.IsSuccessful ? message.Success : result.Message,
                amount: result.IsSuccessful ? '' : amount,
                description: result.IsSuccessful ? '' : description
            }, () => window.setTimeout(this.hideMessage, 3000));

            if (result.IsSuccessful) {
                this.getBalanceBroughtForward();
                window.setTimeout(() => this.props.getAffiliateInfo(affInfo.AffName, userPanelMenuKey.adjustment), 3000);
            }
        } else {
            this.setState({
                isSuccess: false,
                isShowMessage: true,
                message: amountValidation.message,
            }, () => window.setTimeout(this.hideMessage, 3000));
        }

        this.props.toggleLoaderUserPanel(false);
    }

    hideMessage = () => {
        this.setState({
            isShowMessage: false
        });
    }

    handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault()
            this.handleSubmit();
        }
    }

    render() {
        const { affInfo } = this.props;
        const { balanceBf, amount, description, isShowMessage, isSuccess, message } = this.state;
        const isValidAmount = this._isValidAmount(amount.replace(/,/g, '')) || amount === '';

        return (
            <Form tag="form" className="adjustment-form">
                <fieldset>
                    <legend>
                        <h5 className="font-weight-bold">{affInfo.AffName}</h5>
                    </legend>
                    <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                        <div dangerouslySetInnerHTML={{ __html: message }}></div>
                    </Alert>
                    <FormGroup row className="mb-2">
                        <Label sm={4}>{resource.BalanceBf}</Label>
                        <Label sm={8}>{formatDecimalWithCurrencySymbol(balanceBf)}</Label>
                    </FormGroup>
                    <FormGroup row className="mb-2">
                        <Label htmlFor="amount" sm={4} className="required">{resource.Amount}</Label>
                        <Col sm={8}>
                            <Input type="text" name="amount" id="amount" className={isValidAmount ? "text-right h-75" : "text-right h-75 has-error"}
                                value={amount} onChange={this.handleChangeAmount} onKeyPress={this.handlePressEnter} />
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-3">
                        <Label htmlFor="description" sm={4} className="align-self-center">{resource.Description}</Label>
                        <Col sm={8}>
                            <Input type="textarea" name="description" id="description" rows="6"
                                value={description} onChange={this.handleChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-2">
                        <Label sm={4}></Label>
                        <Col sm={8}>
                            <Button type="button" color="success" disabled={!isValidAmount} onClick={this.handleSubmit}>{resource.Submit}</Button>
                        </Col>
                    </FormGroup>
                </fieldset>
            </Form>
        );
    }
}

function mapStateToProps({ affCommonInfo }) {
    const affInfo = { AffId: affCommonInfo.affId, AffName: affCommonInfo.affName };
    return Object.assign({}, { affInfo });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoaderUserPanel, getBalanceBroughtForward, handleSubmit, getAffiliateInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);