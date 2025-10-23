import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';

import { globalResource } from '../libs/constants';
import { htmlDecode } from '../../../../modules/htmlHelper';
import { convertCheckedPolicies } from '../libs/services';
import { getRolePolicy, getAccountPolicyList, getPolicyListByAccountIds, updateAccountPolicy, updateRolePolicy } from '../actions/index';

const defaultState = {
    data: null,
    checkedPolicies: {},
    isShowMessage: false,
    isSuccess: true,
    message: ''
}

export class EditPolicyForm extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            departmentList: null,
            ...defaultState
        }
    }
    componentDidUpdate(prevProps) {
        const { selectedId, isAccountPolicy, isGetByIdList } = this.props;
        if (selectedId && (selectedId !== prevProps.selectedId || isAccountPolicy !== prevProps.isAccountPolicy)) {
            this._handleGetPolicyList(selectedId, isAccountPolicy, isGetByIdList);
        }
    }

    _handleGetPolicyList = async (selectedId, isAccountPolicy, isGetByIdList) => {
        var result = isAccountPolicy ? (isGetByIdList ? await this.props.getPolicyListByAccountIds({ accountIds: selectedId }) : await this.props.getAccountPolicyList({ accountId: selectedId }))
            : await this.props.getRolePolicy({ departmentId: selectedId });

        this.setState({ ...result });
    }

    _handleChange = (event, funcId, isGPolicy) => {
        const { name, checked } = event.target;
        const { checkedPolicies } = this.state;
        const { individualPermission, groupPermission } = checkedPolicies[funcId];

        let newPolicy = { [name]: checked };

        if (name === 'HasRead' && !checked) {
            newPolicy = { HasRead: false, HasHost: false };

        }
        if (name === 'HasHost' && checked) {
            newPolicy = { HasHost: true, HasRead: true };
        }

        const newPermission = Object.assign({}, isGPolicy ? groupPermission : individualPermission, newPolicy);

        const newCheckedPolicies = Object.assign({}, checkedPolicies, {
            [funcId]: {
                individualPermission: isGPolicy ? individualPermission : newPermission,
                groupPermission: isGPolicy ? newPermission : groupPermission
            }
        });

        this.setState({ checkedPolicies: newCheckedPolicies });
    }

    _handleSubmit = async () => {
        const { checkedPolicies } = this.state;
        const { selectedId, isAccountPolicy, isGetByIdList } = this.props;

        const convertedPolicies = convertCheckedPolicies(checkedPolicies, selectedId, isAccountPolicy, isGetByIdList);

        const message = isAccountPolicy ? "Update account policy successfully!" : `Update role policy successfully!`;
        const param = Object.assign({}, { GroupPolicies: convertedPolicies });
        const result = isAccountPolicy ? await this.props.updateAccountPolicy(param) : await this.props.updateRolePolicy(param);

        if (result) {
            this._handleShowAlert(result.IsSuccessful, result.IsSuccessful ? message : result.Message);
        } else {
            this._handleShowAlert(false, isAccountPolicy ? "Update account policy is failed!" : "Update role policy is failed!");
        }
    }

    _handleShowAlert = (isSuccess, message) => {
        this.setState({
            message,
            isSuccess,
            isShowMessage: true,
        }, () => window.setTimeout(() => this._hideMessage(isSuccess), 3000));
    }

    _hideMessage = (isSuccess) => {
        this.setState({
            isShowMessage: false
        });

        if (isSuccess) {
            this._handleClosePopup();
        }
    }

    _handleClosePopup = () => {
        this.props.closePopup();

        this.setState({ ...defaultState });
    }

    _renderHeader() {
        const { isAccountPolicy } = this.props;

        return (
            <thead key="thead">
                <tr>
                    <th rowSpan="2" colSpan="2">Function</th>
                    {
                        isAccountPolicy && <th colSpan="2">Individual Permission</th>
                    }
                    <th colSpan="2">Group Permission</th>
                </tr>
                <tr>
                    {
                        isAccountPolicy && (
                            <React.Fragment>
                                <th>Read</th>
                                <th>Host</th>
                            </ React.Fragment>)
                    }
                    <th>Read</th>
                    <th>Host</th>
                </tr>
            </thead>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];
        const { isAccountPolicy } = this.props;

        if (dataList.length) {
            const { checkedPolicies } = this.state;

            for (let dataItem of dataList) {
                dataRows.push(this._buildDataRow(dataItem, checkedPolicies, isAccountPolicy));
            }
        }
        else {
            dataRows.push(<tr key="no-info">
                <td className="text-center" colSpan={isAccountPolicy ? "5" : "3"}>{globalResource.NoInfo}</td>
            </tr>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, checkedPolicies, isAccountPolicy) {
        const funcDescription = htmlDecode(dataItem.FuncDesc);
        const { individualPermission, groupPermission } = checkedPolicies[dataItem.FuncId];

        return (
            <tr key={`dataRow-${funcDescription}`}>
                <td className="text-center" title={funcDescription} colSpan="2">{funcDescription}</td>
                {
                    isAccountPolicy && (
                        <React.Fragment>
                            <td className="text-center">
                                <input type="checkbox" name="HasRead" onChange={(e) => this._handleChange(e, dataItem.FuncId, false)} checked={individualPermission.HasRead} />
                            </td>
                            <td className="text-center">
                                <input type="checkbox" name="HasHost" onChange={(e) => this._handleChange(e, dataItem.FuncId, false)} checked={individualPermission.HasHost} />
                            </td>
                        </ React.Fragment>)
                }
                <td className="text-center">
                    <input type="checkbox" name="HasRead" disabled={isAccountPolicy} onChange={(e) => this._handleChange(e, dataItem.FuncId, true)} checked={groupPermission.HasRead} />
                </td>
                <td className="text-center">
                    <input type="checkbox" name="HasHost" disabled={isAccountPolicy} onChange={(e) => this._handleChange(e, dataItem.FuncId, true)} checked={groupPermission.HasHost} />
                </td>
            </tr>
        )
    }

    render() {
        const { data, isShowMessage, isSuccess, message } = this.state;
        const { isAccountPolicy, name, isShowPopup, isGetByIdList, groupName } = this.props;
        const title = isAccountPolicy ? (isGetByIdList ? name : `${groupName} - ${name}`) : `Edit Policy: ${name}`;

        return data && (
            <Modal isOpen={isShowPopup} toggle={this._handleClosePopup} backdrop='static'>
                <ModalHeader toggle={this._handleClosePopup}>
                    <div className="text-truncate" style={{ width: 450 }}>
                        <span className="iconpopup"></span>{title}
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="policy-form-container">
                            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <div className="policy-list-content table-responsive mb-2">
                                <Table className="policy-data-table">
                                    {this._renderHeader()}
                                    <tbody>
                                        {this._renderDataSection(data)}
                                    </tbody>
                                </Table>
                            </div>

                            <Button type="button" color="success" className="mr-3" onClick={this._handleSubmit} >{globalResource.Update}</Button>
                            <Button type="button" color="info" onClick={this._handleClosePopup}>{globalResource.Cancel}</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getRolePolicy, getAccountPolicyList, getPolicyListByAccountIds, updateAccountPolicy, updateRolePolicy }, dispatch);
}

export default connect(null, mapDispatchToProps)(EditPolicyForm);