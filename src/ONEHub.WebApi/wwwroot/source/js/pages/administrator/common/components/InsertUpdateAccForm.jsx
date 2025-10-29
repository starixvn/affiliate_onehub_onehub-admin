import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { headerText, globalResource, MaxLength } from '../libs/constants';
import { htmlDecode } from '../../../../modules/htmlHelper';
import { getDepartmentList } from '../../department/actions/index';
import { validateUserName } from '../libs/services';
import { getUserDetail, insertUser, insertExistedUser, updateUser } from '../actions/index';

const defaultState = {
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    department: 0,
    isInsert: true,
    isShowMessage: false,
    isSuccess: true,
    message: ''
}

export class InsertUpdateAccForm extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            departmentList: null,
            ...defaultState
        }
    }

    componentDidMount() {
        this._handleGetDepartmentList();
    }

    componentDidUpdate(prevProps) {
        const { selectedUserId } = this.props;
        if (prevProps.selectedUserId !== selectedUserId) {
            this.setState({ isInsert: selectedUserId === 0 });

            selectedUserId && this._handleGetUserDetail(selectedUserId);
        }
    }

    _handleGetDepartmentList = async () => {
        const departmentList = await this.props.getDepartmentList();

        this.setState({ departmentList });
    }

    _handleGetUserDetail = async (selectedUserId) => {
        const item = await this.props.getUserDetail(selectedUserId);

        item && this.setState({
            userName: htmlDecode(item.UserName),
            firstName: htmlDecode(item.FirstName),
            lastName: htmlDecode(item.LastName),
            department: item.GroupId
        });
    }

    _handleChange = (event) => {
        let value = event.target.value;
        const name = event.target.name;

        if (value.length > MaxLength) {
            value = value.slice(0, MaxLength);
        }

        this.setState({ [name]: value });
    }

    _handleSubmit = async () => {
        const { selectedUserId, isInsertExistedAcc } = this.props;
        const { userName, password, firstName, lastName, department, isInsert } = this.state;

        if (!userName) {
            this._handleShowAlert(false, 'Please input user name!');
            return;
        }

        if (isInsert && !isInsertExistedAcc && !password) {
            this._handleShowAlert(false, 'Password is required!');
            return;
        }

        if (!department) {
            this._handleShowAlert(false, 'Please choose department!');
            return;
        }

        const isValidUserName = validateUserName(userName);

        if (isValidUserName) {
            const message = isInsert ? "Administrator has been added successfully!" : `The ${userName} has been updated successfully!`;
            const userInfo = Object.assign({}, { AccountId: selectedUserId, userName, password, firstName, lastName, groupId: department });
            const result = isInsert ? (isInsertExistedAcc ? await this.props.insertExistedUser(userInfo) : await this.props.insertUser(userInfo)) : await this.props.updateUser(userInfo);

            if (result) {
                this._handleShowAlert(result.IsSuccessful, result.IsSuccessful ? message : result.Message);
            } else {
                this._handleShowAlert(false, isInsert ? "Adding the administrator was failed!" : `Updating the ${userName} was failed!`);
            }
        } else {
            this._handleShowAlert(false, 'User Name can not be contained the special characters. Please try again!');
        }
    }

    _handleKeyPress = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();
            this._handleSubmit();
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
            this.props.fetchData();
            this._handleClosePopup();
        }
    }

    _handleClosePopup = () => {
        this.props.closePopup();

        window.setTimeout(() => { this.setState({ ...defaultState }) }, 300);
    }

    render() {
        const { departmentList, userName, password, firstName, lastName, department, isInsert, isShowMessage, isSuccess, message } = this.state;
        const { isInsertExistedAcc } = this.props;
        const title = isInsert ? (isInsertExistedAcc ? "Add Existed Account" : "Add New Account") : userName;
        const labelButton = isInsert ? "Add" : "Submit";

        return departmentList && (
            <Modal isOpen={this.props.isShowPopup} toggle={this._handleClosePopup} backdrop='static'>
                <ModalHeader toggle={this._handleClosePopup}><span className="iconpopup"></span>{title}</ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="account-form-container">
                            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <Form tag="form" className="mb-5" autoComplete="off">
                                {
                                    isInsert && (<React.Fragment>
                                        <FormGroup row className="mb-2">
                                            <Label htmlFor="userName" sm={4} className="required">{headerText.UserName}</Label>
                                            {
                                                isInsertExistedAcc ? (
                                                    <Col sm={8}>
                                                        <Input type="text" name="userName" className="mt-2" autoComplete="off" maxLength="20" value={userName} onChange={this._handleChange}
                                                            onKeyPress={this._handleKeyPress} />
                                                    </Col>
                                                ) : (
                                                        <Col sm={8} className="row-user">
                                                            <Input type="text" className="refix" disabled value="AA" />
                                                            <Input type="text" name="userName" className="userName" autoComplete="off" maxLength="20" value={userName} onChange={this._handleChange}
                                                                onKeyPress={this._handleKeyPress} />
                                                        </Col>
                                                    )
                                            }
                                        </FormGroup>
                                        {
                                            !isInsertExistedAcc && (
                                                <FormGroup row className="mb-2">
                                                    <Label htmlFor="password" sm={4} className="required">{headerText.Password}</Label>
                                                    <Col sm={8}>
                                                        <Input type="password" name="password" className="mt-2" maxLength="20" autoComplete="off" className="mt-2" value={password}
                                                            onChange={this._handleChange} onKeyPress={this._handleKeyPress} />
                                                    </Col>
                                                </FormGroup>
                                            )
                                        }
                                    </React.Fragment>)
                                }
                                {
                                    !isInsertExistedAcc && (<React.Fragment>
                                        <FormGroup row className="mb-2">
                                            <Label htmlFor="firstName" sm={4}>{headerText.FirstName}</Label>
                                            <Col sm={8}>
                                                <Input type="text" name="firstName" maxLength="20" className="mt-2" value={firstName} onChange={this._handleChange}
                                                    onKeyPress={this._handleKeyPress} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row className="mb-2">
                                            <Label htmlFor="lastName" sm={4}>{headerText.LastName}</Label>
                                            <Col sm={8}>
                                                <Input type="text" name="lastName" maxLength="20" className="mt-2" value={lastName} onChange={this._handleChange}
                                                    onKeyPress={this._handleKeyPress} />
                                            </Col>
                                        </FormGroup>
                                    </React.Fragment>)
                                }
                                <FormGroup row>
                                    <Label htmlFor="department" sm={4}>{headerText.Department}</Label>
                                    <Col sm={8}>
                                        <Input type="select" name="department" className="mt-2" value={department} onChange={this._handleChange}>
                                            {
                                                isInsert && <option key={'department-0'} value="0">[Select Dept]</option>
                                            }
                                            {
                                                departmentList.map(item => {
                                                    return (<option key={'department-' + item.DepartmentId} value={item.DepartmentId}>{item.DepartmentName}</option>)
                                                })
                                            }
                                        </Input>
                                    </Col>
                                </FormGroup>
                            </Form>

                            <Button type="button" color="success" className="mr-3" onClick={this._handleSubmit} >{labelButton}</Button>
                            <Button type="button" color="info" onClick={this._handleClosePopup}>{globalResource.Cancel}</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getUserDetail, insertUser, insertExistedUser, updateUser, getDepartmentList }, dispatch);
}

export default connect(null, mapDispatchToProps)(InsertUpdateAccForm);