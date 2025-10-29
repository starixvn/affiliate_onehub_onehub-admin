import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import IframeHoverPreview from './IframeHoverPreview';
import StatusDropdown from '../../common/components/StatusDropdown';

import { resolveClientUrl, formatDateTime } from '../../../../modules/utils';
import { headerText, globalResource } from '../libs/constants';
import { landingPageStatus, messageSwitchLandingPageStatus } from '../../libs/constants';
import { setShouldResetScrollPosition, fetchData, setPagingOption, setNotification, toggleLandingPageStatus, setParam } from '../actions';
import { showConfirmToast, showSuccessToast, showErrorToast } from '../../../common/components/Toast';

export const Content = (props) => {
    const { statusList, isModifyInPageManagement } = props;
    const [refreshLandingPageUrl, setRefreshLandingPageUrl] = useState();

    useEffect(() => {
        const { param } = props;

        param && props.fetchData(param);
    }, [props.param]);

    // Convert statusList to StatusDropdown format
    const getStatusOptions = () => {
        if (!statusList) return [];
        
        return statusList.map(status => {
            const statusName = status.name.toLowerCase();
            return {
                value: status.key.toString(),
                label: status.name,
                type: statusName,
                className: `status-select--${statusName}`
            };
        });
    };
    
    const _onStatusChange = (pageId, newStatusId, landingPageUrl) => {
        if (!isModifyInPageManagement) {
            return;
        }

        const newStatus = statusList.find(item => item.key == newStatusId);

        // Use the same confirm toast as all-campaign (blue styling)
        showConfirmToast({
            title: "Confirm Status Change",
            content: messageSwitchLandingPageStatus.AreYouSureSwitchStatus,
            onConfirm: async () => {
                const result = await props.toggleLandingPageStatus({ pageId, statusId: newStatus.key });
                if (result && result.IsSuccessful) {
                    props.fetchData(props.param);
                }

                // Show toast notification for feedback
                if (result?.IsSuccessful) {
                    return showSuccessToast('Status Updated', messageSwitchLandingPageStatus.SwitchStatusSuccessfully);
                } else {
                    return showErrorToast('Status Update Failed', result?.Message || messageSwitchLandingPageStatus.FailedToSwitchStatus);
                }
            },
            onCancel: () => {
                // Cancel callback - no action needed
            },
            cancelText: "Cancel",
            submitText: "Yes"
        });
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

    function _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={10} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={50} title={headerText.CampaignCode}>{headerText.CampaignCode}</Cell>
                <Cell header={true} colWidth={60} title={headerText.CampaignName}>{headerText.CampaignName}</Cell>
                <Cell header={true} colWidth={60} title={headerText.PageName}>{headerText.PageName}</Cell>
                <Cell header={true} colWidth={50} title={headerText.PageCode}>{headerText.PageCode}</Cell>
                <Cell header={true} colWidth={30} title={headerText.TargetCountry}>{headerText.TargetCountry}</Cell>
                <Cell header={true} colWidth={40} title={headerText.Language}>{headerText.Language}</Cell>
                <Cell header={true} colWidth={15} title={headerText.Deal}>{headerText.Deal}</Cell>
                <Cell header={true} colWidth={30} title={headerText.CreatedDate}>{headerText.CreatedDate}</Cell>
                <Cell header={true} colWidth={30} title={headerText.CreatedBy}>{headerText.CreatedBy}</Cell>
                <Cell header={true} colWidth={30} title={headerText.LastModifiedDate}>{headerText.LastModifiedDate}</Cell>
                <Cell header={true} colWidth={30} title={headerText.LastModifiedBy}>{headerText.LastModifiedBy}</Cell>
                <Cell header={true} colWidth={40} title={headerText.Status}>{headerText.Status}</Cell>
                <Cell header={true} colWidth={20} title={headerText.Action}>{headerText.Action}</Cell>
            </Row>
        );
    }

    function _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(_buildDataRow(dataItem, i + 1));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="14">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    function _buildDataRow(dataItem, index) {
        const campaignCode = dataItem.CampaignCode;
        const campaignName = dataItem.CampaignName;
        const landingPageName = dataItem.PageName;
        const landingPageCode = dataItem.PageCode;
        const targetCountry = dataItem.TargetCountryName;
        const language = dataItem.Language || '';
        const deal = dataItem.NoOfDeals || '';
        const dealList = dataItem.Deals?.replace(/, /g, '\n') || '';
        const createdDate = formatDateTime(dataItem.CreatedDate, 'MM/dd/yyyy');
        const lastModified = formatDateTime(dataItem.LastModifiedDate, 'MM/dd/yyyy') || '--';
        const statusItem = props.statusList && props.statusList.find(item => item.key === dataItem.StatusId);
        const isCanPreview = dataItem.StatusId !== landingPageStatus.inactive;
        const createdBy = dataItem.CreatedBy || '';
        const lastModifiedBy = dataItem.LastModifiedBy || '--';
        const landingPageUrl = `${props.landingPageUrl}/${dataItem.TargetLanguageCode}/${landingPageCode}`;

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-left" title={campaignCode}>{campaignCode}</Cell>
                <Cell className="text-left" title={campaignName}>{campaignName}</Cell>
                <Cell className="text-left" title={landingPageName}>
                    {
                        isCanPreview ? (<IframeHoverPreview src={landingPageUrl} isCanPreview={isCanPreview}>
                            <a href={landingPageUrl} target="_blank">
                                {landingPageName}
                            </a>
                        </IframeHoverPreview>) : (landingPageName)
                    }
                </Cell>
                <Cell className="text-left" title={landingPageCode}>{landingPageCode}</Cell>
                <Cell className="text-center" title={targetCountry}>{targetCountry}</Cell>
                <Cell className="text-center" title={language}>{language}</Cell>
                <Cell className="text-center text-primary" title={dealList}>{deal}</Cell>
                <Cell className="text-center" title={createdDate}>{createdDate}</Cell>
                <Cell className="text-center" title={createdBy}>{createdBy}</Cell>
                <Cell className="text-center" title={lastModified}>{lastModified}</Cell>
                <Cell className="text-center" title={lastModifiedBy}>{lastModifiedBy}</Cell>
                <Cell className="text-center" title={statusItem.name}>
                    <StatusDropdown
                        value={dataItem.StatusId?.toString() || ''}
                        onChange={(newStatusId) => _onStatusChange(dataItem.PageId, newStatusId, landingPageUrl)}
                        disabled={!isModifyInPageManagement}
                        statusOptions={getStatusOptions()}
                    />
                </Cell>
                <Cell className="text-center">
                    <a href={resolveClientUrl(`Portal/PageBuilder?pageId=${dataItem.PageId}`)} target="_top" title="Edit Landing Page">
                        <span className="oi oi-pencil text-secondary"></span>
                    </a>
                    <a className='ml-2' href={resolveClientUrl(`Portal/PageBuilder?pageId=${dataItem.PageId}&isClone=true`)} target="_top" title="Duplicate Landing Page">
                        <span className="oi oi-layers text-secondary"></span>
                    </a>
                </Cell>
            </Row>
        )
    }

    return props.gridData && (
        <div className="data-content landing-page-management">
            <div className="table-responsive table-striped my-2">
                <Table
                    minWidth={1475}
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
            {
                refreshLandingPageUrl
                && <iframe
                        title="Refresh Landing Page"
                        src={refreshLandingPageUrl}
                        style={{
                            display: 'none'
                        }}
                    />
            }
        </div>
    );
}

function mapStateToProps({ shouldResetScrollPosition, gridData, pagingOption, param, statusList, landingPageUrl, allLanguagesInSystem, isModifyInPageManagement }) {
    return Object.assign({}, { shouldResetScrollPosition, gridData, pagingOption, param, statusList, landingPageUrl, allLanguagesInSystem, isModifyInPageManagement });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setShouldResetScrollPosition, fetchData, setPagingOption, setNotification, toggleLandingPageStatus, setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));