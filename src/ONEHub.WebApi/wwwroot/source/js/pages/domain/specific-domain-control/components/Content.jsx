import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';
import NotificationPopup from '../../../common/components/NotificationPopup';

import { htmlDecode } from '../../../../modules/htmlHelper';
import { formatDateTime } from '../../../../modules/utils';
import { headerText, globalResource } from '../libs/constants';
import { deleteSpecificDomain, fetchData, toggleLoader, setSelectedDomainId, setShouldResetScrollPosition, setParam, setPagingOption } from '../actions';

export class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedDomainId: 0,
            message: '',
            isConfirmPopup: true
        }
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

    _handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ message: '' });

        const { selectedDomainId } = this.state;
        if (confirmResult && selectedDomainId) {
            this._deleteDomain(selectedDomainId);
        }
    }

    _handleDeleteDomain = (selectedDomainId) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ message: `Are you sure you want to delete this specific domain setting?`, isConfirmPopup: true, selectedDomainId });
    }

    _handleEditDomain = (domainId) => {
        this.props.setShouldResetScrollPosition(false);
        this.props.setSelectedDomainId(domainId);
    }

    _deleteDomain = async (selectedDomainId) => {
        try {
            this.props.toggleLoader(true);

            const result = await this.props.deleteSpecificDomain({ SpecificDomainControlId: selectedDomainId });

            if (!result) {
                throw new Error('No response received from delete operation');
            }

            this.setState({
                message: result.IsSuccessful
                    ? 'The domain control has been removed successfully!'
                    : result.Message,
                isConfirmPopup: false
            });

            if (result.IsSuccessful) {
                await this.props.fetchData(this.props.param);
            }

        } catch (error) {
            this.setState({
                message: 'An error occurred while deleting the domain',
                isConfirmPopup: false
            });
        } finally {
            this.props.toggleLoader(false);
        }
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={20} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={80} title={headerText.Affiliate}>{headerText.Affiliate}</Cell>
                <Cell header={true} colWidth={120} title={headerText.AffDomain}>{headerText.AffDomain}</Cell>
                <Cell header={true} colWidth={120} title={headerText.RedirectDomain}>{headerText.RedirectDomain}</Cell>
                <Cell header={true} colWidth={50} title={headerText.Creator}>{headerText.Creator}</Cell>
                <Cell header={true} colWidth={60} title={headerText.CreatedDate}>{headerText.CreatedDate}</Cell>
                <Cell header={true} colWidth={50} title={headerText.UpdatedBy}>{headerText.UpdatedBy}</Cell>
                <Cell header={true} colWidth={60} title={headerText.UpdatedDate}>{headerText.UpdatedDate}</Cell>
                <Cell header={true} colWidth={35} title={headerText.MobileOnly}>{headerText.MobileOnly}</Cell>
                <Cell header={true} colWidth={25} title={headerText.Status}>{headerText.Status}</Cell>
                <Cell header={true} colWidth={20} title={headerText.Edit}>{headerText.Edit}</Cell>
                <Cell header={true} colWidth={30} title={headerText.Delete}>{headerText.Delete}</Cell>
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
                <Cell className="text-center" colSpan="11">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        const affDomain = htmlDecode(dataItem.AffDomain);
        const redirectDomain = htmlDecode(dataItem.RedirectDomain);
        const creator = htmlDecode(dataItem.Creator);
        const editor = htmlDecode(dataItem.Editor);
        const createdDate = formatDateTime(dataItem.CreatedDate);
        const updatedDate = formatDateTime(dataItem.UpdatedDate);

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center" title={dataItem.AffUsername}>{dataItem.AffUsername}</Cell>
                <Cell className="text-center" title={affDomain}>{affDomain}</Cell>
                <Cell className="text-center" title={redirectDomain}>{redirectDomain}</Cell>
                <Cell className="text-center" title={creator}>{creator}</Cell>
                <Cell className="text-center" title={createdDate}>{createdDate}</Cell>
                <Cell className="text-center" title={editor}>{editor}</Cell>
                <Cell className="text-center" title={updatedDate}>{updatedDate}</Cell>
                <Cell className="text-center">
                    <input type="checkbox" disabled checked={dataItem.IsMobile} />
                </Cell>
                <Cell className="text-center">
                    <input type="checkbox" disabled checked={dataItem.Status} />
                </Cell>
                <Cell className="text-center" title="Edit Domain">
                    <Button color="link p-0" onClick={() => this._handleEditDomain(dataItem.SpecificDomainControlId)}>
                        <span className="oi oi-pencil text-secondary"></span>
                    </Button>
                </Cell>
                <Cell className="text-center" title="Delete Domain">
                    <Button color="link p-0" onClick={() => this._handleDeleteDomain(dataItem.SpecificDomainControlId)}>
                        <span className="oi oi-x text-danger"></span>
                    </Button>
                </Cell>
            </Row>
        )
    }

    render() {
        const { pagingOption, gridData, shouldResetScrollPosition } = this.props;
        const { message, isConfirmPopup } = this.state;

        return gridData && (
            <div className="data-content">
                <div className="my-2">
                    <Button outline type="button" onClick={() => this._handleEditDomain(0)}>Add New <span className="oi oi-plus ml-2"></span></Button>
                </div>
                <div className="domain-list-content table-responsive table-striped my-2">
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

function mapStateToProps({ shouldResetScrollPosition, gridData, param, pagingOption }) {
    return Object.assign({}, { shouldResetScrollPosition, gridData, param, pagingOption });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deleteSpecificDomain, fetchData, toggleLoader, setSelectedDomainId, setShouldResetScrollPosition, setParam, setPagingOption }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);