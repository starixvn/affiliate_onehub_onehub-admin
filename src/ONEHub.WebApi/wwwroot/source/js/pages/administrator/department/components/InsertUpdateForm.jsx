import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { setSelectedDepartmentId, getDepartmentDetail, fetchData, insertDepartment, updateDepartment, setOpenInsertUpdatePopup, toggleLoader } from '../actions/index';
import { defaultState, headerText, globalResource, charCodes } from '../libs/constants';
import { htmlDecode } from '../../../../modules/htmlHelper';

export class InsertUpdateForm extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            ...defaultState
        }
    }

    componentDidMount() {
        this.props.fetchData();
    }

    componentDidUpdate(prevProps) {
        const { selectedDepartmentId } = this.props;
        if (prevProps.selectedDepartmentId !== selectedDepartmentId) {
            this.setState({ isInsert: selectedDepartmentId === 0 });

            selectedDepartmentId && this._handleGetDepartmentDetail(selectedDepartmentId);
        }
    }

    _handleGetDepartmentDetail = async (selectedDepartmentId) => {
        const item = await this.props.getDepartmentDetail(selectedDepartmentId);

        item && this.setState({
            departmentName: htmlDecode(item.DepartmentName),
            description: htmlDecode(item.Description)
        });
    }

    _handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        if (value.includes("'") || value.includes('"')) {
            this._handleShowAlert(false, `Department name can not contain (') and (") characters!`);
        } else {
            this.setState({ [name]: value });
        }
    }

    _handleSubmit = async () => {
        this.props.toggleLoader(true);

        const { departmentName, description, isInsert } = this.state;

        if (!!departmentName) {
            const { selectedDepartmentId } = this.props;
            const message = isInsert ? "The Department has been added successfully!" : "The Department has been updated successfully!";
            const departmentInfo = Object.assign({}, { departmentId: selectedDepartmentId, departmentName, description });
            const result = isInsert ? await this.props.insertDepartment(departmentInfo) : await this.props.updateDepartment(departmentInfo);

            if (result) {
                this._handleShowAlert(result.IsSuccessful, result.IsSuccessful ? message : result.Message);
            } else {
                this._handleShowAlert(false, isInsert ? "Adding the department was failed!" : "Updating the department was failed!");
            }
        } else {
            this._handleShowAlert(false, 'Please input department name!');
        }

        this.props.toggleLoader(false);
    }

    _handleKeyPress = (event) => {
        const charCode = event.charCode;
        if (charCode === charCodes.KeyEnter) {
            event.preventDefault();
            this._handleSubmit();
        }

        if (charCode === charCodes.KeyDoubleQuotationMark || charCode === charCodes.KeySingleQuotationMark) {
            event.preventDefault();
            this._handleShowAlert(false, 'Department name can not contain this character!');
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
        this.props.setSelectedDepartmentId(0);
        this.props.setOpenInsertUpdatePopup(false);

        this.setState({ ...defaultState });
    }

    render() {
        const { departmentName, description, isShowMessage, isSuccess, message, isInsert } = this.state;
        const title = isInsert ? "Add Department" : "Edit Department";

        return (
            <Modal isOpen={this.props.isOpenInsertUpdatePopup} toggle={this._handleClosePopup} backdrop='static'>
                <ModalHeader toggle={this._handleClosePopup}><span className="iconpopup"></span>{title}</ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="department-form-container">
                            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <Form tag="form" className="mb-5" autoComplete="off">
                                <FormGroup row className="mb-2">
                                    <Label htmlFor="departmentName" sm={4} className="required">Department Name</Label>
                                    <Col sm={8}>
                                        <Input type="text" name="departmentName" className="mt-2" value={departmentName} onChange={this._handleChange}
                                            onKeyPress={this._handleKeyPress} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor="description" sm={4}>{headerText.Description}</Label>
                                    <Col sm={8}>
                                        <Input type="text" name="description" className="mt-2" value={description} onChange={this._handleChange}
                                            onKeyPress={this._handleKeyPress} />
                                    </Col>
                                </FormGroup>
                            </Form>

                            <Button type="button" color="success" className="mr-3" onClick={this._handleSubmit} >Submit</Button>
                            <Button type="button" color="info" onClick={this._handleClosePopup}>{globalResource.Cancel}</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

function mapStateToProps({ selectedDepartmentId, isOpenInsertUpdatePopup }) {
    return Object.assign({}, { selectedDepartmentId, isOpenInsertUpdatePopup });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedDepartmentId, getDepartmentDetail, fetchData, insertDepartment, updateDepartment, setOpenInsertUpdatePopup, toggleLoader }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InsertUpdateForm);