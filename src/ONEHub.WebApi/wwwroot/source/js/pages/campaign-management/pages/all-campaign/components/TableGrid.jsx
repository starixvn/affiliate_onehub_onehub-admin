import React, { useEffect } from 'react';
import { batch, useSelector, useDispatch } from 'react-redux';
import { ActionCreators } from '../actions';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { globalResource } from '@/modules/globalResource';
import ReportTitle from '@/components/ReportTitle';
import { headerText, confirmPopupContent } from '../constants/settings';
import StatusDropdown from './StatusDropdown';
import { showConfirmToast } from '@/pages/common/components/Toast';
import { v4 as uuidv4 } from 'uuid';

const TableGrid = () => {
    const [
        gridData,
        param,
        shouldResetScrollPosition,
        statusList,
        pagingOption
    ] = useSelector(state => [
        state.gridData,
        state.param,
        state.shouldResetScrollPosition,
        state.statusList,
        state.pagingOption
    ]);


    const dispatch = useDispatch();
    const {
        fetchData,
        setPagingOption,
        setParam,
        updateCampaign,
        openCampaignPopup,
        setShouldResetScrollPosition,
        fetchDataForExportExcel
    } = ActionCreators;

    useEffect(() => {
        param && dispatch(fetchData(param));
    }, [param]);


    if (!gridData) {
        return <></>;
    }

    const handleExportExcel = () => {
        const reportTitle = _getReportTitle();
        dispatch(fetchDataForExportExcel(param, reportTitle));
    }


    const handleEdit = (item) => {
        batch(() => {
            dispatch(setShouldResetScrollPosition(false));
            dispatch(openCampaignPopup(false, item));
        });
    }

    const handleStatusChange = (item, newStatusId) => {
        showConfirmToast({
            title: confirmPopupContent.title,
            content: confirmPopupContent.content,
            onConfirm: () => handleConfirmStatusChange(item, newStatusId),
            onCancel: () => { },
            cancelText: "Cancel",
            submitText: "Yes"
        });
    };

    const handleConfirmStatusChange = (item, newStatusId) => {
        var updateParam = {
            campaignId: item.CampaignId,
            campaignCode: item.CampaignCode,
            campaignName: item.CampaignName,
            description: item.Description,
            statusId: newStatusId
        };

        dispatch(updateCampaign(updateParam, () => {
            dispatch(setParam({ ...param, RequestId: uuidv4() }));
        }));
    };

    const _renderHeader = () => {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={30} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={150} title={headerText.CampaignCode}>{headerText.CampaignCode}</Cell>
                <Cell header={true} colWidth={180} title={headerText.CampaignName}>{headerText.CampaignName}</Cell>
                <Cell header={true} colWidth={180} title={headerText.CampaignDescription}>{headerText.CampaignDescription}</Cell>
                <Cell header={true} colWidth={120} title={headerText.CreatedDate}>{headerText.CreatedDate}</Cell>
                <Cell header={true} colWidth={120} title={headerText.CreatedBy}>{headerText.CreatedBy}</Cell>
                <Cell header={true} colWidth={120} title={headerText.LastModifiedDate}>{headerText.LastModifiedDate}</Cell>
                <Cell header={true} colWidth={120} title={headerText.LastModifiedBy}>{headerText.LastModifiedBy}</Cell>
                <Cell header={true} colWidth={90} title={headerText.Status}>{headerText.Status}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Edit}>{headerText.Edit}</Cell>
            </Row>
        );
    }

    const _renderDataSection = () => {
        if (gridData && gridData.length > 0) {
            return gridData.map((item, index) => (
                <Row key={index}>
                    <Cell className="text-center" title={item.RowIdx}>{item.RowIdx}</Cell>
                    <Cell className="text-center" title={item.CampaignCode}>{item.CampaignCode}</Cell>
                    <Cell className="text-left" title={item.CampaignName}>{item.CampaignName}</Cell>
                    <Cell className="text-left" title={item.Description}>{item.Description}</Cell>
                    <Cell className="text-center" title={item.CreatedDateText}>{item.CreatedDateText}</Cell>
                    <Cell className="text-center" title={item.Creator}>{item.Creator}</Cell>
                    <Cell className="text-center" title={item.UpdatedDateText}>{item.UpdatedDateText}</Cell>
                    <Cell className="text-center" title={item.UpdatedBy}>{item.UpdatedBy}</Cell>
                    <Cell className="text-center" title={item.Status}>
                        <StatusDropdown
                            value={item.StatusId || '0'}
                            onChange={(newStatusId) => handleStatusChange(item, newStatusId)}
                        />
                    </Cell>
                    <Cell className="text-center" title="Edit">
                        <span
                            className="oi oi-pencil"
                            style={{ cursor: 'pointer', color: '#007bff' }}
                            onClick={() => handleEdit(item)}
                        ></span>
                    </Cell>
                </Row>
            ));
        }
        return <Row key="no-info">
            <Cell className="text-center" colSpan="10">{globalResource.NoInfo}</Cell>
        </Row>
    }

    const _getReportTitle = () => {
        const listStatusIds = param.StatusIds.split(',');
        const statusText = listStatusIds.length == statusList.length ?
            'All Statuses' :
            `Statuses: ${statusList.filter(status => listStatusIds.includes(status.key.toString())).map(status => status.name).join(', ')}`;
        let searchText = 'All Campaigns';
        if (param.Search && param.Description) {
            searchText = `Campaign Name: ${param.Search} - Description: ${param.Description}`;
        } else if (param.Search) {
            searchText = `Campaign Name: ${param.Search}`;
        } else if (param.Description) {
            searchText = `Description: ${param.Description}`;
        }
        const reportTitle = `CAMPAIGN MANAGEMENT - ${searchText} - ${statusText}`;
        return reportTitle;
    }

    const _buildReportTitle = () => {
        const reportTitle = _getReportTitle();
        return (
            <div className="d-flex align-items-center">
                {reportTitle}
                {gridData && gridData.length > 0 && <button type="button" className="ml-auto btn btn-link btn-excel" onClick={handleExportExcel} title="Export Excel">
                    <span className="oi icon-excel"></span>
                </button>}
            </div>
        );
    }

    const _handlePaging = (pageIndex, pageSize) => {
        batch(() => {
            dispatch(setPagingOption({ PageIndex: pageIndex, PageSize: pageSize }));
            dispatch(setParam({ ...param, PageIndex: pageIndex, PageSize: pageSize }));
        });
    }

    return (
        <>
            <ReportTitle content={_buildReportTitle()} />
            <Table
                key={param.RequestId}
                minWidth={1200}
                autoWidth={true}
                bodyHeight={300}
                header={_renderHeader()}
                body={_renderDataSection()}
                containerPadding={20}
                isPaging={true}
                pageOption={pagingOption}
                onPaging={_handlePaging}
                shouldResetScrollPosition={shouldResetScrollPosition}
            />
        </>
    );
};

export default TableGrid;