import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Table } from 'reactstrap';

import Panel from './Panel';
import { formatDecimalWithCurrencySymbol, format } from '../../../modules/numberFormat';

export class MemberStatistics extends PureComponent {
    constructor(props) {
        super(props);
    }

    _renderData(generalInfo, isUpToNow) {
        return (
            <tbody>
                {this._buildRow('Total Deposits', formatDecimalWithCurrencySymbol(isUpToNow ? generalInfo.DepositAll : generalInfo.DepositMonth))}
                {this._buildRow('Total PSP fees', formatDecimalWithCurrencySymbol(isUpToNow ? (generalInfo.PSPFeeAll) : (generalInfo.PSPFeeMonth)))}
                {this._buildRow('Total GGR', formatDecimalWithCurrencySymbol(isUpToNow ? generalInfo.GgrAll : generalInfo.GgrMonth))}
                {this._buildRow('Total Bonus', formatDecimalWithCurrencySymbol(isUpToNow ? generalInfo.BonusAll : generalInfo.BonusMonth))}
                {this._buildRow('Total Rebate', formatDecimalWithCurrencySymbol(isUpToNow ? generalInfo.RebateAll : generalInfo.RebateMonth))}
                <tr>
                    <td className="title-total"><strong>Company Net Win</strong></td>
                    <td className="content-total"><strong>{formatDecimalWithCurrencySymbol(isUpToNow ? generalInfo.NetWinlostAll : generalInfo.NetWinlostMonth)}</strong></td>
                </tr>
            </tbody>
        );
    }

    _buildRow(title, data) {
        return (
            <tr key={title}>
                <td className="title">{title}</td>
                <td className="content">{data}</td>
            </tr>
        )
    }

    render() {
        const { isUpToNow, generalInfo } = this.props;

        return (
            <Panel heading={`Player statistics (${isUpToNow ? 'up to now' : 'this month'})`} className={"icon-home02"}>
                <Row>
                    <Col sm={12} className="pl-4">
                        <span>We have <strong>{format(isUpToNow ? generalInfo.MemAllNum : generalInfo.MemMonthNum)}</strong> players in the program</span>
                    </Col>
                    <Col sm={12} className="pl-4">
                        <span><strong>{format(isUpToNow ? generalInfo.DepositMemAllNum : generalInfo.DepositMemMonthNum)}</strong> Deposit / <strong>{format(isUpToNow ? (generalInfo.NonDepositMemAllNum) : (generalInfo.NonDepositMemMonthNum))}</strong> Non-Deposit</span>
                    </Col>
                    <Col sm={12}>
                        <Table className="member-statistics-table" sm={12}>
                            {this._renderData(generalInfo, isUpToNow)}
                        </Table>
                    </Col>
                </Row>
            </Panel>
        );
    }
}

function mapStateToProps({ generalInfo }) {
    return Object.assign({}, { generalInfo });
}

export default connect(mapStateToProps)(MemberStatistics);