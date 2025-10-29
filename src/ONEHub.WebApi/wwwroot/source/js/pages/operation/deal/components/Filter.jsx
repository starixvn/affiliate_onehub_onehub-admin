import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

import { setParam } from '../actions';

export const Filter = (props) => {

    const [groupName, setGroupName] = useState('');
    const [groupTypeId, setGroupTypeId] = useState(0);

    const _handleSearch = () => {
        const { pagingOption } = props;
        const param = Object.assign({}, { PageIndex: 1, PageSize: pagingOption.PageSize }, { GroupName: groupName, GroupTypeId: groupTypeId });
        props.setParam(param);
    }

    const _handlePressEnter = (e) => {
        if (e.charCode === 13) {
            e.preventDefault()
            _handleSearch();
        }
    }

    return (
        <div className="filter-container">
            <Form inline tag="div">
                <FormGroup className="mb-2 mr-sm-2 my-2">
                    <Label htmlFor="DealName" className="mr-sm-2">Deal Name</Label>{' '}
                    <Input type="text"
                        name="DealName"
                        id="DealName"
                        className="mr-sm-2 search-box"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onKeyPress={_handlePressEnter} />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 my-2">
                    <Label htmlFor="DealType" className="mr-sm-2">Deal Type</Label>{' '}
                    <Input type="select"
                        name="DealType"
                        id="DealType"
                        className="mr-sm-2 search-box"
                        value={groupTypeId}
                        onChange={(e) => setGroupTypeId(e.target.value)}>
                        <option key={0} value={0}>All Types</option>
                        {props.dealTypeList.map((item, index) => (
                            <option key={index} value={item.GroupTypeId}>{item.GroupTypeName}</option>
                        ))}
                    </Input>
                </FormGroup>
                <Button outline color="primary" type="button" onClick={_handleSearch}>
                    <span className="oi oi-magnifying-glass"></span>
                    Search
                </Button>
            </Form>
        </div>
    );
}

const mapStateToProps = ({ pagingOption, dealTypeList }) => {
    return {
        pagingOption,
        dealTypeList
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setParam
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));