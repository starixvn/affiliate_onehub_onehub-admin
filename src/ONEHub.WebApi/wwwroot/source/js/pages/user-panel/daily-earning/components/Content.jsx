import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { formatDecimal } from '../../../../modules/numberFormat';
import { toggleLoaderUserPanel, fetchData, redirectToDailyEarningDetail } from '../actions';
import { resource, selectedAllProduct, maxWidth, globalResource } from '../modules/constants';

export class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            gridData: null,
            total: null,
            isSelectedAllProducts: true
        }
    }

    componentDidUpdate(prevProps) {
        const { param } = this.props;
        if (param !== prevProps.param) {
            this.fetchData(param);
        }
    }

    async fetchData(param) {
        this.props.toggleLoaderUserPanel(true);

        const data = await this.props.fetchData(param);

        this.setState({ gridData: data ? data.MainData : null, total: data ? data.Total : 0, isSelectedAllProducts: param.productId === selectedAllProduct });

        this.props.toggleLoaderUserPanel(false);
    }

    _renderHeader() {
        return (
            <Row>
                <Cell header={true} colWidth={30}>#</Cell>
                <Cell header={true} colWidth={100} title={resource.Date}>{resource.Date}</Cell>
                <Cell header={true} colWidth={100} title={resource.Turnover}>{resource.Turnover}</Cell>
                <Cell header={true} colWidth={100} title={resource.Ggr}>{resource.Ggr}</Cell>
                <Cell header={true} colWidth={100} title={resource.Deposit}>{resource.Deposit}</Cell>
                <Cell header={true} colWidth={100} title={resource.Withdrawal}>{resource.Withdrawal}</Cell>
                <Cell header={true} colWidth={100} title={resource.Bonus}>{resource.Bonus}</Cell>
                <Cell header={true} colWidth={100} title={resource.Rebate}>{resource.Rebate}</Cell>
            </Row>
        )
    }

    _renderDataSection(dataList, productColumnClassName) {
        const dataRows = [];

        if (dataList && dataList.length) {
            const isTotalRow = dataList.length === 1 && !dataList[0].Date;

            if (isTotalRow) {
                dataList[0].Date = resource.Total;
            }

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(this._buildDataRow(dataItem, isTotalRow ? null : i + 1, productColumnClassName));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="7">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, rowNumber, productColumnClassName) {
        const turnover = formatDecimal(dataItem.Turnover);
        const ggr = formatDecimal(dataItem.Ggr);
        const deposit = formatDecimal(dataItem.Deposit);
        const withdrawal = formatDecimal(dataItem.Withdrawal);
        const bonus = formatDecimal(dataItem.Bonus);
        const rebate = formatDecimal(dataItem.Rebate);

        const dailyEarningDetailParam = Object.assign({}, this.props.param, { monthDate: dataItem.Date });

        return (
            <Row key={`date-${dataItem.Date}`}>
                {rowNumber && <Cell className="text-center" title={rowNumber}>{rowNumber}</Cell>}
                <Cell className="text-center" title={dataItem.Date} colSpan={!rowNumber ? 2 : 1}>
                    {rowNumber ?
                        (<Button className="p-0" color="link"
                            onClick={() => this.props.redirectToDailyEarningDetail(dailyEarningDetailParam)}>{dataItem.Date}</Button>) :
                        dataItem.Date
                    }
                </Cell>
                <Cell className="text-right" title={turnover}>{turnover}</Cell>
                <Cell className={productColumnClassName} title={ggr}>{ggr}</Cell>
                <Cell className="text-right" title={deposit}>{deposit}</Cell>
                <Cell className="text-right" title={withdrawal}>{withdrawal}</Cell>
                <Cell className="text-right" title={bonus}>{bonus}</Cell>
                <Cell className="text-right" title={rebate}>{rebate}</Cell>
            </Row>
        )
    }

    render() {
        const { gridData, total, isSelectedAllProducts } = this.state;
        const productColumnClassName = isSelectedAllProducts ? 'text-right' : 'text-right highlight';
        const hasFooter = gridData && gridData.length && total;

        return (
            <div className="table-responsive table-striped my-2">
                <Table
                    maxWidth={maxWidth}
                    bodyHeight={300}
                    header={this._renderHeader()}
                    body={this._renderDataSection(gridData, productColumnClassName)}
                    footer={hasFooter ? this._renderDataSection([total], productColumnClassName) : null}
                    containerPadding={10}
                />
            </div>
        );
    }
}

function mapStateToProps({ dailyEarning }) {
    const { param } = dailyEarning;

    return Object.assign({}, { param });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoaderUserPanel, fetchData, redirectToDailyEarningDetail }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);