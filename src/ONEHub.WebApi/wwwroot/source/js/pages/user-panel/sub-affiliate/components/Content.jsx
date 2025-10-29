import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { resource, maxWidth, globalResource } from '../libs/constants';
import { fetchData, toggleLoaderUserPanel, setPagingOption } from '../actions';
import { formatDecimal } from '../../../../modules/numberFormat';
import { resolveClientUrl } from '../../../../modules/utils';

export class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            gridData: null,
            total: null
        }
    }

    componentDidUpdate(prevProps) {
        const { param, pagingOption } = this.props;
        if (param !== prevProps.param) {
            const newParam = Object.assign({}, param, { pageIndex: 1, pageSize: pagingOption.PageSize });
            this.fetchData(newParam);
        }
    }

    async fetchData(param) {
        this.props.toggleLoaderUserPanel(true);

        const data = await this.props.fetchData(param);

        this.setState({
            gridData: data ? data.MainData : null,
            total: data ? data.Total : 0
        });

        this.props.setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.pageIndex, PageSize: param.pageSize });
        this.props.toggleLoaderUserPanel(false);
    }

    _renderHeader() {
        return (
            <Row>
                <Cell header={true} colWidth={30}>#</Cell>
                <Cell header={true} colWidth={100} title={resource.SubAffiliateName}>{resource.SubAffiliateName}</Cell>
                <Cell header={true} colWidth={100} title={resource.Commission}>{resource.Commission}</Cell>
                <Cell header={true} colWidth={100} title={resource.SubAffiliateEarning}>{resource.SubAffiliateEarning}</Cell>
            </Row>
        )
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList && dataList.length) {
            const isTotalRow = dataList.length === 1 && !dataList[0].AffId;

            if (isTotalRow) {
                dataList[0].AffName = resource.Total;
            }

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(this._buildDataRow(dataItem, isTotalRow ? null : i + 1));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="8">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, rowNumber) {
        const commision = formatDecimal(dataItem.Commission);
        const subAffiliateEarning = formatDecimal(dataItem.SubAffCommission);

        return (
            <Row>
                {rowNumber && <Cell className="text-center" title={rowNumber}>{rowNumber}</Cell>}
                <Cell className='text-center' title={dataItem.AffName} colSpan={!rowNumber && 2}>
                    {
                        rowNumber ? (
                            <a href={resolveClientUrl(`Portal/Customer?user=${dataItem.AffName}`)} target='_top'>{dataItem.AffName}</a>
                        ) : dataItem.AffName
                    }
                </Cell>
                <Cell className="text-right" title={commision}>{commision}</Cell>
                <Cell className="text-right" title={subAffiliateEarning}>{subAffiliateEarning}</Cell>
            </Row>
        )
    }

    handlePaging = (pageIndex, pageSize) => {
        const newParam = { ...this.props.param, pageIndex, pageSize };

        this.fetchData(newParam);
    };

    render() {
        const { gridData, total } = this.state;
        const hasFooter = gridData && gridData.length && total;

        return (
            <div className="table-responsive table-striped my-2">
                <Table
                    maxWidth={maxWidth}
                    bodyHeight={300}
                    header={this._renderHeader()}
                    body={this._renderDataSection(gridData)}
                    footer={hasFooter ? this._renderDataSection([total]) : null}
                    containerPadding={10}
                    isPaging={true}
                    pageOption={this.props.pagingOption}
                    onPaging={this.handlePaging}
                />
            </div>
        );
    }
}

function mapStateToProps({ subAffiliate }) {
    const { param, pagingOption } = subAffiliate;

    return Object.assign({}, { param, pagingOption });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoaderUserPanel, fetchData, setPagingOption }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);