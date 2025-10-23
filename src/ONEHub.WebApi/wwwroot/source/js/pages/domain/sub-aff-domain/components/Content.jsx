import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';
import NotificationPopup from '../../../common/components/NotificationPopup';

import { htmlDecode } from '../../../../modules/htmlHelper';
import { headerText, globalResource } from '../libs/constants';
import { deleteSubAffDomain, fetchData, toggleLoader, setSelectedSubAffDomain, setShouldResetScrollPosition } from '../actions';

export class Content extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedSubAffDomainId: 0,
            message: '',
            isConfirmPopup: true
        };
    }

    componentDidMount() {
        this.props.fetchData();
    }

    _handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ message: '' });

        const { selectedSubAffDomainId } = this.state;
        if (confirmResult && selectedSubAffDomainId) {
            this._deleteSubAffDomain(selectedSubAffDomainId);
        }
    }

    _handleDeleteSubAffDomain = (selectedSubAffDomainId) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ message: `Are you sure you want to delete this sub-affiliate domain?`, isConfirmPopup: true, selectedSubAffDomainId });
    }

    _handleEditDomain = (domainId, domainName, isSSL) => {
        this.props.setShouldResetScrollPosition(false);
        this.props.setSelectedSubAffDomain({ domainId, domainName, isSSL });
    }

    _deleteSubAffDomain = async (selectedSubAffDomainId) => {
        this.props.toggleLoader(true);

        const result = await this.props.deleteSubAffDomain({ DomainId: selectedSubAffDomainId });

        if (result) {
            if (result.IsSuccessful) {
                this.setState({ message: `The Sub-Affiliate Domain has been removed successfully!`, isConfirmPopup: false });

                this.props.fetchData();
            }
            else {
                this.setState({ message: result.Message, isConfirmPopup: false });
            }
        }

        this.props.toggleLoader(false);
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={60} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={500} title={headerText.Domain}>{headerText.Domain}</Cell>
                <Cell header={true} colWidth={60} title={headerText.SSL}>{headerText.SSL}</Cell>
                <Cell header={true} colWidth={160} title={headerText.Creator}>{headerText.Creator}</Cell>
                <Cell header={true} colWidth={100} title={headerText.CreatedDate}>{headerText.CreatedDate}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Edit}>{headerText.Edit}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Delete}>{headerText.Delete}</Cell>
            </Row>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(this._buildDataRow(dataItem, i + 1));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="7">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        const domainName = htmlDecode(dataItem.DomainName);
        const creator = htmlDecode(dataItem.Creator);

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center" title={domainName}>{domainName}</Cell>
                <Cell className="text-center">
                    <input type="checkbox" disabled checked={dataItem.IsSSL} />
                </Cell>
                <Cell className="text-center" title={creator}>{creator}</Cell>
                <Cell className="text-center" title={dataItem.CreatedDateText}>{dataItem.CreatedDateText}</Cell>
                <Cell className="text-center" title="Edit Domain">
                    <Button color="link p-0" onClick={() => this._handleEditDomain(dataItem.DomainId, domainName, dataItem.IsSSL)}>
                        <span className="oi oi-pencil text-secondary"></span>
                    </Button>
                </Cell>
                <Cell className="text-center" title="Delete Domain">
                    <Button color="link p-0" onClick={() => this._handleDeleteSubAffDomain(dataItem.DomainId)}>
                        <span className="oi oi-x text-danger"></span>
                    </Button>
                </Cell>
            </Row>
        )
    }

    render() {
        const { gridData, shouldResetScrollPosition } = this.props;
        const { message, isConfirmPopup } = this.state;

        return gridData && (
            <div className="data-content">
                <div className="my-2">
                    <Button outline type="button" onClick={() => this._handleEditDomain(0, '', true)}>
                        Add Sub-Affiliate Domain <span className="oi oi-plus ml-2"></span>
                    </Button>
                </div>
                <div className="domain-list-content table-responsive table-striped my-2">
                    <Table
                        minWidth={1000}
                        autoWidth={true}
                        bodyHeight={300}
                        header={this._renderHeader()}
                        body={this._renderDataSection(gridData)}
                        containerPadding={20}
                        shouldResetScrollPosition={shouldResetScrollPosition}
                    />
                </div>
                {
                    !!message && <NotificationPopup
                        message={message}
                        isConfirmPopup={isConfirmPopup}
                        onClose={this._handleCloseNotificationPopup}
                    />
                }
            </div>
        );
    }
}

function mapStateToProps({ shouldResetScrollPosition, gridData }) {
    return Object.assign({}, { shouldResetScrollPosition, gridData });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deleteSubAffDomain, fetchData, toggleLoader, setSelectedSubAffDomain, setShouldResetScrollPosition }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);