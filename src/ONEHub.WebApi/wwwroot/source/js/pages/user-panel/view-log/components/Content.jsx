import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { htmlDecode } from '../../../../modules/htmlHelper';
import { headerText, globalResource, maxWidth } from '../modules/constants';
import { setPagingOption, toggleLoaderUserPanel, setShowIdList, fetchData } from '../actions';

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
            const newParam = Object.assign({}, param, { pageIndex: 1, pageSize: pagingOption.PageSize });
            this.fetchData(newParam);
        }
    }

    async fetchData(param) {
        this.props.toggleLoaderUserPanel(true);

        const { affId } = this.props;
        const postData = { ...param, affId };
        const data = await this.props.fetchData(postData);

        this.setState({ gridData: data ? data.MainData : null, shouldResetScrollPosition: true });
        this.props.setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.pageIndex, PageSize: param.pageSize });

        this.props.toggleLoaderUserPanel(false);
    }

    handleShow = (id) => {
        const { showIdList } = this.props;
        this.setState({ shouldResetScrollPosition: false });

        this.props.setShowIdList(Object.assign({}, showIdList, { [id]: !showIdList[id] }));
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={35} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={70} title={headerText.Id}>{headerText.Id}</Cell>
                <Cell header={true} colWidth={125} title={headerText.Date}>{headerText.Date}</Cell>
                <Cell header={true} colWidth={100} title={headerText.UpdatedBy}>{headerText.UpdatedBy}</Cell>
                <Cell header={true} colWidth={130} title={headerText.Action}>{headerText.Action}</Cell>
                <Cell header={true} colWidth={440} title={headerText.Description}>{headerText.Description}</Cell>
                <Cell header={true} colWidth={100} title={headerText.Ip}>{headerText.Ip}</Cell>
            </Row>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            const { pagingOption } = this.props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;

            for (let i = 0; i < dataList.length; i++) {
                let isLink = false;
                let isHide = false;

                const dataItem = dataList[i];
                const dataPreviousItem = i == 0 ? {} : dataList[i - 1];
                const dataNextItem = i == dataList.length - 1 ? {} : dataList[i + 1];

                if (dataItem.LogId == dataPreviousItem.LogId) {
                    isHide = true;
                } else if (dataItem.LogId == dataNextItem.LogId) {
                    isLink = true;
                }

                dataRows.push(this._buildDataRow(dataItem, i + startIndex, isLink, isHide));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="7">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index, isLink, isHide) {
        const id = dataItem.LogId;
        const ipAddress = dataItem.Ip;
        const url = `http://anonym.to/?http://legacytools.dnsstuff.com/tools/ipall.ch?tool_id=67&token=&toolhandler_redirect=0&ip=${ipAddress}&j=1`;

        if (isHide && !this.props.showIdList[id]) {
            return null;
        }

        const updatedBy = htmlDecode(dataItem.UpdatedName);
        const action = htmlDecode(dataItem.Action);
        const description = htmlDecode(dataItem.Description);

        return (
            <Row key={`dataRow-${index}`}>
                <Cell title={index} className="text-center">{index}</Cell>
                <Cell title={id} className="text-center">
                    {isLink ? <Button color="link" onClick={() => this.handleShow(id)}>
                        {id}
                    </Button> : id}
                </Cell>
                <Cell title={dataItem.DateText} className="text-center">{dataItem.DateText}</Cell>
                <Cell title={updatedBy} className="text-center">{updatedBy}</Cell>
                <Cell title={action} className="text-center">{action}</Cell>
                <Cell title={description} className="text-break">{description}</Cell>
                <Cell title={ipAddress} className="text-center">
                    <a target="_blank" href={url}>{ipAddress}</a>
                </Cell>
            </Row>
        )
    }

    handlePaging = (pageIndex, pageSize) => {
        const newParam = { ...this.props.param, pageIndex, pageSize };

        this.fetchData(newParam);
        this.props.setShowIdList({});
    };

    render() {
        const { gridData, shouldResetScrollPosition } = this.state;

        return gridData && (
            <div className="data-content">
                <div className="table-responsive table-striped my-2">
                    <Table
                        maxWidth={maxWidth}
                        bodyHeight={300}
                        header={this._renderHeader()}
                        body={this._renderDataSection(gridData)}
                        containerPadding={10}
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


function mapStateToProps({ affCommonInfo, viewLog }) {
    const { pagingOption, param, showIdList } = viewLog;
    const { affId } = affCommonInfo;

    return Object.assign({}, {
        affId,
        pagingOption,
        showIdList,
        param
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setPagingOption, toggleLoaderUserPanel, setShowIdList, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);