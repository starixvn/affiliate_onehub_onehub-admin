import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import Filter from './Filter';
import { htmlDecode } from '../../../modules/htmlHelper';
import { resolveClientUrl } from '../../../modules/utils';
import { headerText, roleList } from '../libs/constants';
import { setPagingOption, getOnlineList } from '../actions';

export class OnlineList extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._handleFetchData({ pageIndex: 1, pageSize: this.props.pagingOption.PageSize });
    }

    async _handleFetchData(param) {
        await this.props.getOnlineList(param);
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={50} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={190} title={headerText.UserName}>{headerText.UserName}</Cell>
                <Cell header={true} colWidth={190} title={headerText.LoggedIn}>{headerText.LoggedIn}</Cell>
                <Cell header={true} colWidth={190} title={headerText.LastRequest}>{headerText.LastRequest}</Cell>
                <Cell header={true} colWidth={190} title={headerText.Ip}>{headerText.Ip}</Cell>
                <Cell header={true} colWidth={190} title={headerText.Role}>{headerText.Role}</Cell>
            </Row>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList && dataList.length) {
            const { pagingOption } = this.props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;

            for (let i = 0; i < dataList.length; i++) {
                dataRows.push(this._buildDataRow(dataList[i], i + startIndex));
            }
        }
        else {
            dataRows.push(<Row key="No Info">
                <Cell className="text-center" colSpan="6">No users are online</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        const ipAddress = dataItem.Ip;
        const url = `http://anonym.to/?http://legacytools.dnsstuff.com/tools/ipall.ch?tool_id=67&token=&toolhandler_redirect=0&ip=${ipAddress}&j=1`;
        const userName = htmlDecode(dataItem.UserName);
        const role = roleList[dataItem.Role];

        return (
            <Row key={`dataRow-${index}`}>
                <Cell title={index} className="text-center">{index}</Cell>
                <Cell title={userName} className="text-center">
                    {
                        dataItem.Role.toLowerCase() === 'admin' ? userName : (<a href={resolveClientUrl(`api/customer?user=${userName}`)}>{userName}</a>)
                    }
                </Cell>
                <Cell title={dataItem.LoggedInText} className="text-center">{dataItem.LoggedInText}</Cell>
                <Cell title={dataItem.LastRequestText} className="text-center">{dataItem.LastRequestText}</Cell>
                <Cell title={ipAddress} className="text-center">
                    <a target="_blank" href={url}>{ipAddress}</a>
                </Cell>
                <Cell title={role} className="text-center">{role}</Cell>
            </Row>
        )
    }

    handlePaging = (pageIndex, pageSize) => {
        this._handleFetchData({ pageIndex, pageSize });
    };

    render() {
        const { onlineList } = this.props;

        return (
            <div className="data-content mb-5 mt-3" style={{ width: window.innerWidth - 33 }}>
                <Filter />
                <div className="table-responsive table-striped my-2">
                    <Table
                        maxWidth={window.innerWidth - 13}
                        bodyHeight={300}
                        header={this._renderHeader()}
                        body={this._renderDataSection(onlineList)}
                        containerPadding={20}
                        isPaging={true}
                        pageOption={this.props.pagingOption}
                        onPaging={this.handlePaging}
                    />
                </div>
            </div>
        );
    }
}


function mapStateToProps({ pagingOption, onlineList }) {
    return Object.assign({}, { pagingOption, onlineList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setPagingOption, getOnlineList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OnlineList);