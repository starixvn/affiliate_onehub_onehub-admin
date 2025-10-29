import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAffName } from '../actions';
import { getAffiliateInfo } from '../../mainpage/actions/loadingDataAction';
import { globalResource } from '../../../../modules/globalResource';
import { clearUserPanelMenuCookie } from '../../../../modules/utils';

import { Button, Form, Input, FormGroup } from 'reactstrap';

export class SearchBox extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            affName: this.props.affName
        };
    }

    componentDidMount() {
        const { affName } = this.state;
        affName && this.props.getAffiliateInfo(affName);
    }

    componentDidUpdate(prevProps) {
        const { affName } = this.props;

        if (affName !== prevProps.affName) {
            this.setState({ affName });
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value.trim() });
    }

    handleClick = (event) => {
        clearUserPanelMenuCookie();
        event.preventDefault();
        const { affName } = this.state;

        this.props.setAffName(affName);
        this.props.getAffiliateInfo(affName);
    }

    handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();

            this.handleClick(event);
        }
    }

    render() {
        const { affName } = this.state;

        return (
            <Form tag="div">
                <FormGroup row style={{ justifyContent: "space-evenly" }}>
                    <div>
                        <Input type="text" name="affName" onChange={this.handleChange} onKeyPress={this.handlePressEnter} value={affName} />
                    </div>
                    <Button id="search-affName" onClick={this.handleClick}>{globalResource.Search}</Button>
                </FormGroup>
                {
                    !this.props.isValidUserName && (
                        <p className="m-0">Invalid username</p>
                    )
                }
            </Form>
        )
    }
}

function mapStateToProps({ leftPanel }) {
    const { affName, isValidUserName } = leftPanel;
    return Object.assign({}, { affName, isValidUserName });
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAffiliateInfo, setAffName }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);