import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { htmlDecode } from '../../../modules/htmlHelper';
import { headerText, resource } from '../libs/constants';
import { setSelectedMessageId, setPagingOption, fetchData, setCheckedMessages, setShouldResetScrollPosition, setParam } from '../actions';

export const Content = (props) => {

    useEffect(() => {
        const { param } = props;
        !!param && props.fetchData(param);
    }, [props.param]);

    const _onCheckItem = (isChecked, messageId) => {
        const newCheckedMessages = Object.assign({}, props.checkedMessages, { [messageId]: isChecked });

        props.setShouldResetScrollPosition(false);
        props.setCheckedMessages(newCheckedMessages);
    }

    const _handlePaging = (pageIndex, pageSize) => {
        const newPaging = {
            PageIndex: pageIndex,
            PageSize: pageSize
        };
        const newParam = Object.assign({}, props.param, newPaging);

        props.setPagingOption(newPaging);
        props.setParam(newParam);
    };

    const _onCheckAll = (isCheckAll) => {
        const { checkedMessages } = props;
        const newCheckedMessages = Object.keys(checkedMessages).reduce((accumulator, currentValue) => {
            accumulator[currentValue] = isCheckAll;

            return accumulator;
        }, {});

        props.setShouldResetScrollPosition(false);
        props.setCheckedMessages(newCheckedMessages);
    }

    function _renderHeader() {
        let allChecked = false;
        if (props.checkedMessages && Object.keys(props.checkedMessages).length > 0) {
            allChecked = Object.keys(props.checkedMessages).every(function (key) {
                return props.checkedMessages[key];
            });
        }

        return (
            <Row key="thead">
                <Cell header={true} colWidth={40}>
                    <input
                        className="my-2"
                        id={`checkbox-all`}
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) => _onCheckAll(e.target.checked)}
                    />
                </Cell>
                <Cell header={true} colWidth={40} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={100} title={headerText.Creator}>{headerText.Creator}</Cell>
                <Cell header={true} colWidth={140} title={headerText.PostedDate}>{headerText.PostedDate}</Cell>
                <Cell header={true} colWidth={550} title={headerText.Message}>{headerText.Message}</Cell>
                <Cell header={true} colWidth={100} title={headerText.Important}>{headerText.Important}</Cell>
                <Cell header={true} colWidth={100} title={headerText.UpdatedBy}>{headerText.UpdatedBy}</Cell>
                <Cell header={true} colWidth={140} title={headerText.UpdatedDate}>{headerText.UpdatedDate}</Cell>
            </Row>
        );
    }

    function _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            const { pagingOption } = props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(_buildDataRow(dataItem, i + startIndex));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="8">{resource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    function _buildDataRow(dataItem, index) {
        const creator = htmlDecode(dataItem.Creator);
        const message = htmlDecode(dataItem.Message);
        const important = dataItem.Important ? 'Yes' : 'No';
        const updatedBy = htmlDecode(dataItem.UpdatedBy);
        const textDanger = dataItem.Important ? "text-danger" : "";
        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center">
                    <input type="checkbox" checked={props.checkedMessages[dataItem.MessageId] || false}
                        onChange={(e) => _onCheckItem(e.target.checked, dataItem.MessageId)} />
                </Cell>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center" title={creator}>{creator}</Cell>
                <Cell className="text-center" title={dataItem.PostedDateText}>{dataItem.PostedDateText}</Cell>
                <Cell title={resource.ViewDetail}>
                    <Button color="link" className={`${textDanger} ${!message ? 'h-20' : ''}`} onClick={() => props.setSelectedMessageId(dataItem.MessageId)}>
                        {message}
                    </Button>
                </Cell>
                <Cell className="text-center" title={important}>{important}</Cell>
                <Cell className="text-center" title={updatedBy}>{updatedBy}</Cell>
                <Cell className="text-center" title={dataItem.UpdatedDateText}>{dataItem.UpdatedDateText}</Cell>
            </Row>
        )
    }

    return props.gridData && (
        <div className="data-content">
            <div className="message-content table-responsive table-striped my-2">
                <Table
                    minWidth={1000}
                    autoWidth={true}
                    bodyHeight={300}
                    header={_renderHeader()}
                    body={_renderDataSection(props.gridData)}
                    containerPadding={20}
                    isPaging={true}
                    pageOption={props.pagingOption}
                    onPaging={_handlePaging}
                    shouldResetScrollPosition={props.shouldResetScrollPosition}
                />
            </div>
        </div>
    );
}


function mapStateToProps({ pagingOption, param, checkedMessages, shouldResetScrollPosition, gridData }) {
    return Object.assign({}, { pagingOption, param, checkedMessages, shouldResetScrollPosition, gridData });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedMessageId, fetchData, setPagingOption, setCheckedMessages, setShouldResetScrollPosition, setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));