import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { htmlDecode } from '../../../modules/htmlHelper';
import { headerText, globalResource } from '../libs/constants';
import { setSelectedEmailId, setPagingOption, fetchData, setCheckedEmails, setShouldResetScrollPosition, setParam } from '../actions';
import DeleteEmail from './DeleteEmail';
import SelectAll from '../../common/components/SelectAll';
import { claimResource } from '../../../modules/claim';

export class Content extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        const { param } = this.props;

        if (param !== prevProps.param) {
            this.props.fetchData(param);
        }
    }

    onCheckItem = (isChecked, emailId) => {
        const newCheckedEmails = Object.assign({}, this.props.checkedEmails, { [emailId]: isChecked });

        this.props.setShouldResetScrollPosition(false);
        this.props.setCheckedEmails(newCheckedEmails);
    }

    handlePaging = (pageIndex, pageSize) => {
        const newPaging = {
            PageIndex: pageIndex,
            PageSize: pageSize
        };
        const newParam = Object.assign({}, this.props.param, newPaging);

        this.props.setPagingOption(newPaging);
        this.props.setParam(newParam);
    };

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={35}></Cell>
                <Cell header={true} colWidth={35} title={headerText.Index}>{headerText.Index}</Cell>
                {
                    this.props.isShowSender && (
                            <Cell header={true} colWidth={300} title={headerText.Sender}>{headerText.Sender}</Cell>
                        )
                }
                <Cell header={true} colWidth={150} title={headerText.Affiliate}>{headerText.Affiliate}</Cell>
                <Cell header={true} colWidth={300} title={headerText.Subject}>{headerText.Subject}</Cell>
                <Cell header={true} colWidth={300} title={headerText.EmailAddress}>{headerText.EmailAddress}</Cell>
                <Cell header={true} colWidth={100} title={headerText.SentDate}>{headerText.SentDate}</Cell>
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
            dataRows.push(<Row>
                <Cell className="text-center" colSpan={this.props.isShowSender ? "7" : "6"}>{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        const { isModifiable, isShowSender } = this.props;
        const email = htmlDecode(dataItem.Email);
        const href = `mailto:${email}`;
        const sender = htmlDecode(dataItem.Sender);
        const affName = htmlDecode(dataItem.AffName);
        const subject = htmlDecode(dataItem.Subject);
        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center">
                    <input type="checkbox" checked={this.props.checkedEmails[dataItem.EmailId]}
                        onChange={(e) => this.onCheckItem(e.target.checked, dataItem.EmailId)} />
                </Cell>
                <Cell title={index} className="text-center">{index}</Cell>
                {
                    isShowSender && (
                            <Cell title={sender}>{sender}</Cell>
                        )
                }
                <Cell title={affName}>{affName}</Cell>
                <Cell title={subject}>
                    {isModifiable
                        ? (<Button color="link" className="p-0" onClick={() => this.props.setSelectedEmailId(dataItem.EmailId)}>
                            {subject}
                        </Button>)
                        : subject
                    }
                </Cell>
                <Cell title={email}>
                    <a target="_top" href={href}>{email}</a>
                </Cell>
                <Cell title={dataItem.SentDate} className="text-center">{dataItem.SentDateText}</Cell>
            </Row>
        )
    }

    render() {
        const { gridData, isModifiable } = this.props;

        return gridData && (
            <div className="data-content">
                {isModifiable && <DeleteEmail />}
                <SelectAll
                    checkedList={this.props.checkedEmails}
                    setCheckedList={this.props.setCheckedEmails}
                    setShouldResetScrollPosition={this.props.setShouldResetScrollPosition}
                />
                <div className="table-responsive table-striped">
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
                        shouldResetScrollPosition={this.props.shouldResetScrollPosition}
                    />
                </div>
            </div>
        );
    }
}


function mapStateToProps({ pagingOption, param, checkedEmails, shouldResetScrollPosition, gridData, claimsPrincipal }) {
    const isModifiable = claimsPrincipal.hasWriteClaim(claimResource.EmailHistory);
    const isShowSender = claimsPrincipal.hasWriteClaim(claimResource.AffPersonalInfo);
    return Object.assign({}, { pagingOption, param, checkedEmails, shouldResetScrollPosition, gridData, isModifiable, isShowSender });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedEmailId, fetchData, setPagingOption, setCheckedEmails, setShouldResetScrollPosition, setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);