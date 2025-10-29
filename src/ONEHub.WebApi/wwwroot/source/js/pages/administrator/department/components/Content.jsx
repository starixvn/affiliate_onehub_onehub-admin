import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';
import EditPolicyForm from '../../common/components/EditPolicyForm';
import NotificationPopup from '../../../common/components/NotificationPopup';
import DepartmentPopup from '../../common/components/DepartmentPopup';

import { htmlDecode } from '../../../../modules/htmlHelper';
import { headerText, globalResource } from '../libs/constants';
import { deleteDepartment, fetchData, toggleLoader, setSelectedDepartmentId, setOpenInsertUpdatePopup, setShouldResetScrollPosition } from '../actions';

export class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedDepartmentId: 0,
            isShowPolicyPopup: false,
            isShowDepartmentPopup: false,
            departmentName: '',
            message: '',
            isConfirmPopup: true
        }
    }

    componentDidMount() {
        this.props.fetchData();
    }

    _handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ message: '' });

        const { selectedDepartmentId } = this.state;
        if (confirmResult && selectedDepartmentId) {
            this._deleteDepartment(selectedDepartmentId);
        }
    }

    _handleDeleteDepartment = (selectedDepartmentId) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ message: `Are you sure you want to delete this department?`, isConfirmPopup: true, selectedDepartmentId });
    }

    _handleEditDepartment = (departmentId) => {
        this.props.setShouldResetScrollPosition(false);
        this.props.setSelectedDepartmentId(departmentId);
        this.props.setOpenInsertUpdatePopup(true);
    }

    _handleEditPolicy = (departmentId, departmentName) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ isShowPolicyPopup: true, selectedDepartmentId: departmentId, departmentName });
    }

    _handleShowDepartmentPopup = (departmentId, departmentName) => {
        this.props.setShouldResetScrollPosition(false);
        this.setState({ isShowDepartmentPopup: true, selectedDepartmentId: departmentId, departmentName });
    }

    _deleteDepartment = async (selectedDepartmentId) => {
        this.props.toggleLoader(true);

        const result = await this.props.deleteDepartment({ departmentId: selectedDepartmentId });

        if (result) {
            if (result.IsSuccessful) {
                this.setState({ message: `The department has been removed successfully!`, isConfirmPopup: false });

                this.props.fetchData();
            }
            else {
                this.setState({ message: result.Message, isConfirmPopup: false });
            }
        }

        this.props.toggleLoader(false);
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={20} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={150} title={headerText.Department}>{headerText.Department}</Cell>
                <Cell header={true} colWidth={30} title={headerText.NoOfUser}>{headerText.NoOfUser}</Cell>
                <Cell header={true} colWidth={150} title={headerText.Description}>{headerText.Description}</Cell>
                <Cell header={true} colWidth={60} title={headerText.RolePolicy}>{headerText.RolePolicy}</Cell>
                <Cell header={true} colWidth={20} title={headerText.Edit}>{headerText.Edit}</Cell>
                <Cell header={true} colWidth={20} title={headerText.Delete}>{headerText.Delete}</Cell>
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
                <Cell className="text-center" colSpan="7">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, index) {
        const departmentName = htmlDecode(dataItem.DepartmentName);
        const description = htmlDecode(dataItem.Description);

        return (
            <Row key={`dataRow-${index}`}>
                <Cell className="text-center" title={index}>{index}</Cell>
                <Cell className="text-center" title={departmentName}>{departmentName}</Cell>
                <Cell className="text-center">
                    {
                        dataItem.NoOfUser ? (
                            <Button color="link p-0" onClick={() => this._handleShowDepartmentPopup(dataItem.DepartmentId, departmentName)}>
                                {
                                    dataItem.NoOfUser
                                }
                            </Button>
                        ) : dataItem.NoOfUser
                    }
                </Cell>
                <Cell className="text-center" title={description}>{description}</Cell>
                {
                    departmentName.toLowerCase() === 'none' ? (
                        <React.Fragment>
                            <Cell></Cell>
                            <Cell></Cell>
                            <Cell></Cell>
                        </React.Fragment>
                    ) : (
                            <React.Fragment>
                                <Cell className="text-center" title="Edit Role Policy">
                                    <Button color="link p-0" onClick={() => this._handleEditPolicy(dataItem.DepartmentId, departmentName)}>
                                        Role Policy
                                </Button>
                                </Cell>
                                <Cell className="text-center" title="Edit Department">
                                    <Button color="link p-0" onClick={() => this._handleEditDepartment(dataItem.DepartmentId)}>
                                        <span className="oi oi-pencil text-secondary"></span>
                                    </Button>
                                </Cell>
                                <Cell className="text-center" title="Delete Department">
                                    <Button color="link p-0" onClick={() => this._handleDeleteDepartment(dataItem.DepartmentId)}>
                                        <span className="oi oi-x text-danger"></span>
                                    </Button>
                                </Cell>
                            </ React.Fragment>
                        )
                }
            </Row>
        )
    }

    _renderPopups = () => {
        const { message, isConfirmPopup, selectedDepartmentId, isShowPolicyPopup, isShowDepartmentPopup, departmentName } = this.state;

        return (
            <React.Fragment>
                <NotificationPopup
                    message={message}
                    isConfirmPopup={isConfirmPopup}
                    onClose={this._handleCloseNotificationPopup}
                />
                <EditPolicyForm
                    selectedId={selectedDepartmentId}
                    name={departmentName}
                    isAccountPolicy={false}
                    isShowPopup={isShowPolicyPopup}
                    closePopup={() => this.setState({ isShowPolicyPopup: false, selectedDepartmentId: 0, departmentName: '' })}
                />
                <DepartmentPopup
                    isAdmin={false}
                    groupId={selectedDepartmentId}
                    name={departmentName}
                    isShowPopup={isShowDepartmentPopup}
                    closePopup={() => this.setState({ isShowDepartmentPopup: false, selectedDepartmentId: 0, departmentName: '' })}
                />
            </React.Fragment>
        )
    }

    render() {
        const { gridData, shouldResetScrollPosition } = this.props;

        return gridData && (
            <div className="data-content">
                <div className="my-2">
                    <Button outline type="button" onClick={() => this._handleEditDepartment(0)}>Add Dept<span className="oi oi-plus ml-2"></span></Button>
                </div>
                <div className="department-list-content table-responsive table-striped my-2">
                    <Table
                        minWidth={1000}
                        autoWidth={true}
                        bodyHeight={300}
                        header={this._renderHeader()}
                        body={this._renderDataSection(gridData)}
                        containerPadding={20}
                        shouldResetScrollPosition={shouldResetScrollPosition}
                    />
                </div>
                {
                    this._renderPopups()
                }
            </div>
        );
    }
}

function mapStateToProps({ shouldResetScrollPosition, gridData }) {
    return Object.assign({}, { shouldResetScrollPosition, gridData });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deleteDepartment, fetchData, toggleLoader, setSelectedDepartmentId, setOpenInsertUpdatePopup, setShouldResetScrollPosition }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);