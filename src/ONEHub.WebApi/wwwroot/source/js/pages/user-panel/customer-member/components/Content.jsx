import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { htmlDecode } from '../../../../modules/htmlHelper';
import { resource, maxWidth } from '../modules/constants';
import { toggleLoaderUserPanel, setPagingOption, fetchData } from '../actions';
import ClaimPrincipal, { claimResource } from '../../../../modules/claim';

export class Content extends PureComponent {
    constructor(props) {
        super(props);
        const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
        this.canViewMemberEmail = claimsPrincipal.hasReadClaim(claimResource.MemberEmail);

        this.state = {
            data: null
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { param, pagingOption } = this.props;
        if (param !== prevProps.param) {
            const postParam = { ...param, pageIndex: 1, pageSize: pagingOption.PageSize };
            this.fetchData(postParam);
        }
    }

    fetchData = async (param) => {
        this.props.toggleLoaderUserPanel(true);

        const postParam = { ...param, affId: this.props.affId };
        const data = await this.props.fetchData(postParam);

        this.setState({ data: data ? data.MainData : null });
        this.props.setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.pageIndex, PageSize: param.pageSize });

        this.props.toggleLoaderUserPanel(false);
    }

    handlePaging = (pageIndex, pageSize) => {
        const newParam = { ...this.props.param, pageIndex, pageSize };

        this.fetchData(newParam);
    }

    _renderHeader() {
        return (
            <Row>
                <Cell header={true} colWidth={30}>#</Cell>
                <Cell header={true} colWidth={100} title={resource.UserName}>{resource.UserName}</Cell>
                <Cell header={true} colWidth={100} title={resource.FirstName}>{resource.FirstName}</Cell>
                <Cell header={true} colWidth={100} title={resource.LastName}>{resource.LastName}</Cell>
                {this.canViewMemberEmail && (<Cell header={true} colWidth={100} title={resource.EmailAddress}>{resource.EmailAddress}</Cell>)}
                <Cell header={true} colWidth={50} title={resource.Currency}>{resource.Currency}</Cell>
                <Cell header={true} colWidth={100} title={resource.RegisterDate}>{resource.RegisterDate}</Cell>
            </Row>
        )
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            const { pagingOption } = this.props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];

                dataRows.push(this._buildDataRow(dataItem, startIndex + i));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="6">{resource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, rowNumber) {
        const userName = htmlDecode(dataItem.UserName);
        const firstName = htmlDecode(dataItem.FirstName);
        const lastName = htmlDecode(dataItem.LastName);
        const email = htmlDecode(dataItem.Email);
        return (
            <Row key={`raw-data-${rowNumber}`}>
                <Cell className="text-center" title={rowNumber}>{rowNumber}</Cell>
                <Cell title={userName}>{userName}</Cell>
                <Cell title={firstName}>{firstName}</Cell>
                <Cell title={lastName}>{lastName}</Cell>
                {this.canViewMemberEmail && (<Cell title={email}>{email}</Cell>)}
                <Cell className="text-center" title={dataItem.Currency}>{dataItem.Currency}</Cell>
                <Cell className="text-center" title={dataItem.RegisteredDateString}>{dataItem.RegisteredDateString}</Cell>
            </Row>
        )
    }

    render() {
        const { pagingOption } = this.props;
        const { data } = this.state;

        return data && (
            <div className="table-responsive table-striped my-2">
                <Table
                    maxWidth={maxWidth}
                    bodyHeight={300}
                    header={this._renderHeader()}
                    body={this._renderDataSection(data)}
                    containerPadding={10}
                    isPaging={true}
                    pageOption={pagingOption}
                    onPaging={this.handlePaging}
                />
            </div>
        )
    }
}

function mapStateToProps({ affCommonInfo, member }) {
    const { param, pagingOption } = member;
    const { affId } = affCommonInfo;

    return Object.assign({}, { affId, param, pagingOption });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoaderUserPanel, setPagingOption, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);

