import React, { PureComponent } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { listAlPhabet, globalResource } from '../libs/constants';

export default class Filter extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            firstLetter: ''
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault()
            this.handleSearch();
        }
    }

    handleSearch = () => {
        this.props.setParam(this.state);
        this.props.fetchData(this.state);
    }

    render() {
        const { isPopup } = this.props;
        const { firstLetter, userName } = this.state;

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-3">
                        <Label className="mr-2">{isPopup ? 'Keyword' : 'User Name'}</Label>
                        <Input type="text" name="userName" placeholder="Keyword" value={userName} onKeyPress={this.handlePressEnter} onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup className="mr-sm-3">
                        <Label className="mr-2">First Letter</Label>
                        <Input type="select" name="firstLetter" value={firstLetter} onChange={this.handleChange}>
                            <option key={'firstLetter-All'} value=''>{globalResource.All}</option>
                            {
                                listAlPhabet.map((value) => {
                                    return (<option key={'firstLetter-' + value} value={value}>{value}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <Button outline color="primary" type="button" onClick={this.handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </Form>
            </div>
        )
    }
}