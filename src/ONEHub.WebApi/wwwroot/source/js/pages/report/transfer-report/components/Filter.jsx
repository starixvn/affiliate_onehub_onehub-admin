import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';
import { setReportTitle, setParam } from '../actions';
import { handleAfterChangeFromDate, handleAfterChangeToDate, isValidNumber } from '../../../../modules/utils';
import { defaultBaseCurrency } from '../../../../modules/constants';
import { globalResource } from '../../../../modules/globalResource';
import { reportName, headerText } from '../libs/constants';
export const minDate = new Date(2021, 10, 31);

export class Filter extends Component {
    constructor(props) {
        super(props);

        const { today, baseCurrencyList } = this.props;
        const now = new Date(today);
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        this.nowString = `${currentMonth}/${now.getDate()}/${currentYear}`;

        this.state = {
            transId: '',
            affName: '',
            playerName: '',
            fromDate: `${currentMonth}/01/${currentYear}`,
            toDate: this.nowString,
            selectedBaseCurrency: baseCurrencyList.length && baseCurrencyList[0].ExchangeId || defaultBaseCurrency,
        }
    }

    handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();

            this.handleClickSearch();
        }
    }

    handleChangeFromDate = (momentDate) => {
        this.setState(prevState => handleAfterChangeFromDate(momentDate, prevState.toDate));
    }

    handleChangeToDate = (momentDate) => {
        this.setState(prevState => handleAfterChangeToDate(momentDate, prevState.fromDate));
    }

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    }

    handleChangeTransId = (event) => {
        const { value } = event.target;
        const numberValue = Number(value);
        const isValid = isValidNumber(numberValue);

        if (isValid) {
            this.setState({ transId: value });
        }
    }

    handleClickSearch = () => {
        const { transId, selectedBaseCurrency, fromDate, toDate, affName, playerName } = this.state;
        const { pagingOption } = this.props;

        this._updateReportTitle();

        const param = {
            TransId: transId,
            AffName: affName,
            PlayerName: playerName,
            FromDate: fromDate,
            ToDate: toDate,
            BaseCurrencyId: Number(selectedBaseCurrency),
            PageIndex: 1,
            PageSize: pagingOption.PageSize
        }

        this.props.setParam(param);
    }

    _updateReportTitle() {
        const reportTitle = this._buildReportTitle();

        this.props.setReportTitle(reportTitle);
    }

    _buildReportTitle() {
        const { baseCurrencyList } = this.props;
        const { transId, fromDate, toDate, affName, playerName, selectedBaseCurrency } = this.state;

        const transIdTitle = `${transId && '- Trans. Id \'' + transId + '\''}`;
        const affNameTitle = `${affName && '- Affiliate contains \'' + affName + '\''}`;
        const playerNameTitle = `${playerName && '- Player contains \'' + playerName + '\''}`;

        const fromToTitle = `FROM ${fromDate} TO ${toDate}`;
        const baseCurrency = baseCurrencyList.filter(x => x.ExchangeId == selectedBaseCurrency).map(b => b.Code).join(',');

        return `${reportName}${transIdTitle}${affNameTitle}${playerNameTitle}- Base Currency ${baseCurrency} - ${fromToTitle}`;
    }

    render() {
        const { baseCurrencyList, isProduction } = this.props;
        const { transId, selectedBaseCurrency, fromDate, toDate, affName, playerName } = this.state;

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="my-sm-1 mr-sm-2">
                        <Label htmlFor="TransId" className="mr-sm-2">Trans. Id</Label>
                        <Input type="text" name="transId" id="TransId" maxLength="9"
                            onKeyPress={this.handlePressEnter}
                            onChange={this.handleChangeTransId}
                            value={transId} />
                    </FormGroup>
                    <FormGroup className="my-sm-1 mr-sm-2">
                        <Label htmlFor="Affiliate" className="mr-sm-2">{headerText.AffName}</Label>
                        <Input type="text" name="affName" id="Affiliate" maxLength="30"
                            onKeyPress={this.handlePressEnter}
                            onChange={this.handleChange}
                            value={affName} />
                    </FormGroup>
                    <FormGroup className="my-sm-1 mr-sm-2">
                        <Label htmlFor="Player" className="mr-sm-2">{headerText.PlayerName}</Label>
                        <Input type="text" name="playerName" id="Player" maxLength="30"
                            onKeyPress={this.handlePressEnter}
                            onChange={this.handleChange}
                            value={playerName} />
                    </FormGroup>
                    <FormGroup className="my-sm-1 mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.BaseCurrency}</Label>
                        <Input type="select" name="selectedBaseCurrency" id="BaseCurrency" value={selectedBaseCurrency} onChange={this.handleChange}>
                            {
                                baseCurrencyList.map(c => {
                                    return (<option key={c.ExchangeId} value={c.ExchangeId}>{c.Code}</option>)
                                })
                            }
                            {
                                !isProduction && <option value="20">UUS</option>
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup className="my-sm-1 mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.From}</Label>
                        <DatePicker minDate={minDate} maxDate={this.nowString} date={fromDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeFromDate} />
                    </FormGroup>
                    <FormGroup className="my-sm-1 mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.To}</Label>
                        <DatePicker minDate={fromDate} maxDate={this.nowString} date={toDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeToDate} />
                    </FormGroup>
                    <Button outline color="primary" type="button" onClick={this.handleClickSearch}>
                        <span className="oi oi-magnifying-glass"></span> Search
                    </Button>
                </Form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return Object.assign({}, {
        pagingOption: state.pagingOption,
        baseCurrencyList: state.baseCurrencyList,
        isProduction: state.isProduction,
        today: state.today,
        param: state.param,
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setReportTitle, setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);