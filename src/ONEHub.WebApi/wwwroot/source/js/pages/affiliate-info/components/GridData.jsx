import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button, Table } from 'reactstrap';
import { Pager } from '@9softstudio/react-fixed-table-header';

import { headerText, resource, regExp, defaultSelectedColumnNumber, globalResource, defaultSortBy, minWidthOfColumns } from '../libs/constants';
import { setPagingOption, setShowPopupPassword, setShowPopupCommGroup, setAffId, setCommGroup, setParam, setParentAffName } from '../actions';
import { toggleLoader } from '../../../actions/loaderAction';
import { post } from '../../../modules/ajaxRequest';
import { format, formatDecimal } from '../../../modules/numberFormat';
import { updateObjectInArray } from '../../../modules/dataHandler';
import { resolveClientUrl, clearUserPanelMenuCookie } from '../../../modules/utils';
import { convertSelectedColumnList } from '../libs/utils';
import { htmlDecode } from '../../../modules/htmlHelper';
import { claimResource } from '../../../modules/claim';
import NotificationPopup from '../../common/components/NotificationPopup';

export class GridData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gridData: null,
            shouldResetScrollPosition: true,
            messageNotification: ''
        }

        this.tableRef = createRef();
    }

    componentDidMount() {
        clearUserPanelMenuCookie();
    }

    componentDidUpdate(prevProps) {
        const { param } = this.props;

        if (param !== prevProps.param) {
            const { pagingOption } = this.props;
            const updateParam = Object.assign({}, param, { PageIndex: 1, PageSize: pagingOption.PageSize });

            this.fetchData(updateParam);
        }
    }

    async fetchData(param) {
        this._resetScroll();
        this.props.toggleLoader(true);
        const regexCheckAffCode = new RegExp(regExp.CheckAffCode);

        if (param.AffCode === '' || regexCheckAffCode.test(param.AffCode)) {
            const url = 'Portal/Affiliate/GetAffiliateList';
            const response = await post(url, param);

            if (response && response.status === 200) {
                const { MainData, TotalItem } = response.data;

                this.setState({ gridData: MainData, shouldResetScrollPosition: true });

                this.props.setPagingOption({ TotalItem, PageIndex: param.PageIndex, PageSize: param.PageSize });
            }
        }
        else {
            this.setState({ gridData: {}, shouldResetScrollPosition: true });

            this.props.setPagingOption({ TotalItem: 0, PageIndex: param.PageIndex, PageSize: param.PageSize });
        }
        this.props.toggleLoader(false);
    }

    _handleViewSubAff = (userName) => {
        this.props.setParentAffName(userName);

        const newParam = {
            ParentAffName: userName,
            GroupId: 0,
            TargetCountryCode: '',
            Language: '',
            Status: '',
            UserName: '',
            Email: '',
            SortBy: defaultSortBy,
            SortDirectionType: false,
            AffCode: ''
        };

        this.props.setParam(newParam);
    }
    _renderHeader(selectedColumnList) {
        return (
            <tr className="freeze-row" key="theard">
                <th className="freeze-column-header freeze-column-header-0" width={50} title={headerText.Index.label}>{headerText.Index.label}</th>
                <th className="freeze-column-header freeze-column-header-1" width={90} title={headerText.ParentAffName.label}>{headerText.ParentAffName.label}</th>
                <th className="freeze-column-header freeze-column-header-2" width={125} title={headerText.UserName.label}>{headerText.UserName.label}</th>
                {selectedColumnList['AffCode'] && <th width={75} title={headerText.AffCode.label}>{headerText.AffCode.label}</th>}
                {selectedColumnList['Status'] && <th width={75} title={headerText.Status.label}>{headerText.Status.label}</th>}
                {selectedColumnList['FirstName'] && <th width={75} title={headerText.FirstName.label}>{headerText.FirstName.label}</th>}
                {selectedColumnList['LastName'] && <th width={75} title={headerText.LastName.label}>{headerText.LastName.label}</th>}
                {selectedColumnList['TargetCountryCode'] && <th width={75} title={headerText.TargetCountryCode.label}>{headerText.TargetCountryCode.label}</th>}
                {selectedColumnList['Language'] && <th width={75} title={headerText.Language.label}>{headerText.Language.label}</th>}
                {selectedColumnList['Phone'] && <th width={100} title={headerText.Phone.label}>{headerText.Phone.label}</th>}
                {selectedColumnList['Email'] && <th width={175} title={headerText.Email.label}>{headerText.Email.label}</th>}
                {selectedColumnList['RegistrationDateText'] && <th width={100} title={headerText.RegistrationDateText.label}>{headerText.RegistrationDateText.label}</th>}
                {selectedColumnList['ApprovalDateText'] && <th width={100} title={headerText.ApprovalDateText.label}>{headerText.ApprovalDateText.label}</th>}
                {selectedColumnList['ApprovedByText'] && <th width={100} title={headerText.ApprovedByText.label}>{headerText.ApprovedByText.label}</th>}
                {selectedColumnList['CommissionGroup'] && <th width={100} title={headerText.CommissionGroup.label}>{headerText.CommissionGroup.label}</th>}
                {selectedColumnList['BalanceBf'] && <th width={100} title={headerText.BalanceBf.label}>{headerText.BalanceBf.label}</th>}
                {selectedColumnList['Currency'] && <th width={75} title={headerText.Currency.label}>{headerText.Currency.label}</th>}
                {selectedColumnList['PlayerUserName'] && <th width={100} title={headerText.PlayerUserName.label}>{headerText.PlayerUserName.label}</th>}
                {selectedColumnList['PlayerCurrency'] && <th width={75} title={headerText.PlayerCurrency.label}>{headerText.PlayerCurrency.label}</th>}
                {selectedColumnList['Member'] && <th width={50} title={headerText.Member.label}>{headerText.Member.label}</th>}
                {selectedColumnList['NoOfSubAff'] && <th width={90} title={headerText.NoOfSubAff.label}>{headerText.NoOfSubAff.label}</th>}
                <th width={70} title={headerText.Password.label}>{headerText.Password.label}</th>
            </tr>
        );
    }

    _renderDataSection(dataList, selectedColumnList) {
        const dataRows = [];

        if (dataList.length) {
            const { pagingOption } = this.props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];

                dataRows.push(this._buildDataRow(dataItem, i + startIndex, selectedColumnList));
            }
        }
        else {
            const selectedColumnNumber = Object.keys(selectedColumnList).filter(key => !!selectedColumnList[key]).length
            dataRows.push(<tr key="no-info">
                <td className="text-center" colSpan={defaultSelectedColumnNumber + selectedColumnNumber}>{globalResource.NoInfo}</td>
            </tr>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index, selectedColumnList) {
        const { languageList, targetCountryList, isShowMemberLink } = this.props;
        const status = dataItem.Status && htmlDecode(dataItem.Status).toLowerCase();
        const isApproved = status == "approved";
        const commissionGroup = htmlDecode(dataItem.CommissionGroup);
        const firstName = htmlDecode(dataItem.FirstName);
        const lastName = htmlDecode(dataItem.LastName);
        const phone = htmlDecode(dataItem.Phone);
        const email = htmlDecode(dataItem.Email);
        const playerUserName = htmlDecode(dataItem.PlayerUserName);
        const approvedBy = htmlDecode(dataItem.ApprovedByText);

        const balanceBf = dataItem.BalanceBf === null ? resource.NA : formatDecimal(dataItem.BalanceBf);
        const formattedMemberValue = dataItem.Member === null ? resource.NA : format(dataItem.Member);
        const formattedSubAffValue = dataItem.NoOfSubAff === null ? resource.NA : format(dataItem.NoOfSubAff);
        const member = dataItem.Member === null ? resource.NA : (
            isShowMemberLink ? (
            <a href={resolveClientUrl(`Portal/Player?AffName=${dataItem.UserName}`)} target="_top">
                {formattedMemberValue}
                </a>) : formattedMemberValue
        );
        const noOfSubAff = dataItem.NoOfSubAff === null ? resource.NA : (
            <Button color="link" className="p-0" onClick={() => this._handleViewSubAff(dataItem.UserName)}>
                {formattedSubAffValue}
            </Button>);
        const targetCountry = targetCountryList[dataItem.TargetCountryCode];
        const language = languageList[dataItem.Language];

        const isFavorite = dataItem.IsFavorite
        const checkFavorite = isFavorite ? "favor-check" : "favor-uncheck";
        const classNameFavorite = isApproved ? checkFavorite : "";

        return (
            <tr key={`dataRow-${index}`}>
                <td className="text-center freeze-column-body freeze-column-body-0" title={index}>{index}</td>
                <td className="freeze-column-body freeze-column-body-1" title={dataItem.ParentAffName}>
                    {
                        dataItem.ParentAffName ? (
                            <a href={resolveClientUrl(`Portal/Customer?user=${dataItem.ParentAffName}`)} target="_top">
                                {dataItem.ParentAffName}
                            </a>
                        ) : 'N/A'
                    }
                </td>
                <td className="freeze-column-body freeze-column-body-2" title={dataItem.UserName}>
                    <a href={resolveClientUrl(`Portal/Customer?user=${dataItem.UserName}`)} target="_top">
                        {dataItem.UserName}
                    </a>
                    <span className={classNameFavorite} onClick={() => this.handleToggleFavorite(dataItem.AffId, isFavorite)}></span>
                </td>
                {selectedColumnList['AffCode'] && <td title={dataItem.AffCode}>{dataItem.AffCode}</td>}
                {selectedColumnList['Status'] && <td title={dataItem.Status}>{dataItem.Status}</td>}
                {selectedColumnList['FirstName'] && <td title={firstName}>{firstName}</td>}
                {selectedColumnList['LastName'] && <td title={lastName}>{lastName}</td>}
                {selectedColumnList['TargetCountryCode'] && <td title={targetCountry}>{targetCountry}</td>}
                {selectedColumnList['Language'] && <td title={language}>{language}</td>}
                {selectedColumnList['Phone'] && <td title={phone}>{phone}</td>}
                {selectedColumnList['Email'] && <td title={email}>{email}</td>}
                {selectedColumnList['RegistrationDateText'] && <td title={dataItem.RegistrationDateText}>{dataItem.RegistrationDateText}</td>}
                {selectedColumnList['ApprovalDateText'] && <td title={dataItem.ApprovalDateText}>{dataItem.ApprovalDateText}</td>}
                {selectedColumnList['ApprovedByText'] && <td title={approvedBy}>{approvedBy}</td>}
                {selectedColumnList['CommissionGroup'] && <td title={commissionGroup}>{commissionGroup}</td>}
                {selectedColumnList['BalanceBf'] && <td className="text-right" title={balanceBf}>{balanceBf}</td>}
                {selectedColumnList['Currency'] && <td title={dataItem.Currency}>{dataItem.Currency}</td>}
                {selectedColumnList['PlayerUserName'] && <td title={playerUserName}>{playerUserName}</td>}
                {selectedColumnList['PlayerCurrency'] && <td title={dataItem.PlayerCurrency}>{dataItem.PlayerCurrency}</td>}
                {selectedColumnList['Member'] && <td className="text-right" title={formattedMemberValue}>{member}</td>}
                {selectedColumnList['NoOfSubAff'] && <td className="text-right" title={formattedSubAffValue}>{noOfSubAff}</td>}
                <td className="text-center" title="Change Password">
                    {
                        isApproved && (<Button color="link" onClick={() => this.handleChangePassword(dataItem.AffId)}>
                            <span className="oi oi-pencil text-secondary" style={{ position: 'static' }}></span>
                        </Button>)
                    }
                </td> 
            </tr>
        );
    }

    handleToggleFavorite = (affId, isFavorite) => {
        const param = {
            AffId: affId,
            IsFavorite: !isFavorite
        }

        this.saveToggleFavorite(param);
    }

    async saveToggleFavorite(param) {
        const url = `Portal/Affiliate/ToggleFavorite`;
        const response = await post(url, param);

        if (response) {
            if (response.data.IsSuccessful) {
                const { gridData } = this.state;
                const indexItem = gridData.findIndex(item => item.AffId === param.AffId);
                const updateItem = Object.assign({}, gridData[indexItem], { IsFavorite: param.IsFavorite });
                const gridDataUpdate = updateObjectInArray(gridData, indexItem, updateItem)

                this.setState({ gridData: gridDataUpdate, shouldResetScrollPosition: false });
            }
            else {
                this.setState({ messageNotification: response.data.Message });
            }
        }
    }

    handleChangePassword = (affId) => {
        this.props.setShowPopupPassword(true);
        this.props.setAffId(affId);
    }

    handlePaging = (index, size) => {
        const newPaging = {
            PageIndex: index,
            PageSize: size
        };
        this.props.setPagingOption(newPaging);

        const newParam = Object.assign({}, this.props.param, newPaging);
        this.fetchData(newParam);
    }

    _resetScroll = () => {
        if (!!this.tableRef.current) {
            this.tableRef.current.scrollTop = 0;
            this.tableRef.current.scrollLeft = 0;
        }
    }

    _getMinWidthOfTable = (selectedColumnList) => {
        let minWidth = 335;

        Object.keys(selectedColumnList).map(key => {
            minWidth = minWidth + minWidthOfColumns[key];
        })

        return minWidth
    }

    handleCloseNotificationPopup = () => {
        this.setState({ messageNotification: '' })
    }

    render() {
        const { gridData, messageNotification } = this.state;

        if (!gridData) {
            return null;
        }

        const { columnList } = this.props;
        const selectedColumnList = convertSelectedColumnList(columnList);
        const minWidth = this._getMinWidthOfTable(selectedColumnList);

        return (
            <React.Fragment>
                <div className="table-responsive table-striped aff-info-table-container" style={{ maxHeight: window.innerHeight - 325 }} ref={this.tableRef}>
                    <Table className="freeze-table" style={{ minWidth }}>
                        <thead>
                            {
                                this._renderHeader(selectedColumnList)
                            }
                        </thead>
                        <tbody>
                            {
                                this._renderDataSection(gridData, selectedColumnList)
                            }
                        </tbody>
                    </Table>
                </div>
                <Pager
                    pageOption={this.props.pagingOption}
                    onPaging={this.handlePaging} />
                {
                    !!messageNotification && <NotificationPopup
                        message={messageNotification}
                        isConfirmPopup={false}
                        onClose={this.handleCloseNotificationPopup}
                    />
                }
            </React.Fragment>
        );
    }
}

function mapStateToProps({ pagingOption, targetCountryList, languageList, param, columnList, claimsPrincipal }) {
    const isShowMemberLink = claimsPrincipal.hasReadClaim(claimResource.Player);

    return Object.assign({}, { pagingOption, targetCountryList, languageList, param, columnList, isShowMemberLink });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setPagingOption, toggleLoader, setShowPopupPassword, setShowPopupCommGroup, setAffId, setCommGroup, setParam, setParentAffName }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GridData);
