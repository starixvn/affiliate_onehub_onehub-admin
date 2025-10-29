import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { setParam, setIsFromOtherPages } from '../actions';
import { headerText } from '../libs/constants';

export const Filter = (props) => {
    const { pagingOption, isFromOtherPages } = props;

    const [affName, setAffName] = useState(props.affName);
    const [userName, setUserName] = useState('');
    const [ibcUserName, setIbcUserName] = useState('');
    const [isIncludeRemovedPlayer, setIsIncludeRemovedPlayer] = useState(false);

    useEffect(() => {
        if (isFromOtherPages) {
            _handleSearch();
            props.setIsFromOtherPages(false);
        }
    }, [isFromOtherPages]);

    const _handleSearch = () => {
        const newParam = Object.assign({}, {
            AffName: affName,
            UserName: userName,
            IbcUserName: ibcUserName,
            IsIncludeRemovedPlayer: isIncludeRemovedPlayer,
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
                    <Label for="affName" className="mr-2">{headerText.Affiliate}</Label>
                    <Input type="text" id="affName" name="affName" value={affName} onKeyPress={_handlePressEnter} onChange={(e) => setAffName(e.target.value)} />
                </FormGroup>
                <FormGroup className="mr-sm-3">
                    <Label for="userName" className="mr-2">{headerText.UserName}</Label>
                    <Input type="text" id="userName" name="userName" value={userName} onKeyPress={_handlePressEnter} onChange={(e) => setUserName(e.target.value)} />
                </FormGroup>
                <FormGroup className="mr-sm-3">
                    <Label for="ibcUserName" className="mr-2">{headerText.IbcUserName}</Label>
                    <Input type="text" id="ibcUserName" name="ibcUserName" value={ibcUserName} onKeyPress={_handlePressEnter} onChange={(e) => setIbcUserName(e.target.value)} />
                </FormGroup>
                <FormGroup className="mr-sm-3">
                    <Label checked>
                        Include removed Players
                        <Input className="ml-2 mt-1" type="checkbox" id="isIncludeRemovedPlayer" name="isIncludeRemovedPlayer" checked={isIncludeRemovedPlayer} onChange={(e) => setIsIncludeRemovedPlayer(!isIncludeRemovedPlayer)} />
                    </Label>
                </FormGroup>
                <Button outline color="primary" type="button" onClick={_handleSearch}>
                    <span className="oi oi-magnifying-glass"></span> {headerText.Search}
                </Button>
            </Form>
        </div>
    )
}

function mapStateToProps({ pagingOption, affName, isFromOtherPages }) {
    return Object.assign({}, { pagingOption, affName, isFromOtherPages });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam, setIsFromOtherPages }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));