import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MonthPicker from '@9softstudio/react-monthpicker';
import { Table, Spinner } from 'reactstrap';
import { rowTitle, resource } from '../modules/constants';
import { shortedMonthNames, minMonthDate, deviceTypes, pcLaptop, mobile } from '../../../../modules/constants';
import { formatDecimalWithCurrencySymbol, format } from '../../../../modules/numberFormat';

import { redirectToPlayerDetail, redirectToTrackingStatistics, redirectToReferrers } from '../../user-panel/actions';
import { setMonthDate, fetchData } from '../actions';

export class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            isLoading: false
        }
    }

    componentDidMount() {
        this.fetchData(this.props.today);
    }

    componentDidUpdate(prevProps) {
        const { affId, today } = this.props;

        if (prevProps.affId !== affId) {
            this.fetchData(today);
        }
    }

    fetchData = async (monthDate) => {
        this.setState({ isLoading: true });
        this.props.setMonthDate(monthDate);
        const { affId } = this.props;

        const param = {
            monthDate,
            affId
        }
        const data = await this.props.fetchData(param);

        this.setState({ data, isLoading: false });
    }

    handleSelectMonth = (month, year) => {
        const monthDate = `${month}/1/${year}`;
        this.fetchData(monthDate);
    }

    handleFormatMonthPicker = (month, year) => {
        return `${shortedMonthNames[month - 1]}-${year}`
    }

    _renderHeader(monthDate) {
        return (
            <thead>
                <tr>
                    <th>{rowTitle.Statistics}</th>
                    <th className="width-30 month-picker">
                        <div className="position-relative d-inline-block">
                            <MonthPicker minMonth={minMonthDate.month} minYear={minMonthDate.year}
                                selectedDropdownYear={monthDate.getFullYear()}
                                selectedMonth={monthDate.getMonth() + 1}
                                onSelect={this.handleSelectMonth}
                                onFormat={this.handleFormatMonthPicker}
                                iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)} />
                        </div>
                        <Spinner className={this.state.isLoading ? "" : "d-none"} size="sm" color="secondary" />
                    </th>
                    <th className="width-30">{rowTitle.UpToNow}</th>
                </tr>
            </thead>
        )
    }

    _renderData(monthDate, data) {
        data = data || {};
        const DepositByMonth = formatDecimalWithCurrencySymbol(data.DepositByMonth);
        const TotalFDMAmountByMonth = formatDecimalWithCurrencySymbol(data.TotalFDMAmountByMonth);
        const DepositTotal = formatDecimalWithCurrencySymbol(data.DepositTotal);
        const TotalFDMAmount = formatDecimalWithCurrencySymbol(data.TotalFDMAmount);
        const TotalFDMTotalDepositByMonth = formatDecimalWithCurrencySymbol(data.FDM_TotalDepositByMonth);
        const TurnoverByMonth = formatDecimalWithCurrencySymbol(data.TurnoverByMonth);
        const TurnoverTotal = formatDecimalWithCurrencySymbol(data.TurnoverTotal);
        const GgrByMonth = formatDecimalWithCurrencySymbol(data.GgrByMonth);
        const GgrTotal = formatDecimalWithCurrencySymbol(data.GgrTotal);

        const startMonthString = `${monthDate.getMonth() + 1}/1/${monthDate.getFullYear()}`;

        const endMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        const endMonthString = `${endMonth.getMonth() + 1}/${endMonth.getDate()}/${endMonth.getFullYear()}`;

        return (
            <tbody>
                {
                    this._buildRow(rowTitle.NewSignups,
                        `${format(data.SignupsByMonth)}/${format(data.FdmByMonth)}`,
                        `${format(data.SignupsTotal)}/${format(data.FdmTotal)}`,
                        rowTitle.Tooltip.replace('{0}', '5')
                    )
                }
                {this._buildRow(rowTitle.TotalActive, format(data.ActivePlayersByMonth), resource.NA, rowTitle.Tooltip.replace('{0}', '75'))}
                {this._buildRow(rowTitle.TotalQualified, format(data.QualifiedMembersByMonth), resource.NA, rowTitle.Tooltip.replace('{0}', '75'))}
                {this._buildRow(rowTitle.TotalSubAff, format(data.NoOfSubAffByMonth), format(data.NoOfSubAffTotal))}
                {this._buildRow(rowTitle.TotalDeposits, `${DepositByMonth}/${TotalFDMAmountByMonth}`, `${DepositTotal}/${TotalFDMAmount}`, rowTitle.Tooltip.replace('{0}', '5'))}
                {this._buildRow(rowTitle.TotalFDMTotalDeposit, `${TotalFDMTotalDepositByMonth}`, resource.NA, rowTitle.Tooltip.replace('{0}', '5'))}
                {this._buildRow(rowTitle.Turnover, TurnoverByMonth, TurnoverTotal, rowTitle.Tooltip.replace('{0}', '75'))}
                {this._buildRow(rowTitle.Ggr, GgrByMonth, GgrTotal, rowTitle.Tooltip.replace('{0}', '75'))}
                {
                    this._buildRow(rowTitle.TrackingRatePC,
                        (<a href="javascript:;" onClick={() => this.props.redirectToReferrers({ fromDate: startMonthString, toDate: endMonthString, deviceType: deviceTypes[pcLaptop], isClickLink: true })}>
                            {format(data.UniqueClickPCByMonth)}/{format(data.TotalClickPCByMonth)}
                        </a>),
                        resource.NA)
                }
                {
                    this._buildRow(rowTitle.TrackingRateMobile,
                        (<a href="javascript:;" onClick={() => this.props.redirectToReferrers({ fromDate: startMonthString, toDate: endMonthString, deviceType: deviceTypes[mobile], isClickLink: true })}>
                            {format(data.UniqueClickMobileByMonth)}/{format(data.TotalClickMobileByMonth)}
                        </a>),
                        resource.NA)
                }
            </tbody>
        );
    }

    _buildRow(title, dataByMonth, dataUpToNow, tooltip = '') {
        return (
            <tr key={title}>
                <td className="font-weight-bold">
                    {title}
                    {tooltip && <span className="oi icon-info ml-1" title={tooltip}></span>}
                </td>
                <td className="text-right">{dataByMonth}</td>
                <td className="text-right">{dataUpToNow}</td>
            </tr>
        )
    }

    render() {
        const { data } = this.state;
        const monthDate = new Date(this.props.monthDate);

        return (
            <div className="my-2 table-responsive">
                <Table id="statistic-data-table">
                    {this._renderHeader(monthDate)}
                    {this._renderData(monthDate, data)}
                </Table>
            </div>
        );
    }
}

function mapStateToProps({ affCommonInfo, today, customerStatistics }) {
    const { affId } = affCommonInfo;
    return Object.assign({}, { monthDate: customerStatistics.monthDate, today, affId });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setMonthDate, redirectToPlayerDetail, redirectToTrackingStatistics, redirectToReferrers, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);