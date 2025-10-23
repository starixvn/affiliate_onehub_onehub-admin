import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { headerText, globalResource, maxWidth } from '../modules/constants';
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
        const { pagingOption, selectedSiteUrl, param } = this.props;

        if (selectedSiteUrl && selectedSiteUrl !== prevProps.selectedSiteUrl) {
            const postParam = { ...param, selectedSiteUrl, pageIndex: 1, pageSize: pagingOption.PageSize };
            this.fetchData(postParam);
        }
    }

    async fetchData(param) {
        this.props.toggleLoaderUserPanel(true);

        const { affId } = this.props;
        const postData = { ...param, affId };
        const data = await this.props.fetchDetailData(postData);

        this.setState({ gridData: data ? data.MainData : null, shouldResetScrollPosition: true });
        this.props.setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.pageIndex, PageSize: param.pageSize });

        this.props.toggleLoaderUserPanel(false);
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={580} title={headerText.WebsiteUrl}>{headerText.WebsiteUrl}</Cell>
                <Cell header={true} colWidth={110} title={headerText.TotalClicks}>{headerText.TotalClicks}</Cell>
                <Cell header={true} colWidth={110} title={headerText.UniqueClicks}>{headerText.UniqueClicks}</Cell>
                <Cell header={true} colWidth={110} title={headerText.Signup}>{headerText.Signup}</Cell>
                <Cell header={true} colWidth={110} title={headerText.Fdm}>{headerText.Fdm}</Cell>
            </Row>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList && dataList.length) {
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
        const websiteUrl = htmlDecode(dataItem.WebsiteUrl);

        return (
            <Row key={`dataRow-${index}`}>
                <Cell title={websiteUrl}>{websiteUrl}</Cell>
                <Cell title={dataItem.TotalClick} className="text-right">{dataItem.TotalClick}</Cell>
                <Cell title={dataItem.UniqueClick} className="text-right">{dataItem.UniqueClick}</Cell>
                <Cell title={dataItem.Signups} className="text-right">{dataItem.Signups}</Cell>
                <Cell title={dataItem.Fdm} className="text-right">{dataItem.Fdm}</Cell>
            </Row>
        )
    }

    handlePaging = (pageIndex, pageSize) => {
        const { param, selectedSiteUrl } = this.props;
        const newParam = { ...param, selectedSiteUrl, pageIndex, pageSize };
        this.fetchData(newParam);
    }

    render() {
        const { gridData } = this.state;

        return this.props.selectedSiteUrl && (
            <div className="table-responsive table-striped my-2">
                <Table
                    minWidth={1010}
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

function mapStateToProps({ affCommonInfo, clickStatistics }) {
    const { pagingOption, param, selectedSiteUrl } = clickStatistics;
    const { affId } = affCommonInfo;

    return Object.assign({}, {
        affId,
        pagingOption,
        selectedSiteUrl,
        param
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoaderUserPanel, setPagingOption, fetchDetailData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);