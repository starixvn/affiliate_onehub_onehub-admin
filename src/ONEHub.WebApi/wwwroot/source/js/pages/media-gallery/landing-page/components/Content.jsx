import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { htmlDecode } from '../../../../modules/htmlHelper';
import { headerText, globalResource, landingPageStatus } from '../libs/constants';
import { setSelectedLandingPageId, setCheckedLandingPages, setShouldResetScrollPosition } from '../actions';
import { _formatDealText } from '../../../common/modules/utils/dealInfoFormat';

export const Content = (props) => {

    const _onCheckItem = (isChecked, landingPageId) => {
        const newCheckedLandingPages = Object.assign({}, props.checkedLandingPages, { [landingPageId]: isChecked });

        props.setShouldResetScrollPosition(false);
        props.setCheckedLandingPages(newCheckedLandingPages);
    }

    const _onCheckAll = (isCheckAll) => {
        const { checkedLandingPages } = props;
        const newCheckedLandingPages = Object.keys(checkedLandingPages).reduce((accumulator, currentValue) => {
            accumulator[currentValue] = isCheckAll;

            return accumulator;
        }, {});

        props.setShouldResetScrollPosition(false);
        props.setCheckedLandingPages(newCheckedLandingPages);
    }

    function _renderHeader() {
        let allChecked = false;
        if (props.checkedLandingPages && Object.keys(props.checkedLandingPages).length > 0) {
            allChecked = Object.keys(props.checkedLandingPages).every(function (key) {
                return props.checkedLandingPages[key];
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
                <Cell header={true} colWidth={30} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={200} title={headerText.LandingPageName}>{headerText.LandingPageName}</Cell>
                <Cell header={true} colWidth={200} title={headerText.LandingPageCode}>{headerText.LandingPageCode}</Cell>
                <Cell header={true} colWidth={350} title={headerText.Deal}>{headerText.Deal}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Status}>{headerText.Status}</Cell>
                <Cell header={true} colWidth={60} title={headerText.MobileOnly}>{headerText.MobileOnly}</Cell>
                <Cell header={true} colWidth={300} title={headerText.BlockTargetCountry}>{headerText.BlockTargetCountry}</Cell>
                <Cell header={true} colWidth={30} title={globalResource.Edit}>{globalResource.Edit}</Cell>
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
                <Cell className="text-center" colSpan="5">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    function _buildDataRow(dataItem, index) {
        const landingPageName = htmlDecode(dataItem.PageName);
        const landingPageCode = htmlDecode(dataItem.PageCode);
        const { dealStr, deal } = _formatDealText(dataItem.DealIds, dataItem.IsExcluded, props.dealList);
        const blockTargetCountry = htmlDecode(dataItem.BlockTargetCountry).split(',').join(', ');
        const status = landingPageStatus[dataItem.StatusId];
        const isDefault = dataItem.IsDefault;
        const canEdit = dataItem.CanEdit;

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center">
                    {
                        isDefault || !canEdit ? (
                            <input type="checkbox" disabled checked={false} />
                        ) : (
                            <input type="checkbox" checked={props.checkedLandingPages[dataItem.PageId] || false}
                                onChange={(e) => _onCheckItem(e.target.checked, dataItem.PageId)} />
                        )
                    }
                </Cell>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-left" title={landingPageName}>{landingPageName}</Cell>
                <Cell className="text-left" title={landingPageCode}>{landingPageCode}</Cell>
                <Cell className="text-center" title={dealStr} dangerouslySetInnerHTML={{ __html: deal }}></Cell>
                <Cell className={`text-center status-${status?.toLowerCase()}`} title={status}>{status}</Cell>
                <Cell className="text-center">
                    <input type="checkbox" disabled checked={dataItem.IsMobile} />
                </Cell>
                <Cell className="text-left" title={blockTargetCountry}>{blockTargetCountry}</Cell>
                <Cell className="text-center" title="Edit Landing Page">
                    {
                        canEdit ? (
                            <Button color="link" onClick={() => props.setSelectedLandingPageId(dataItem.PageId)}>
                                <span className="oi oi-pencil text-secondary"></span>
                            </Button>
                        ) : (
                            <Button color="link" disabled>
                                <span className="oi oi-pencil text-secondary"></span>
                            </Button>
                        )
                    }
                </Cell>
            </Row>
        )
    }

    return props.gridData && (
        <div className="data-content">
            <div className="landing-page-content table-responsive table-striped my-2">
                <Table
                    minWidth={1000}
                    autoWidth={true}
                    bodyHeight={300}
                    header={_renderHeader()}
                    body={_renderDataSection(props.gridData)}
                    containerPadding={20}
                    shouldResetScrollPosition={props.shouldResetScrollPosition}
                />
            </div>
        </div>
    );
}

function mapStateToProps({ checkedLandingPages, shouldResetScrollPosition, gridData, dealList }) {
    return Object.assign({}, { checkedLandingPages, shouldResetScrollPosition, gridData, dealList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedLandingPageId, setCheckedLandingPages, setShouldResetScrollPosition }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));