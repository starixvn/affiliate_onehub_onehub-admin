import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

import { renderInputForm, capitalizeFirstChar } from '../../modules/service';
import { countriesList } from '../../modules/constants';
import { setUserAccountInfo } from '../../actions';

export class Additional extends PureComponent {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const target = event.target;
        const name = capitalizeFirstChar(target.name);

        const newUserAccountInfo = Object.assign({}, this.props.userAccountInfo, { [name]: target.value })
        this.props.setUserAccountInfo(newUserAccountInfo);
    }

    _renderCountry(country, isRequired) {
        return (
            <FormGroup row>
                <Label htmlFor="country" sm={3} xl={2} className={isRequired ? 'required' : ''}>Country</Label>
                <Col sm={9} xl={10}>
                    <Input type="select" id="country" name="country" value={country} onChange={this.handleChange}>
                        <option value="">Select One</option>
                        {
                            Object.keys(countriesList).map((key) => {
                                return (<option key={'country-' + key} value={key}>{countriesList[key]}</option>)
                            })
                        }
                    </Input>
                </Col>
            </FormGroup>
        )
    }

    render() {
        const { userAccountInfo } = this.props;
        const isShowSecurityQuestion = !!userAccountInfo.Question;
        const isRequired = !userAccountInfo.IsMarketingAccount;
        
        return userAccountInfo && (
            <Form tag="div">
                {renderInputForm('address', 'Address', userAccountInfo.Address, false, isRequired, this.handleChange)}
                {renderInputForm('city', 'City', userAccountInfo.City, false, isRequired, this.handleChange)}
                {renderInputForm('state', 'State', userAccountInfo.State, false, false, this.handleChange)}
                {renderInputForm('postcode', 'Postcode/Zip', userAccountInfo.Postcode, false, isRequired, this.handleChange)}
                {this._renderCountry(userAccountInfo.Country, isRequired)}
                {isShowSecurityQuestion && renderInputForm('question', 'Security Question', userAccountInfo.Question, true)}
                {isShowSecurityQuestion && renderInputForm('answer', 'Answer', userAccountInfo.Answer, true)}
            </Form>
        )
    }
}

function mapStateToProps({ edit }) {
    const { userAccountInfo } = edit;
    return Object.assign({}, { userAccountInfo });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setUserAccountInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Additional);