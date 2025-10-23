import React, { PureComponent, Fragment } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { formatDecimal } from '../../../../modules/numberFormat';
import { setPagingOption, setParam, fetchData, toggleLoader } from '../actions';
import { globalResource } from '../../../../modules/globalResource';
import { totalText, headerText } from '../libs/constants';

export class GridData extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            gridData: null,
            total: null
        }
    }

    componentDidUpdate(prevProps) {
        const { param } = this.props;

        if (!!param && param !== prevProps.param) {
            this.fetchData(param);
        }
    }

    async fetchData(param) {
        this.props.toggleLoader(true);
        const data = await this.props.fetchData(param);

        if (data) {
            const { MainData, Total, TotalItem } = data;

            this.setState({ gridData: MainData, total: Total });
            this.props.setPagingOption({ TotalItem, PageIndex: param.PageIndex, PageSize: param.PageSize });
        }
        this.props.toggleLoader(false);
    }

    _renderHeader() {
        return [
            <Row key="thead-1">
                <Cell header={true} colWidth={50} rowSpan="3" title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={100} rowSpan="3" title={headerText.TransId}>{headerText.TransId}</Cell>
                <Cell header={true} colWidth={120} rowSpan="3" title={headerText.CreatedDateText}>{headerText.CreatedDateText}</Cell>
                <Cell header={true} colWidth={90} rowSpan="3" title={headerText.Status}>{headerText.Status}</Cell>
                <Cell header={true} colWidth={90} rowSpan="3" title={headerText.AffName}>{headerText.AffName}</Cell>
                <Cell header={true} colWidth={120} rowSpan="3" title={headerText.AffPlayerName}>{headerText.AffPlayerName}</Cell>
                <Cell header={true} colWidth={100} rowSpan="3" title={headerText.PlayerName}>{headerText.PlayerName}</Cell>
                <Cell header={true} colSpan="5" title={headerText.Amount}>{headerText.Amount}</Cell>
            </Row>,
            <Row key="thead-2">
                <Cell header={true} colSpan="2" title={headerText.InAffPlayerCurrency}>{headerText.InAffPlayerCurrency}</Cell>
                <Cell header={true} colSpan="2" title={headerText.InPlayerCurrency}>{headerText.InPlayerCurrency}</Cell>
                <Cell header={true} rowSpan="2" colWidth={120} title={headerText.BasedAmount}>{headerText.BasedAmount}</Cell>
            </Row>,
            <Row key="thead-2">
                <Cell className="p-0" header={true} colWidth={50}></Cell>
                <Cell className="p-0" header={true} colWidth={120}></Cell>
                <Cell className="p-0" header={true} colWidth={50}></Cell>
                <Cell className="p-0" header={true} colWidth={120}></Cell>
            </Row>
        ];
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(this._buildDataRow(dataItem, i + 1));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="12">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        const isTotalRow = !dataItem.TransId;
        const affPlayerAmount = !isTotalRow && formatDecimal(dataItem.AffPlayerAmount);
        const amount = !isTotalRow && formatDecimal(dataItem.Amount);
        const basedAmount = formatDecimal(dataItem.BasedAmount);

        return (
            <Row key={`dataRow-${index}`}>
                {
                    isTotalRow ? (
                        <Fragment>
                            <Cell className="text-center" colSpan="11" title={totalText}>{totalText}</Cell>
                            <Cell className="text-right font-weight-bold" title={basedAmount}>{basedAmount}</Cell>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Cell className="text-center" title={index}>{index}</Cell>
                            <Cell className="text-center" title={dataItem.TransId}>{dataItem.TransId}</Cell>
                            <Cell className="text-center" title={dataItem.CreatedDateText}>{dataItem.CreatedDateText}</Cell>
                            <Cell className="text-center" title={dataItem.Status}>{dataItem.Status}</Cell>
                            <Cell title={dataItem.AffName}>{dataItem.AffName}</Cell>
                            <Cell title={dataItem.AffPlayerName}>{dataItem.AffPlayerName}</Cell>
                            <Cell title={dataItem.PlayerName}>{dataItem.PlayerName}</Cell>
                            <Cell className="text-center" title={dataItem.AffPlayerCurrency}>{dataItem.AffPlayerCurrency}</Cell>
                            <Cell className="text-right" title={affPlayerAmount}>{affPlayerAmount}</Cell>
                            <Cell className="text-center" title={dataItem.PlayerCurrency}>{dataItem.PlayerCurrency}</Cell>
                            <Cell className="text-right" title={amount}>{amount}</Cell>
                            <Cell className="text-right" title={basedAmount}>{basedAmount}</Cell>
                        </Fragment>
                    )
                }
            </Row>
        )
    }

    handlePaging = (index, size) => {
        const newPaging = {
            PageIndex: index,
            PageSize: size
        };
        const newParam = Object.assign({}, this.props.param, newPaging);

        this.fetchData(newParam);
    }

    render() {
        const { gridData, total } = this.state;

        return gridData && (
            <div className="table-responsive table-striped">
                <Table
                    minWidth={1000}
                    autoWidth={true}
                    bodyHeight={300}
                    header={this._renderHeader()}
                    body={this._renderDataSection(gridData)}
                    footer={total && this._renderDataSection([total])}
                    containerPadding={20}
                    isPaging={true}
                    pageOption={this.props.pagingOption}
                    onPaging={this.handlePaging}
                />
            </div>
        );
    }
}

function mapStateToProps({ pagingOption, param }) {
    return Object.assign({}, { pagingOption, param });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setPagingOption, toggleLoader, setParam, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GridData);