import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { setParam } from '../actions';
import { headerText } from '../libs/constants';

export const Filter = (props) => {
    const { pagingOption } = props;

    const [affUsername, setAffUsername] = useState('');
    const [affDomain, setAffDomain] = useState('');
    const [redirectDomain, setRedirectDomain] = useState('');

    const _handleSearch = () => {
        const newParam = Object.assign({}, {
            AffUsername: affUsername,
            AffDomain: affDomain,
            RedirectDomain: redirectDomain,
            PageIndex: 1,
            PageSize: pagingOption.PageSize,
        });

        props.setParam(newParam);
    }

    const _handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault()
            _handleSearch();
        }
    }

    return (
        <div className="filter-container my-2">
            <Form inline tag="div">
                <FormGroup className="mr-sm-3">
                    <Label className="mr-2">{headerText.Affiliate}</Label>
                    <Input type="text" name="affUsername" value={affUsername} onKeyPress={_handlePressEnter} onChange={(e) => setAffUsername(e.target.value)} />
                </FormGroup>
                <FormGroup className="mr-sm-3">
                    <Label className="mr-2">{headerText.AffDomain}</Label>
                    <Input type="text" name="affDomain" value={affDomain} onKeyPress={_handlePressEnter} onChange={(e) => setAffDomain(e.target.value)} />
                </FormGroup>
                <FormGroup className="mr-sm-3">
                    <Label className="mr-2">{headerText.RedirectDomain}</Label>
                    <Input type="text" name="redirectDomain" value={redirectDomain} onKeyPress={_handlePressEnter} onChange={(e) => setRedirectDomain(e.target.value)} />
                </FormGroup>
                <Button outline color="primary" type="button" onClick={_handleSearch}>
                    <span className="oi oi-magnifying-glass"></span> {headerText.Search}
                </Button>
            </Form>
        </div>
    )
}

function mapStateToProps({ pagingOption}) {
    return { pagingOption };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));