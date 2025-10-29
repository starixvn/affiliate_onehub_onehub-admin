import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

import { setUserAccountInfo } from '../../actions';

export class EmailFormat extends PureComponent {
    constructor(props) {
        super(props);
    }

    handleChange = (isTextFormat) => {
        const newUserAccountInfo = Object.assign({}, this.props.userAccountInfo, { MailOption: isTextFormat });

        this.props.setUserAccountInfo(newUserAccountInfo);
    }

    render() {
        const { userAccountInfo } = this.props;
        const isTextFormat = !!userAccountInfo && userAccountInfo.MailOption;

        return userAccountInfo && (
            <Form tag="div">
                <FormGroup row>
                    <Col sm={5}>
                        <FormGroup check className="d-inline-block mr-3">
                            <Label check>
                                <Input type="radio" checked={isTextFormat} onChange={() => this.handleChange(true)} />{' '} Plain Text Format
                            </Label>
                        </FormGroup>
                        <FormGroup check className="d-inline-block">
                            <Label check>
                                <Input type="radio" checked={!isTextFormat} onChange={() => this.handleChange(false)} />{' '} Html Format
                            </Label>
                        </FormGroup>
                    </Col>
                </FormGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(EmailFormat);