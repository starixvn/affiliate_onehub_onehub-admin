import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Filter from './Filter';
import Content from './Content';
import EditPolicyForm from './EditPolicyForm';
import SelectAll from '../../../common/components/SelectAll';

import { Button, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { fetchData } from '../actions/index';
import { htmlDecode } from '../../../../modules/htmlHelper';

const defaultState = {
    data: null,
    checkedUsers: {},
    param: null,
    userNames: '',
    selectedUserIds: '',
    isShowPolicyPopup: false,
    shouldResetScrollPosition: true,
    isShowMessage: false,
    isSuccess: true,
    message: ''
}

export class DepartmentPopup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            ...defaultState
        }
    }

    componentDidUpdate(prevProps) {
        const { groupId } = this.props;
        if (groupId && groupId !== prevProps.groupId) {
            this.getData({ groupId, userName: '', firstLetter: '' });
        }
    }

    handleSetParam = (param) => {
        const { groupId } = this.props;
        this.setState({ param: { ...param, groupId } });
    }

    handleFetchData = (param) => {
        const { groupId } = this.props;
        this.getData({ ...param, groupId });
    }

    getData = async (param) => {
        const result = await this.props.fetchData(param);

        this.setState({ ...result });
    }

    handleClosePopup = () => {
        this.props.closePopup();
    }

    handleUpdate = () => {
        const { data, checkedUsers } = this.state;

        const userIdList = this._getCheckedItemIdList(checkedUsers);

        if (userIdList.length) {
            const stringUserIdList = userIdList.toString();
            const userInfoList = data.filter(userInfo => stringUserIdList.includes(userInfo.UserId));
            const stringUserNames = userInfoList.reduce((accumulator, item) => {
                return accumulator = accumulator + item.UserName + ', ';
            }, '').slice(0, -2);

            this.setState({ selectedUserIds: stringUserIdList, userNames: htmlDecode(stringUserNames), isShowPolicyPopup: true });
        } else {
            this._handleShowAlert('Please choose at least one account.');
        }

    }

    _handleShowAlert = (message) => {
        this.setState({
            message,
            isSuccess: false,
            isShowMessage: true,
        }, () => window.setTimeout(() => this._hideMessage(), 3000));
    }

    _hideMessage = () => {
        this.setState({
            isShowMessage: false
        });
    }

    _getCheckedItemIdList = (checkedUsers) => {
        return Object.keys(checkedUsers).filter(key => checkedUsers[key]);
    }

    setShouldResetScrollPosition = (shouldResetScrollPosition) => {
        this.setState({ shouldResetScrollPosition });
    }

    handleUpdateCheckedUsers = (newCheckedUsers) => {
        this.setState({ checkedUsers: newCheckedUsers })
    }

    handleClosePolicyPopup = () => {
        this.setState({ isShowPolicyPopup: false, selectedUserIds: '', userNames: '' })
    }

    render() {
        const { isShowMessage, isSuccess, message, param, data, checkedUsers, shouldResetScrollPosition, selectedUserIds, userNames, isShowPolicyPopup } = this.state;
        const { isAdmin, name, isShowPopup } = this.props;
        const title = isAdmin ? `Department - ${name}` : `${name}`;

        return (
            <Modal isOpen={isShowPopup} toggle={this.handleClosePopup} size="xl" backdrop='static'>
                <ModalHeader toggle={this.handleClosePopup}><span className="iconpopup"></span>{title}</ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="department-popup-container">
                            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <Filter
                                setParam={this.handleSetParam}
                                fetchData={this.handleFetchData}
                                isPopup={true}
                            />
                            {
                                data && data.length && (
                                    <React.Fragment>
                                        <div className="my-2">
                                            <Button outline type="button" onClick={this.handleUpdate}>Update</Button>
                                        </div>
                                        <SelectAll
                                            checkedList={checkedUsers}
                                            setCheckedList={this.handleUpdateCheckedUsers}
                                            setShouldResetScrollPosition={this.setShouldResetScrollPosition}
                                        />
                                    </React.Fragment>
                                )
                            }
                            <Content
                                param={param}
                                gridData={data}
                                shouldResetScrollPosition={shouldResetScrollPosition}
                                setShouldResetScrollPosition={this.setShouldResetScrollPosition}
                                fetchData={this.getData}
                                isPopup={true}
                                checkedUsers={checkedUsers}
                                setCheckedUsers={this.handleUpdateCheckedUsers}
                            />
                            <EditPolicyForm
                                selectedId={selectedUserIds}
                                name={userNames}
                                isAccountPolicy={true}
                                isShowPopup={isShowPolicyPopup}
                                isGetByIdList={true}
                                closePopup={this.handleClosePolicyPopup}
                            />
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchData }, dispatch);
}

export default connect(null, mapDispatchToProps)(DepartmentPopup);