import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { resizeWidthHeight } from '@/modules/utils';
import { globalResource } from '@/modules/globalResource';
import { headerText, messageDelete, messageSwitchStatus } from '../libs/constants';
import { showConfirmToast, showSuccessToast, showErrorToast } from '@/pages/common/components/Toast';
import { maxWidthHeight, assetStatus } from '../../libs/constants';
import { htmlDecode } from '@/modules/htmlHelper';
import { setSelectedMediaId, setPagingOption, fetchData, setCheckedAssets, setShouldResetScrollPosition, setParam, setAssetDetailUrl, toggleAssetStatus, deleteAssets } from '../actions';

export const Content = (props) => {

    useEffect(() => {
        const { param } = props;

        param && props.fetchData(param);
    }, [props.param]);

    const _onCheckItem = (isChecked, mediaId) => {
        const newCheckedAssets = Object.assign({}, props.checkedAssets, { [mediaId]: {...props.checkedAssets[mediaId], isChecked} });

        props.setShouldResetScrollPosition(false);
        props.setCheckedAssets(newCheckedAssets);
    }

    const _onDeleteItem = async (mediaId, isMediaIdInUse) => {
        if (!isMediaIdInUse) {
            showConfirmToast({
                title: "Delete Asset",
                content: ["Are you sure you want to delete the selected image(s)?"],
                onConfirm: async () => {
                    const result = await props.deleteAssets(`${mediaId}`);
                    if (result && result.IsSuccessful) {
                        props.fetchData(props.param);
                        showSuccessToast("Asset Deleted!", messageDelete.DeleteItemsSuccessfully);
                    } else {
                        showErrorToast("Delete Failed", result?.Message || messageDelete.FailedToDelete);
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
        showConfirmToast({
            title: "Change Status",
            content: [messageSwitchStatus.AreYouSureSwitchStatus],
            onConfirm: async () => {
                const result = await props.toggleAssetStatus({ mediaIds: `${mediaId}`, statusId: newStatus });
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

    function _onCheckAll(isCheckAll) {
        const { checkedAssets } = props;
        const newCheckedAssets = Object.keys(checkedAssets).reduce((accumulator, currentValue) => {
            accumulator[currentValue] = {
                isChecked: isCheckAll,
                isCanDelete: checkedAssets[currentValue].isCanDelete
            };

            return accumulator;
        }, {});

        props.setShouldResetScrollPosition(false);
        props.setCheckedAssets(newCheckedAssets);
    }

    function _renderHeader() {
        let allChecked = false;
        if (props.checkedAssets && Object.keys(props.checkedAssets).length > 0) {
            allChecked = Object.keys(props.checkedAssets).every(function(key) {
                return props.checkedAssets[key].isChecked;
            });
        }

        return (
            <Row key="thead">
                <Cell header={true} colWidth={25}>
                    <input
                        className="my-2"
                        id={`checkbox-all`}
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) => _onCheckAll(e.target.checked)}
                    />
                </Cell>
                <Cell header={true} colWidth={40} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={175} title={headerText.FileName}>{headerText.FileName}</Cell>
                <Cell header={true} colWidth={100} title={headerText.Module}>{headerText.Module}</Cell>
                <Cell header={true} colWidth={100} title={headerText.TargetCountry}>{headerText.TargetCountry}</Cell>
                <Cell header={true} colWidth={100} title={headerText.Language}>{headerText.Language}</Cell>
                <Cell header={true} colWidth={80} title={headerText.Dimensions}>{headerText.Dimensions}</Cell>
                <Cell header={true} colWidth={300} title={headerText.PreviewAsset}>{headerText.PreviewAsset}</Cell>
                <Cell header={true} colWidth={40} title={headerText.Active}>{headerText.Active}</Cell>
                <Cell header={true} colWidth={40} title={headerText.Action}>{headerText.Action}</Cell>
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
                <Cell className="text-center" colSpan="10">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    function _buildDataRow(dataItem, index) {
        const mediaId = dataItem.MediaId;
        const fileName = htmlDecode(dataItem.FileName);
        const mediaName = htmlDecode(dataItem.MediaName);
        const targetCountry = dataItem.TargetCountryName;
        const language = dataItem.MarketName;
        const module = dataItem.ModuleName;
        const src = `${props.bannerRootUrl}/${fileName}?id=${dataItem.UpdatedDate}`;
        const dimension = dataItem.Dimension;
        const strDimension = dimension.split('x');
        const realWidth = strDimension[0];
        const realHeight = strDimension[1];
        const isValidWithHeight = realWidth < maxWidthHeight && realHeight < maxWidthHeight;
        const resizeResult = !isValidWithHeight && resizeWidthHeight(realWidth, realHeight);

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center">
                    <input id={`checkbox${mediaId}`} type="checkbox" checked={props.checkedAssets[mediaId]?.isChecked || false}
                        onChange={(e) => _onCheckItem(e.target.checked, mediaId)} />
                </Cell>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center text-break" title={mediaName}>{mediaName}</Cell>
                <Cell className="text-center text-break" title={module}>{module}</Cell>
                <Cell className="text-center text-break" title={targetCountry}>{targetCountry}</Cell>
                <Cell className="text-center text-break" title={language}>{language}</Cell>
                <Cell className="text-center text-break" title={dimension}>{dimension}</Cell>
                <Cell className="text-center">
                    {
                        isValidWithHeight ? (
                            <img className="img-fluid" id={`img${mediaId}`} src={src} alt="Asset" height={realHeight} width={realWidth} />
                        ) : (
                                <a href="javascript:;" id={`link${mediaId}`} onClick={() => props.setAssetDetailUrl({ src, mediaId, width: realWidth, height: realHeight })}>
                                    <img className="img-fluid" id={`img${mediaId}`} src={src} alt="Asset" height={resizeResult.height} width={resizeResult.width} />
                                </a>
                            )
                    }
                </Cell>
                <Cell className="text-center">
                    <input
                            type="checkbox"
                            id={`activeSwitch${mediaId}`}
                            checked={dataItem.StatusId === assetStatus.active}
                            onChange={() => _onToggleActiveStatus(mediaId, dataItem.StatusId)}
                        />
                </Cell>
                <Cell className="text-center">
                    <Button color="link" onClick={() => props.setSelectedMediaId(mediaId)} title="Edit">
                        <span className="oi oi-pencil text-secondary"></span>
                    </Button>
                    {
                        dataItem.IsMediaIdInUse ? (
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
            <div className="table-responsive table-striped my-2">
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

function mapStateToProps({ pagingOption, param, checkedAssets, bannerRootUrl, shouldResetScrollPosition, gridData }) {
    return Object.assign({}, { pagingOption, param, checkedAssets, bannerRootUrl, shouldResetScrollPosition, gridData });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedMediaId, fetchData, setPagingOption, setCheckedAssets, setShouldResetScrollPosition, setParam, setAssetDetailUrl, toggleAssetStatus, deleteAssets }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));