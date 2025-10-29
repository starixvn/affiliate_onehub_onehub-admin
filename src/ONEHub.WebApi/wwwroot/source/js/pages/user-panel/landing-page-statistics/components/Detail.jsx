import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { headerTitle, maxWidth, globalResource } from '../modules/constants';
import { toggleLoaderUserPanel, setPagingOption, fetchDetailData } from '../actions';
import { htmlDecode } from '../../../../modules/htmlHelper';

export class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gridData: null
        }
    }

    componentDidUpdate(prevProps) {
        const { pagingOption, selectedPage } = this.props;

        if (selectedPage !== prevProps.selectedPage) {
            const param = Object.assign({}, this.props.param, { pageIndex: 1, pageSize: pagingOption.PageSize, ...selectedPage });

            this.fetchData(param);
        }
    }

    async fetchData(param) {
        this.props.toggleLoaderUserPanel(true);

        const data = await this.props.fetchDetailData(param);

        this.setState({ gridData: data ? data.MainData : null });
        this.props.setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.pageIndex, PageSize: param.pageSize });

        this.props.toggleLoaderUserPanel(false);
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={580} title={headerTitle.WebsiteUrl}>{headerTitle.WebsiteUrl}</Cell>
                <Cell header={true} colWidth={110} title={headerTitle.TotalClicks}>{headerTitle.TotalClicks}</Cell>
                <Cell header={true} colWidth={110} title={headerTitle.UniqueClicks}>{headerTitle.UniqueClicks}</Cell>
                <Cell header={true} colWidth={110} title={headerTitle.Signup}>{headerTitle.Signup}</Cell>
                <Cell header={true} colWidth={110} title={headerTitle.Fdm}>{headerTitle.Fdm}</Cell>
            </Row>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(this._buildDataRow(dataItem, i));
            }
        }
        else {
            dataRows.push(
                <Row key="no-info">
                    <Cell className="text-center" colSpan="5">{globalResource.NoInfo}</Cell>
                </Row>
            );
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        return (
            <Row key={`dataRow-${index}`}>
                <Cell title={htmlDecode(dataItem.WebsiteUrl)}>{htmlDecode(dataItem.WebsiteUrl)}</Cell>
                <Cell title={dataItem.TotalClick} className="text-right">{dataItem.TotalClick}</Cell>
                <Cell title={dataItem.UniqueClick} className="text-right">{dataItem.UniqueClick}</Cell>
                <Cell title={dataItem.Signups} className="text-right">{dataItem.Signups}</Cell>
                <Cell title={dataItem.Fdm} className="text-right">{dataItem.Fdm}</Cell>
            </Row>
        )
    }

    handlePaging = (pageIndex, pageSize) => {
        const newParam = Object.assign({}, this.props.param, { ...this.props.selectedPage, pageIndex, pageSize });
        this.fetchData(newParam);
    }

    render() {
        const { gridData } = this.state;

        return this.props.selectedPage && gridData && (
            <div className="table-responsive table-striped my-2">
                <Table
                    maxWidth={maxWidth}
                    autoHeight={false}
                    bodyHeight={300}
                    header={this._renderHeader()}
                    body={this._renderDataSection(gridData)}
                    containerPadding={10}
                    isPaging={true}
                    pageOption={this.props.pagingOption}
                    onPaging={this.handlePaging}
                />
            </div>
        );
    }
}


function mapStateToProps({ landingPageStatistics }) {
    const { pagingOption, param, selectedPage } = landingPageStatistics;
    return Object.assign({}, { pagingOption, param, selectedPage });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoaderUserPanel, setPagingOption, fetchDetailData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);