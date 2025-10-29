import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

import { renderInputForm, capitalizeFirstChar } from '../../modules/service';
import { setUserAccountInfo } from '../../actions';
import { updateObjectInArray } from '../../../../../modules/dataHandler';
import { getPlaceHolderByApp } from '../../modules/utils';


export class Personal extends PureComponent {
    constructor(props) {
        super(props);

        const { userAccountInfo } = this.props;

        this.arrayContactApps = userAccountInfo && userAccountInfo.ContactAppList;
    }

    handleChange = (event) => {
        const target = event.target;
        const name = capitalizeFirstChar(target.name);

        const newUserAccountInfo = Object.assign({}, this.props.userAccountInfo, { [name]: target.value })
        this.props.setUserAccountInfo(newUserAccountInfo);
    }

    handleChangeGender = (isMale) => {
        const newUserAccountInfo = Object.assign({}, this.props.userAccountInfo, { Gender: isMale });

        this.props.setUserAccountInfo(newUserAccountInfo);
    }

    handleChangeContactApps = (event) => {
        const { name, value } = event.target
        const indexItem = this.arrayContactApps.findIndex(item => item.Name === name);
        const updateItem = Object.assign({}, this.arrayContactApps[indexItem], { Value: value });
        this.arrayContactApps = updateObjectInArray(this.arrayContactApps, indexItem, updateItem)

        const newUserAccountInfo = Object.assign({}, this.props.userAccountInfo, { ContactAppList: this.arrayContactApps })
        this.props.setUserAccountInfo(newUserAccountInfo);
    }

    _renderGenderForm(isMale, isRequired) {
        return (
            <FormGroup row>
                <Label sm={3} xl={2} className={isRequired ? 'required' : ''}>Gender</Label>
                <Col sm={9} xl={10} className="gender-group">
                    <FormGroup check className="d-inline-block mr-3">
                        <Label check>
                            <Input type="radio" checked={isMale != null && isMale} onChange={() => this.handleChangeGender(true)} />{' '} Male
                        </Label>
                    </FormGroup>
                    <FormGroup check className="d-inline-block">
                        <Label check>
                            <Input type="radio" checked={isMale != null && !isMale} onChange={() => this.handleChangeGender(false)} />{' '} Female
                        </Label>
                    </FormGroup>
                </Col>
            </FormGroup>
        )
    }

    render() {
        const { userAccountInfo } = this.props;
        const isOnlyView = !userAccountInfo.HasHostAffPersonalInfoPermission;
        const isRequired = !userAccountInfo.IsMarketingAccount;

        return userAccountInfo && (
            <Form tag="div">
                {renderInputForm('username', 'User Name', userAccountInfo.AffName, true, false, this.handleChange)}
                {renderInputForm('affCategoryDesc', 'Account Type', userAccountInfo.AffCategoryDesc, true, false, this.handleChange)}
                {renderInputForm('firstName', 'First Name', userAccountInfo.FirstName, false, isRequired, this.handleChange)}
                {renderInputForm('lastName', 'Last Name', userAccountInfo.LastName, false, isRequired, this.handleChange)}
                {this._renderGenderForm(userAccountInfo.Gender, isRequired)}
                {renderInputForm('email', 'Email Address', userAccountInfo.Email, isOnlyView, true, this.handleChange)}
                {renderInputForm('phone', 'Contact Number', userAccountInfo.Phone, isOnlyView, isRequired, this.handleChange)}
                {
                    this.arrayContactApps && this.arrayContactApps.map((contactApp, index) => {
                        const appNameDisplay = contactApp.Name == "Skype" ? "Teams" : contactApp.Name;
                        const placeholder = getPlaceHolderByApp(contactApp.Name);

                        return (
                            renderInputForm(contactApp.Name, appNameDisplay, contactApp.Value, false, isRequired && index == 0, this.handleChangeContactApps, placeholder)
                        )
                    })
                }
            </Form>
        )
    }
}

function mapStateToProps({ edit }) {
    const { userAccountInfo } = edit;
    return Object.assign({}, { userAccountInfo });
}

function mapDispatchToProp(dispatch) {
    return bindActionCreators({ setUserAccountInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProp)(Personal);