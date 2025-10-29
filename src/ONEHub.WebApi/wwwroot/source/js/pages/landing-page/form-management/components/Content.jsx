import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { globalResource } from '../../../../modules/globalResource';
import { headerText, messageDelete, messageSwitchStatus } from '../libs/constants';
import { showConfirmToast, showSuccessToast, showErrorToast } from '../../../common/components/Toast';
import { assetStatus } from '../../libs/constants';
import { setSelectedMediaId, setPagingOption, fetchData, setCheckedForms, setShouldResetScrollPosition, setParam, setFormDetailUrl, deleteForms, toggleFormStatus, setNotification } from '../actions';
import { htmlDecode } from '../../../../modules/htmlHelper';

export const Content = (props) => {
    const { isModifyInFormUploader } = props;

    useEffect(() => {
        const { param } = props;

        param && props.fetchData(param);
    }, [props.param]);

    const _onDeleteItem = async (mediaId, isMediaIdInUse) => {
        if (isModifyInFormUploader && !isMediaIdInUse) {
            showConfirmToast({
                title: "Delete Form",
                content: ["Are you sure you want to delete the selected form(s)?"],
                onConfirm: async () => {
                    const result = await props.deleteForms(`${mediaId}`);
                    if (result && result.IsSuccessful) {
                        props.fetchData(props.param);
                        showSuccessToast("Form Deleted!", messageDelete.DeleteItemsSuccessfully);
                    } else {
                        showErrorToast("Delete Failed", result?.Message || messageDelete.FailedToDeleteItems);
                    }
                },
                onCancel: () => {
                    // Cancel callback - do nothing
                }
            });
        }
    }

    const _onToggleActiveStatus = async (mediaId, currentStatus) => {
        const newStatus = currentStatus === assetStatus.active ? assetStatus.inactive : assetStatus.active;

        if (!isModifyInFormUploader) {
            return;
        }

        showConfirmToast({
            title: "Change Status",
            content: messageSwitchStatus.AreYouSureSwitchStatus,
            onConfirm: async () => {
                const result = await props.toggleFormStatus({ mediaIds: `${mediaId}`,statusId: newStatus });
                if (result && result.IsSuccessful) {
                    props.fetchData(props.param);
                    showSuccessToast("Status Updated!", messageSwitchStatus.SwitchStatusSuccessfully);
                } else {
                    showErrorToast("Status Update Failed", result?.Message || messageSwitchStatus.FailedToSwitchStatus);
                }
            },
            onCancel: () => {
                // Cancel callback - do nothing
            }
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
                <Cell header={true} colWidth={15} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={100} title={headerText.FormName}>{headerText.FormName}</Cell>
                <Cell header={true} colWidth={100} title={headerText.PreviewImageName}>{headerText.PreviewImageName}</Cell>
                <Cell header={true} colWidth={100} title={headerText.TargetCountry}>{headerText.TargetCountry}</Cell>
                <Cell header={true} colWidth={100} title={headerText.Language}>{headerText.Language}</Cell>
                <Cell header={true} colWidth={200} title={headerText.PreviewImage}>{headerText.PreviewImage}</Cell>
                <Cell header={true} colWidth={30} title={headerText.Active}>{headerText.Active}</Cell>
                <Cell header={true} colWidth={30} title={headerText.Action}>{headerText.Action}</Cell>
            </Row>
        );
    }

    function _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList && dataList.length) {
            const { pagingOption } = props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(_buildDataRow(dataItem, i + startIndex));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="9">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    function _buildDataRow(dataItem, index) {
        const mediaId = dataItem.MediaId;
        const fileName = htmlDecode(dataItem.FileName);
        const imageName = fileName ? fileName.substring(fileName.lastIndexOf('/') + 1) : '';
        const mediaName = htmlDecode(dataItem.MediaName);
        const targetCountry = dataItem.TargetCountryName;
        const language = dataItem.MarketName;
        const src = `${props.bannerRootUrl}/${fileName}?id=${dataItem.UpdatedDate}`;

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center text-break" title={mediaName}>{mediaName}</Cell>
                <Cell className="text-center text-break" title={imageName}>{imageName}</Cell>
                <Cell className="text-center text-break" title={targetCountry}>{targetCountry}</Cell>
                <Cell className="text-center text-break" title={language}>{language}</Cell>
                <Cell className="text-center">
                    <img className="img-fluid" id={`img${mediaId}`} src={src} alt="Preview Image" maxWidth={100} maxHeight={100} />
                </Cell>
                <Cell className="text-center">
                    <input
                            type="checkbox"
                            id={`activeSwitch${mediaId}`}
                            disabled={!isModifyInFormUploader}
                            checked={dataItem.StatusId === assetStatus.active}
                            onChange={() => _onToggleActiveStatus(mediaId, dataItem.StatusId)}
                        />
                </Cell>
                <Cell className="text-center">
                    <Button color="link" onClick={() => props.setSelectedMediaId(mediaId)} title="Edit">
                        <span className="oi oi-pencil text-secondary"></span>
                    </Button>
                    {
                        !isModifyInFormUploader || dataItem.IsMediaIdInUse ? (
                            <Button color="link" disabled title="Delete" className="ml-1">
                                <span className="oi oi-trash"></span>
                            </Button>
                        ) : (
                            <Button color="link" onClick={() => _onDeleteItem(mediaId, dataItem.IsMediaIdInUse)} title="Delete" className="ml-1">
                                <span className="oi oi-trash text-danger"></span>
                            </Button>
                        )
                    }
                </Cell>
            </Row>
        )
    }

    return props.gridData && (
        <div className="data-content">
            <div className="banner-list-content table-responsive table-striped my-2">
                <Table
                    minWidth={1190}
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

function mapStateToProps({ pagingOption, checkedForms, shouldResetScrollPosition, gridData, param, bannerRootUrl, isModifyInFormUploader }) {
    return Object.assign({}, { pagingOption, checkedForms, shouldResetScrollPosition, gridData, param, bannerRootUrl, isModifyInFormUploader });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedMediaId, fetchData, setPagingOption, setCheckedForms, setShouldResetScrollPosition, setParam, setFormDetailUrl, setNotification, toggleFormStatus, deleteForms }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));