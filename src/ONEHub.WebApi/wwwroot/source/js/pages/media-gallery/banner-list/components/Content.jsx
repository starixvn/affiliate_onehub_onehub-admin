import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { resizeWidthHeight } from '../libs/utils';
import { globalResource, pcLaptop, mobile, userTypeList } from '../../common/libs/constants';
import { headerText, maxWidthHeight } from '../libs/constants';
import { setSelectedBannerId, setPagingOption, fetchData, setCheckedBanners, setShouldResetScrollPosition, setParam, setBannerDetailUrl } from '../actions';

export const Content = (props) => {

    useEffect(() => {
        const { param } = props;

        param && props.fetchData(param);
    }, [props.param]);

    const _onCheckItem = (isChecked, BannerId) => {
        const newCheckedBanners = Object.assign({}, props.checkedBanners, { [BannerId]: isChecked });

        props.setShouldResetScrollPosition(false);
        props.setCheckedBanners(newCheckedBanners);
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
        const { checkedBanners } = props;
        const newCheckedBanners = Object.keys(checkedBanners).reduce((accumulator, currentValue) => {
            accumulator[currentValue] = isCheckAll;

            return accumulator;
        }, {});

        props.setShouldResetScrollPosition(false);
        props.setCheckedBanners(newCheckedBanners);
    }

    function _renderHeader() {
        let allChecked = false;
        if (props.checkedBanners && Object.keys(props.checkedBanners).length > 0) {
            allChecked = Object.keys(props.checkedBanners).every(function (key) {
                return props.checkedBanners[key];
            });
        }
        
        return (
            <Row key="thead">
                <Cell header={true} colWidth={20}>
                    <input
                        className="my-2"
                        id={`checkbox-all`}
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) => _onCheckAll(e.target.checked)}
                    />
                </Cell>
                <Cell header={true} colWidth={25} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={50} title={headerText.UserType}>{headerText.UserType}</Cell>
                <Cell header={true} colWidth={415} title={headerText.Images}>{headerText.Images}</Cell>
                <Cell header={true} colWidth={190} title={headerText.FileName}>{headerText.FileName}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Category}>{headerText.Category}</Cell>
                <Cell header={true} colWidth={55} title={headerText.SubCategory}>{headerText.SubCategory}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Language}>{headerText.Language}</Cell>
                <Cell header={true} colWidth={55} title={headerText.Currency}>{headerText.Currency}</Cell>
                <Cell header={true} colWidth={50} title={headerText.Device}>{headerText.Device}</Cell>
                <Cell header={true} colWidth={50} title={headerText.Size}>{headerText.Size}</Cell>
                <Cell header={true} colWidth={25} title={globalResource.Edit}>{globalResource.Edit}</Cell>
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
                <Cell className="text-center" colSpan="11">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    function _buildDataRow(dataItem, index) {
        const bannerId = dataItem.BannerId;
        const fileName = dataItem.FileName;
        const src = `${props.bannerRootUrl}/${fileName}?id=${dataItem.LastUpdateText}`;
        const size = dataItem.Size;
        const strSize = size.split('x');
        const realWidth = strSize[0];
        const realHeight = strSize[1];
        const isValidWithHeight = realWidth < maxWidthHeight && realHeight < maxWidthHeight;
        const resizeResult = !isValidWithHeight && resizeWidthHeight(realWidth, realHeight);
        const userType = userTypeList[dataItem.UserType] || '';

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center">
                    <input type="checkbox" checked={props.checkedBanners[bannerId] || false}
                        onChange={(e) => _onCheckItem(e.target.checked, bannerId)} />
                </Cell>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center" title={userType}>{userType}</Cell>
                <Cell className="text-center">
                    {
                        isValidWithHeight ? (
                            <img id={`img${bannerId}`} src={src} alt="Banner" height={realHeight} width={realWidth} />
                        ) : (
                                <a href="javascript:;" id={`link${bannerId}`} onClick={() => props.setBannerDetailUrl({ src, bannerId, width: realWidth, height: realHeight })}>
                                    <img id={`img${bannerId}`} src={src} alt="Banner" height={resizeResult.height} width={resizeResult.width} />
                                </a>
                            )
                    }
                </Cell>
                <Cell className="text-center text-break" title={fileName}>{fileName}</Cell>
                <Cell className="text-center text-break">
                    {
                        dataItem.Categories && dataItem.Categories.map(value => {
                            return (<p key={`category-${value}`} value={value}>{value}</p>)
                        })
                    }
                </Cell>
                <Cell className="text-center text-break">
                    {
                        dataItem.SubCategories && dataItem.SubCategories.map(value => {
                            return (<p key={`subCategory-${value}`}>{value}</p>)
                        })
                    }
                </Cell>
                <Cell className="text-center text-break" title={dataItem.Language}>{dataItem.Language}</Cell>
                <Cell className="text-center text-break">
                    {
                        dataItem.Currencies && dataItem.Currencies.map(value => {
                            return (<p key={`currency-${value}`}>{value}</p>)
                        })
                    }
                </Cell>
                <Cell className="text-center text-break">
                    {
                        dataItem.DeviceTypes && dataItem.DeviceTypes.map(value => {
                            return (<p key={`deviceType-${value}`}>{value == 0 ? pcLaptop : mobile}</p>)
                        })
                    }
                </Cell>
                <Cell className="text-center text-break" title={size}>{size}</Cell>
                <Cell className="text-center" title="Edit Banner">
                    <Button color="link" onClick={() => props.setSelectedBannerId(bannerId)}>
                        <span className="oi oi-pencil text-secondary"></span>
                    </Button>
                </Cell>
            </Row>
        )
    }

    return props.gridData && (
        <div className="data-content">
            <div className="banner-list-content table-responsive table-striped my-2">
                <Table
                    minWidth={1250}
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

function mapStateToProps({ pagingOption, param, checkedBanners, bannerRootUrl, shouldResetScrollPosition, gridData }) {
    return Object.assign({}, { pagingOption, param, checkedBanners, bannerRootUrl, shouldResetScrollPosition, gridData });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedBannerId, fetchData, setPagingOption, setCheckedBanners, setShouldResetScrollPosition, setParam, setBannerDetailUrl }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));