import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';
import NotificationPopup from '../../../common/components/NotificationPopup';

import { htmlDecode } from '../../../../modules/htmlHelper';
import { formatDateTime } from '../../../../modules/utils';
import { headerText, globalResource } from '../libs/constants';
import { deleteDomain, fetchData, toggleLoader, setSelectedDomainId, setShouldResetScrollPosition } from '../actions';

export class Content extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedDomainId: 0,
            message: '',
            isConfirmPopup: true
        };
    }

    componentDidMount() {
        this.props.fetchData(this.props.isAffDomain);
    }

    _handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ message: '' });

        const { selectedDomainId } = this.state;
        if (confirmResult && selectedDomainId) {
            this._deleteDomain(selectedDomainId);
        }
    }

    _handleDeleteDomain = (selectedDomainId) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ message: `Are you sure you want to delete this ${this.props.isAffDomain ? 'affiliate' : this.props.licenseeName} domain?`, isConfirmPopup: true, selectedDomainId });
    }

    _handleEditDomain = (domainId) => {
        this.props.setShouldResetScrollPosition(false);
        this.props.setSelectedDomainId(domainId);
    }

    _deleteDomain = async (selectedDomainId) => {
        this.props.toggleLoader(true);

        const { isAffDomain, licenseeName } = this.props;
        const result = await this.props.deleteDomain({ DomainId: selectedDomainId, IsAffDomain: isAffDomain });

        if (result) {
            if (result.IsSuccessful) {
                this.setState({ message: `${isAffDomain ? 'Affiliate' : licenseeName} domain has been removed successfully!`, isConfirmPopup: false });

                this.props.fetchData(isAffDomain);
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
                <Cell header={true} colWidth={200} title={headerText.Domain}>{headerText.Domain}</Cell>
                <Cell header={true} colWidth={60} title={headerText.SSL}>{headerText.SSL}</Cell>
                <Cell header={true} colWidth={160} title={headerText.Creator}>{headerText.Creator}</Cell>
                <Cell header={true} colWidth={100} title={headerText.CreatedDate}>{headerText.CreatedDate}</Cell>
                <Cell header={true} colWidth={320} title={headerText.BlockTargetCountry}>{headerText.BlockTargetCountry}</Cell>
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
                <Cell className="text-center" colSpan="8">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        const domainName = htmlDecode(dataItem.DomainName);
        const creator = htmlDecode(dataItem.Creator);
        const createdDate = formatDateTime(dataItem.CreateDate);
        const blockTargetCountry = htmlDecode(dataItem.BlockTargetCountry).split(',').join(', ');

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center" title={domainName}>{domainName}</Cell>
                <Cell className="text-center">
                    <input type="checkbox" disabled checked={dataItem.IsSSL} />
                </Cell>
                <Cell className="text-center" title={creator}>{creator}</Cell>
                <Cell className="text-center" title={createdDate}>{createdDate}</Cell>
                <Cell title={blockTargetCountry}>{blockTargetCountry}</Cell>
                <Cell className="text-center" title="Edit Domain">
                    <Button color="link p-0" onClick={() => this._handleEditDomain(dataItem.DomainId)}>
                        <span className="oi oi-pencil text-secondary"></span>
                    </Button>
                </Cell>
                <Cell className="text-center" title="Delete Domain">
                    <Button color="link p-0" onClick={() => this._handleDeleteDomain(dataItem.DomainId)}>
                        <span className="oi oi-x text-danger"></span>
                    </Button>
                </Cell>
            </Row>
        )
    }

    render() {
        const { gridData, shouldResetScrollPosition, isAffDomain, licenseeName } = this.props;
        const { message, isConfirmPopup } = this.state;

        return gridData && (
            <div className="data-content">
                <div className="my-2">
                    <Button outline type="button" onClick={() => this._handleEditDomain(0)}>
                        {isAffDomain ? 'Add AffDomain' : ('Add ' + licenseeName + ' Domain')}<span className="oi oi-plus ml-2"></span>
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

function mapStateToProps({ shouldResetScrollPosition, gridData, isAffDomain, licenseeName }) {
    return Object.assign({}, { shouldResetScrollPosition, gridData, isAffDomain, licenseeName });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deleteDomain, fetchData, toggleLoader, setSelectedDomainId, setShouldResetScrollPosition }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);