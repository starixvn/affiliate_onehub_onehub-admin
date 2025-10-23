import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell, Pager } from '@9softstudio/react-fixed-table-header';

import { toggleLoader } from '../../../actions/loaderAction';
import { fetchMarketingAccounts, setPagingOption } from '../actions';
import { headerText } from '../libs/constants';
import { resolveClientUrl } from '../../../modules/utils';
import { globalResource } from '../../../modules/globalResource';
import { NotificationPopup } from '../../common/components/NotificationPopup';

export const GridData = (props) => {

    const [gridData, setGridData] = useState(null);
    const [shouldResetScrollPosition, setShouldResetScrollPosition] = useState(true);
    const [messageNotification, setMessageNotification] = useState('');

    useEffect(() => {
        const { pagingOption, params } = props;
        if (!params) return;
        const updateParam = { ...params, PageIndex: 1, PageSize: pagingOption.PageSize };
        _fetchData(updateParam);
    }, [props.params]);

    const _fetchData = async (param) => {
        props.toggleLoader(true);

        const data = await props.fetchMarketingAccounts(param);
        if (data) {
            setShouldResetScrollPosition(true);

            const { MainData, TotalItem } = data;
            props.setPagingOption({ TotalItem, PageIndex: param.PageIndex, PageSize: param.PageSize });
            setGridData(MainData);
        }

        props.toggleLoader(false);
    }

    const _renderDataSection = (dataList) => {
        const dataRows = [];

        if (dataList && dataList.length) {
            const { pagingOption } = props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;
            
            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];

                dataRows.push(_renderDataRow(dataItem, i + startIndex));
            }
        }
        else {
            dataRows.push(<Row>
                <Cell className="text-left" colSpan={9}>{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    const _renderHeader = () => {
        return (
            <Row key="thread">
                <Cell header={true} colWidth={20} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={60} title={headerText.UserName}>{headerText.UserName}</Cell>
                <Cell header={true} colWidth={40} title={headerText.AffCode}>{headerText.AffCode}</Cell>
                <Cell header={true} colWidth={60} title={headerText.FirstName}>{headerText.FirstName}</Cell>
                <Cell header={true} colWidth={60} title={headerText.LastName}>{headerText.LastName}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Phone}>{headerText.Phone}</Cell>
                <Cell header={true} colWidth={50} title={headerText.Status}>{headerText.Status}</Cell>
                <Cell header={true} colWidth={60} title={headerText.TargetCountryCode}>{headerText.TargetCountryCode}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Language}>{headerText.Language}</Cell>
                <Cell header={true} colWidth={100} title={headerText.CommissionGroup}>{headerText.CommissionGroup}</Cell>
                <Cell header={true} colWidth={60} title={headerText.RegistrationDateText}>{headerText.RegistrationDateText}</Cell>
                <Cell header={true} colWidth={50} title={headerText.ApprovedByText}>{headerText.ApprovedByText}</Cell>
                {
                    props.canAddAffMktAccount && <Cell header={true} colWidth={30} title={headerText.Action}>{headerText.Action}</Cell>
                }
            </Row>
        );
    }

    const _renderDataRow = (dataItem, index) => {
        const { targetCountryCodeList, languageCodeList, canAddAffMktAccount } = props;

        const language = languageCodeList[dataItem.Language];
        const targetCountry = targetCountryCodeList[dataItem.TargetCountryCode];

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-left" title={dataItem.UserName}>
                    <a href={resolveClientUrl(`Portal/Customer?user=${dataItem.UserName}`)} target="_top">
                        {dataItem.UserName}
                    </a>
                </Cell>
                <Cell className="text-left" title={dataItem.AffCode}>{dataItem.AffCode}</Cell>
                <Cell className="text-left" title={dataItem.FirstName}>{dataItem.FirstName}</Cell>
                <Cell className="text-left" title={dataItem.LastName}>{dataItem.LastName}</Cell>
                <Cell className="text-left" title={dataItem.Phone}>{dataItem.Phone}</Cell>
                <Cell className="text-left" title={dataItem.Status}>{dataItem.Status}</Cell>
                <Cell className="text-left" title={targetCountry}>{targetCountry}</Cell>
                <Cell className="text-left" title={language}>{language}</Cell>
                <Cell className="text-left" title={dataItem.CommissionGroup}>{dataItem.CommissionGroup}</Cell>
                <Cell className="text-left" title={dataItem.RegistrationDateText}>{dataItem.RegistrationDateText}</Cell>
                <Cell className="text-left" title={dataItem.ApprovedByText}>{dataItem.ApprovedByText}</Cell>
                {
                    canAddAffMktAccount && (
                        <Cell className="text-center">
                            <button title="Copy" className="btn btn-link" onClick={() => props.handleAddNewAccount(dataItem.AffId, dataItem.UserName)}>
                                <span className={`oi icon-copy-link`}></span>
                            </button>
                        </Cell>)
                }
            </Row>
        );
    }

    const _handlePaging = (index, size) => {
        const newPaging = {
            PageIndex: index,
            PageSize: size
        };

        const newParam = { ...props.params, ...newPaging };
        _fetchData(newParam);
    }

    return gridData && (
        <React.Fragment>
            <div className="table-responsive table-striped">
                <Table
                    minWidth={1000}
                    autoWidth={true}
                    bodyHeight={300}
                    header={_renderHeader()}
                    body={_renderDataSection(gridData)}
                    containerPadding={20}
                    shouldResetScrollPosition={shouldResetScrollPosition}
                />
            </div>
            <Pager
                pageOption={props.pagingOption}
                onPaging={_handlePaging} />
            {
                !!messageNotification && <NotificationPopup
                    message={messageNotification}
                    isConfirmPopup={false}
                    onClose={() => setMessageNotification('')}
                />
            }
        </React.Fragment>
    )
}

const mapStateToProps = ({ params, languageCodeList, targetCountryCodeList, pagingOption, canAddAffMktAccount }) => {
    return {
        params,
        languageCodeList,
        targetCountryCodeList,
        canAddAffMktAccount,
        pagingOption
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        toggleLoader,
        fetchMarketingAccounts,
        setPagingOption,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(GridData));
