import React, { PureComponent } from 'react';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { htmlDecode } from '../../../../modules/htmlHelper';
import { headerText, globalResource, defaultState } from '../libs/constants';
import EditPolicyForm from './EditPolicyForm';
import DepartmentPopup from './DepartmentPopup';
import InsertUpdateAccForm from './InsertUpdateAccForm';
import NotificationPopup from '../../../common/components/NotificationPopup';
import ChangePasswordForm from '../../../common/components/ChangePasswordForm';

export default class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = defaultState;
    }

    _onCheckItem = (isChecked, userId) => {
        const newCheckedUsers = Object.assign({}, this.props.checkedUsers, { [userId]: isChecked });

        this.props.setShouldResetScrollPosition(false);
        this.props.setCheckedUsers(newCheckedUsers);
    }

    _handleChangeStatus = (selectedUserId, isOpen) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ message: `Are you sure you want to change status for this customer?`, isConfirmPopup: true, selectedUserId, isOpen });
    }

    _handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ message: '' });

        const { selectedUserId, isOpen } = this.state;
        if (confirmResult && selectedUserId) {
            this._handleSaveStatus(selectedUserId, isOpen);
        }
    }

    _handleSaveStatus = async (selectedUserId, isOpen) => {
        const result = await this.props.changeStatus({ selectedUserId, isOpen });

        if (result && result.IsSuccessful) {
            this.setState({ message: `The status has been updated successfully!`, isConfirmPopup: false });

            this.handleFetchData();
        } else {
            this.setState({ message: !!result ? result.Message : 'Update the status is failed!', isConfirmPopup: false });
        }
    }

    handleFetchData = () => {
        this.props.fetchData(this.props.param);
    }

    _handleShowUserPopup = (userId, isInsertExistedAcc) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ selectedUserId: userId, isShowUserPopup: true, isInsertExistedAcc });
    }

    _handleShowPolicyPopup = (userId, userName, groupName) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ selectedUserId: userId, isShowPolicyPopup: true, userName, groupName });
    }

    _handleShowDepartmentPopup = (groupId, groupName) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ selectedGroupId: groupId, isShowDepartmentPopup: true, groupName });
    }

    _handleShowPasswordPopup = (userId) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ selectedUserId: userId, isShowPasswordPopup: true });
    }

    handleClosePopup = () => {
        this.setState({
            isShowUserPopup: false,
            isShowPolicyPopup: false,
            isShowDepartmentPopup: false,
            isShowPasswordPopup: false,
            message: ''
        }, () => window.setTimeout(() => { this.setState({ isInsertExistedAcc: false, selectedUserId: 0 }) }, 200));
    }

    _renderHeader() {
        const { isPopup } = this.props;

        return (
            <Row key="thead">
                {
                    isPopup && <Cell header={true} colWidth={20}></Cell>
                }
                <Cell header={true} colWidth={20} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={60} title={headerText.UserName}>{headerText.UserName}</Cell>
                <Cell header={true} colWidth={60} title={headerText.FirstName}>{headerText.FirstName}</Cell>
                <Cell header={true} colWidth={60} title={headerText.LastName}>{headerText.LastName}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Status}>{headerText.Status}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Creator}>{headerText.Creator}</Cell>
                <Cell header={true} colWidth={60} title={headerText.CreatedDate}>{headerText.CreatedDate}</Cell>
                <Cell header={true} colWidth={60} title={headerText.Policy}>{headerText.Policy}</Cell>
                {
                    !isPopup && <Cell header={true} colWidth={30} title={headerText.Department}>{headerText.Department}</Cell>
                }
                <Cell header={true} colWidth={30} title={headerText.Password}>{headerText.Password}</Cell>
            </Row>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            const { isPopup } = this.props;

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(this._buildDataRow(dataItem, i + 1, isPopup));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="10">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index, isPopup) {
        const userName = htmlDecode(dataItem.UserName);
        const firstName = htmlDecode(dataItem.FirstName);
        const lastName = htmlDecode(dataItem.LastName);
        const creator = htmlDecode(dataItem.Creator);

        return (
            <Row key={`dataRow-${index}`} className={dataItem.IsOpen ? "" : "is-closed"}>
                {
                    isPopup && <Cell className="text-center">
                        <input type="checkbox" checked={this.props.checkedUsers[dataItem.UserId]}
                            onChange={(e) => this._onCheckItem(e.target.checked, dataItem.UserId)} />
                    </Cell>
                }
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center" title={userName}>
                    <Button color="link p-0" onClick={() => this._handleShowUserPopup(dataItem.UserId, false)}>
                        {
                            userName
                        }
                    </Button>
                </Cell>
                <Cell className="text-center" title={firstName}>{firstName}</Cell>
                <Cell className="text-center" title={lastName}>{lastName}</Cell>
                <Cell className="text-center" title="Change Status">
                    {
                        dataItem.IsOpen ? 'Open' : 'Closed'
                    }
                    {
                        !isPopup && <input type="checkbox" className="ml-1" onChange={() => this._handleChangeStatus(dataItem.UserId, !dataItem.IsOpen)} checked={dataItem.IsOpen} />
                    }
                </Cell>
                <Cell className="text-center" title={creator}>{creator}</Cell>
                <Cell className="text-center" title={dataItem.CreatedDateText}>{dataItem.CreatedDateText}</Cell>
                <Cell className="text-center" title="Edit Account Policy">
                    <Button color="link p-0" onClick={() => this._handleShowPolicyPopup(dataItem.UserId, userName, dataItem.GroupName)}>
                        {
                            isPopup ? 'Role Policy' : 'Account Policy'
                        }
                    </Button>
                </Cell>
                {
                    !isPopup && (
                        <Cell className="text-center" title="Edit Department">
                            <Button color="link p-0" onClick={() => this._handleShowDepartmentPopup(dataItem.GroupId, dataItem.GroupName)}>
                                {dataItem.GroupName}
                            </Button>
                        </Cell>
                    )
                }
                {
                    dataItem.IsOpen ? (
                        <Cell className="text-center" title="Change Password">
                            <Button color="link p-0" onClick={() => this._handleShowPasswordPopup(dataItem.UserId)}>
                                <span className="oi oi-pencil text-secondary"></span>
                            </Button>
                        </Cell>
                    ) : (<Cell></Cell>)
                }
            </Row>
        )
    }

    _renderPopups = () => {
        const { departmentList, isInsertExistedAcc, selectedUserId, selectedGroupId, userName, groupName, isShowUserPopup, isShowPolicyPopup,
            isShowDepartmentPopup, isShowPasswordPopup, message, isConfirmPopup } = this.state;
        return (
            <React.Fragment>
                <InsertUpdateAccForm
                    isShowPopup={isShowUserPopup}
                    selectedUserId={selectedUserId}
                    closePopup={this.handleClosePopup}
                    fetchData={this.handleFetchData}
                    departmentList={departmentList}
                    isInsertExistedAcc={isInsertExistedAcc}
                />
                <EditPolicyForm
                    selectedId={selectedUserId}
                    groupName={groupName}
                    name={userName}
                    isAccountPolicy={true}
                    isShowPopup={isShowPolicyPopup}
                    closePopup={() => this.setState({ isShowPolicyPopup: false, selectedUserId: 0, userName: '' })}
                />
                <ChangePasswordForm
                    showPopupPassword={isShowPasswordPopup}
                    selectedId={selectedUserId}
                    isAdmin={true}
                    setShowPopupPassword={() => this.setState({ isShowPasswordPopup: false })}
                />
                <NotificationPopup
                    message={message}
                    isConfirmPopup={isConfirmPopup}
                    onClose={this._handleCloseNotificationPopup}
                />
                {
                    !this.props.isPopup && <DepartmentPopup
                        groupId={selectedGroupId}
                        isAdmin={true}
                        name={groupName}
                        isShowPopup={isShowDepartmentPopup}
                        closePopup={() => this.setState({ isShowDepartmentPopup: false, selectedGroupId: 0, groupName: '' })}
                    />
                }
            </React.Fragment>
        )
    }

    render() {
        const { gridData, shouldResetScrollPosition, isPopup } = this.props;

        return gridData && (
            <div className="data-content">
                {
                    !isPopup && (
                        <div className="my-2">
                            <React.Fragment>
                                <Button outline type="button" className="mr-2" onClick={() => this._handleShowUserPopup(0, false)}>Add Acc<span className="oi oi-plus ml-2"></span></Button>
                                <Button outline type="button" onClick={() => this._handleShowUserPopup(0, true)}>Add Existed Acc<span className="oi oi-plus ml-2"></span></Button>
                            </React.Fragment>
                        </div>
                    )
                }
                <div className="common-list-content table-responsive table-striped my-2">
                    {
                        isPopup ? (<Table
                            maxWidth={1108}
                            bodyHeight={300}
                            header={this._renderHeader()}
                            body={this._renderDataSection(gridData)}
                            containerPadding={20}
                            shouldResetScrollPosition={shouldResetScrollPosition}
                        />) : (<Table
                            minWidth={1000}
                            autoWidth={true}
                            bodyHeight={300}
                            header={this._renderHeader()}
                            body={this._renderDataSection(gridData)}
                            containerPadding={20}
                            shouldResetScrollPosition={shouldResetScrollPosition}
                        />)
                    }
                </div>
                {
                    this._renderPopups()
                }
            </div>
        );
    }
}