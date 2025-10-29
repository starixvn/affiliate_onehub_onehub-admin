import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { formatDateTime } from '../../../../modules/utils';
import { htmlDecode } from '../../../../modules/htmlHelper';
import { headerText, globalResource } from '../libs/constants';
import { setSelectedMemberId, fetchData, setPagingOption, toggleLoader, setShouldResetScrollPosition, setParam } from '../actions';

export class Content extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        const { param } = this.props;
        if (param && param !== prevProps.param) {
            this.props.fetchData(param);
        }
    }

    _handlePaging = (pageIndex, pageSize) => {
        const newPaging = {
            PageIndex: pageIndex,
            PageSize: pageSize
        };
        const newParam = Object.assign({}, this.props.param, newPaging);

        this.props.setPagingOption(newPaging);
        this.props.setParam(newParam);
    };

    _handleUpdateMember = (selectedMemberId) => {
        this.props.setSelectedMemberId(selectedMemberId);
    }

    _renderHeader() {
        return [
            <Row key="theard">
                <Cell header={true} rowSpan="2" colWidth={30} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} rowSpan="2" colWidth={120} title={headerText.UserName}>{headerText.UserName}</Cell>
                <Cell header={true} rowSpan="2" colWidth={120} title={headerText.IbcUserName}>{headerText.IbcUserName}</Cell>
                <Cell header={true} rowSpan="2" colWidth={100} title={headerText.FirstName}>{headerText.FirstName}</Cell>
                <Cell header={true} rowSpan="2" colWidth={100} title={headerText.LastName}>{headerText.LastName}</Cell>
                <Cell header={true} rowSpan="2" colWidth={100} title={headerText.CreatedDate}>{headerText.CreatedDate}</Cell>
                <Cell header={true} rowSpan="2" colWidth={100} title={headerText.Affiliate}>{headerText.Affiliate}</Cell>
                <Cell header={true} colSpan="3" colWidth={200} title={headerText.Removed}>{headerText.Removed}</Cell>
            </Row>,
            <Row key="sub-theard">
                <Cell header={true} colWidth={50} title={headerText.Status}>{headerText.Status}</Cell>
                <Cell header={true} colWidth={100} title={headerText.LastActionDate}>{headerText.LastActionDate}</Cell>
                <Cell header={true} colWidth={50} title={headerText.Edit}>{headerText.Edit}</Cell>
            </Row>
        ];
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
                <Cell className="text-center" colSpan="10">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        const userName = htmlDecode(dataItem.UserName);
        const ibcUserName = htmlDecode(dataItem.IbcUserName);
        const firstName = htmlDecode(dataItem.FirstName);
        const lastName = htmlDecode(dataItem.LastName);
        const createdDate = formatDateTime(dataItem.RegisteredDate, "MM/dd/yyyy HH:mm:ss");
        const lastActionDate = formatDateTime(dataItem.LastAction, "MM/dd/yyyy HH:mm:ss");

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center" title={userName}>{userName}</Cell>
                <Cell className="text-center" title={ibcUserName}>{ibcUserName}</Cell>
                <Cell className="text-center" title={firstName}>{firstName}</Cell>
                <Cell className="text-center" title={lastName}>{lastName}</Cell>
                <Cell className="text-center" title={createdDate}>{createdDate}</Cell>
                <Cell className="text-center" title={dataItem.AffUserName}>{dataItem.AffUserName}</Cell>
                <Cell className="text-center">
                    <input className="mt-1" type="checkbox" checked={dataItem.IsRemoved} disabled />
                </Cell>
                <Cell className="text-center" title={lastActionDate}>{lastActionDate}</Cell>
                <Cell className="text-center" title={`Edit ${userName} player`}>
                    <Button color="link p-0" onClick={() => this._handleUpdateMember(dataItem.MemberId)}>
                        <span className="oi oi-pencil text-secondary"></span>
                    </Button>
                </Cell>
            </Row>
        )
    }

    render() {
        const { pagingOption, gridData, shouldResetScrollPosition } = this.props;

        return gridData && (
            <div className="data-content">
                <div className="member-list-content table-responsive table-striped my-2">
                    <Table
                        minWidth={1000}
                        autoWidth={true}
                        bodyHeight={300}
                        header={this._renderHeader()}
                        body={this._renderDataSection(gridData)}
                        containerPadding={20}
                        isPaging={true}
                        pageOption={pagingOption}
                        onPaging={this._handlePaging}
                        shouldResetScrollPosition={shouldResetScrollPosition}
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps({ pagingOption, param, shouldResetScrollPosition, gridData }) {
    return Object.assign({}, { pagingOption, param, shouldResetScrollPosition, gridData });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedMemberId, fetchData, setPagingOption, toggleLoader, setShouldResetScrollPosition, setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);