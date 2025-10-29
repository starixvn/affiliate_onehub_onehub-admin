import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { headerText, globalResource, resource, processing } from '../modules/constants';
import { setPagingOption, toggleLoader, fetchData, setTransactionId } from '../actions';
import { formatDecimalWithCurrencySymbol } from '../../../modules/numberFormat';
import { htmlDecode } from '../../../modules/htmlHelper';

const processingStatus = processing.toLowerCase();

export class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            gridData: null,
            shouldResetScrollPosition: true
        }
    }

    componentDidUpdate(prevProps) {
        const { pagingOption, param } = this.props;

        if (param !== prevProps.param) {
            const newParam = Object.assign({}, param, { PageIndex: 1, PageSize: pagingOption.PageSize });
            this.fetchData(newParam);
        }
    }

    async fetchData(param) {
        this.props.toggleLoader(true);

        const data = await this.props.fetchData(param);

        this.setState({ gridData: data ? data.MainData : null, shouldResetScrollPosition: true });
        this.props.setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.PageIndex, PageSize: param.PageSize });

        this.props.toggleLoader(false);
    }

    handleSetTransactionId = (trxnId) => {
        this.setState({ shouldResetScrollPosition: false });

        this.props.setTransactionId(trxnId);
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={35} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={100} title={headerText.TrxnId}>{headerText.TrxnId}</Cell>
                <Cell header={true} colWidth={175} title={resource.RequestedDate}>{resource.RequestedDate}</Cell>
                <Cell header={true} colWidth={100} title={resource.UserName}>{resource.UserName}</Cell>
                <Cell header={true} colWidth={150} title={resource.Amount}>{resource.Amount}</Cell>
                <Cell header={true} colWidth={100} title={resource.Status}>{resource.Status}</Cell>
                <Cell header={true} colWidth={175} title={resource.CompletedDate}>{resource.CompletedDate}</Cell>
                <Cell header={true} colWidth={175} title={headerText.Creator}>{headerText.Creator}</Cell>
            </Row>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            const { pagingOption } = this.props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];

                dataRows.push(this._buildDataRow(dataItem, i + startIndex));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="8">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        const amount = formatDecimalWithCurrencySymbol(dataItem.Amount);
        const status = dataItem.Status;
        const isProcessing = status && status.toLowerCase() === processingStatus;
        const completedDate = isProcessing ? '--' : dataItem.CompletedDateText;
        const creator = isProcessing ? '--' : htmlDecode(dataItem.Creator);

        return (
            <Row key={`dataRow-${index}`} className={status && status.toLowerCase()}>
                <Cell title={index} className="text-center">{index}</Cell>
                <Cell title={dataItem.TransId} className="text-center">
                    <a href="javascript:;" color="link" className="p-0" onClick={() => this.handleSetTransactionId(dataItem.TransId)}>
                        {dataItem.TransId}
                    </a>
                </Cell>
                <Cell title={dataItem.TransDateText} className="text-center">{dataItem.TransDateText}</Cell>
                <Cell title={dataItem.AffName} className="text-center">{dataItem.AffName}</Cell>
                <Cell title={amount} className="text-right">{amount}</Cell>
                <Cell title={status} className="text-center text-capitalize">{status}</Cell>
                <Cell title={completedDate} className="text-center">{completedDate}</Cell>
                <Cell title={creator} className="text-center">{creator}</Cell>
            </Row>
        )
    }

    handlePaging = (pageIndex, pageSize) => {
        const newPaging = {
            PageIndex: pageIndex,
            PageSize: pageSize
        };
        const newParam = Object.assign({}, this.props.param, newPaging);

        this.fetchData(newParam);
    };

    render() {
        const { gridData, shouldResetScrollPosition } = this.state;

        return gridData && (
            <div className="data-content payment-request">
                <div className="table-responsive table-striped my-2">
                    <Table
                        minWidth={1000}
                        autoWidth={true}
                        bodyHeight={300}
                        header={this._renderHeader()}
                        body={this._renderDataSection(gridData)}
                        containerPadding={20}
                        isPaging={true}
                        pageOption={this.props.pagingOption}
                        onPaging={this.handlePaging}
                        shouldResetScrollPosition={shouldResetScrollPosition}
                    />
                </div>
            </div>
        );
    }
}


function mapStateToProps({ pagingOption, param }) {
    return Object.assign({}, { pagingOption, param });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setPagingOption, toggleLoader, setTransactionId, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);