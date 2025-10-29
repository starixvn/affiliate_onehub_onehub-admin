import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import { searchByList, globalResource, resource, minDate, all, unknownAffiliate } from '../libs/constants';
import { getDateRange } from '../../../modules/utils';
import { setParam } from '../actions';

export class Filter extends PureComponent {
    constructor(props) {
        super(props);

        const { today } = this.props;
        const now = new Date(today);

        this.nowString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

        this.state = {
            searchBy: all,
            searchText: '',
            isGetAll: true,
            fromDate: this.nowString,
            toDate: this.nowString,
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({ [target.name]: value });
        target.name === "searchBy" && this.setState({ searchText: '' });
    }

    handleChangeFromDate = (momentDate) => {
        this.setState(prevState => getDateRange(momentDate, prevState.toDate));
    }

    handleChangeToDate = (momentDate) => {
        this.setState({ toDate: momentDate.format("MM/DD/YYYY") });
    }

    handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault()
            this.handleSearch();
        }
    }

    handleSearch = () => {
        const { searchBy, searchText, fromDate, toDate, isGetAll } = this.state;
        const { pagingOption } = this.props;

        const param = Object.assign({}, {
            SearchById: searchBy,
            SearchText: searchText,
            IsGetAll: isGetAll,
            FromDate: fromDate,
            ToDate: toDate,
            PageIndex: 1,
            PageSize: pagingOption.PageSize
        });

        this.props.setParam(param);
    }

    render() {
        const { searchBy, fromDate, toDate, isGetAll, searchText } = this.state;

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-3 my-2">
                        <Label className="mr-2">{globalResource.SearchBy}</Label>
                        <Input type="select" name="searchBy" value={searchBy} onChange={this.handleChange}>
                            {
                                Object.keys(searchByList).map(key => {
                                    return (<option key={'searchBy-' + key} value={key}>{searchByList[key]}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    {searchBy != all && searchBy != unknownAffiliate && (
                        <FormGroup className="mr-sm-3 my-2">
                            <Label className="mr-sm-2">{resource.SearchText}</Label>
                            <Input type="text" name="searchText" value={searchText} onKeyPress={this.handlePressEnter} onChange={this.handleChange} />
                        </FormGroup>
                    )}
                    <FormGroup className="mx-sm-3">
                        <FormGroup check>
                            <Label check>
                                {resource.AllDate}
                                <Input name="isGetAll" className="ml-1" type="checkbox" checked={isGetAll} onChange={this.handleChange} />
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    <FormGroup className="mr-sm-3 my-2">
                        <Label className="mr-sm-2">{globalResource.From}</Label>
                        <DatePicker minDate={minDate} maxDate={this.nowString} date={fromDate} isEnable={!isGetAll}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeFromDate} />
                    </FormGroup>
                    <FormGroup className="mr-sm-3 my-2">
                        <Label className="mr-sm-2">{globalResource.To}</Label>
                        <DatePicker minDate={fromDate} maxDate={this.nowString} date={toDate} isEnable={!isGetAll}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeToDate} />
                    </FormGroup>
                    <Button outline color="primary" type="button" onClick={this.handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </Form>
            </div>
        )
    }
}

function mapStateToProps({ today, pagingOption }) {
    return Object.assign({}, { today, pagingOption });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);