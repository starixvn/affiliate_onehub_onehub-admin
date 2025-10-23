import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import { searchByList, resource, minDate, all } from '../libs/constants';
import { getDateRange } from '../../../modules/utils';
import { setParam } from '../actions';

export const Filter = (props) => {
    const { today } = props;
    const now = new Date(today);
    const nowString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

    const [searchBy, setSearch] = useState(all);
    const [isGetAll, setGetAll] = useState(true);
    const [fromDate, setFromDate] = useState(nowString);
    const [toDate, setToDate] = useState(nowString);

    const _handleChangeFromDate = (momentDate) => {
        const dateRange = getDateRange(momentDate, toDate);

        setFromDate(dateRange.fromDate);
        setToDate(dateRange.toDate);
    }

    const _handleChangeToDate = (momentDate) => {
        setToDate(momentDate.format("MM/DD/YYYY"));
    }

    const _handleSearch = () => {
        const { pagingOption } = props;

        const param = Object.assign({}, {
            SearchById: searchBy,
            IsGetAll: isGetAll,
            FromDate: fromDate,
            ToDate: toDate,
            PageIndex: 1,
            PageSize: pagingOption.PageSize
        });

        props.setParam(param);
    }

    return (
        <div className="filter-container">
            <Form inline tag="div">
                <FormGroup className="mr-sm-3">
                    <Label className="mr-2">{resource.SearchBy}</Label>
                    <Input type="select" name="searchBy" value={searchBy} onChange={(e) => setSearch(e.target.value)}>
                        {
                            Object.keys(searchByList).map(key => {
                                return (<option key={'searchBy-' + key} value={key}>{searchByList[key]}</option>)
                            })
                        }
                    </Input>
                </FormGroup>
                <FormGroup className="mx-sm-3">
                    <FormGroup check>
                        <Label check>
                            {resource.AllDate}
                            <Input name="isGetAll" className="ml-1" type="checkbox" checked={isGetAll} onChange={(e) => setGetAll(e.target.checked)} />
                        </Label>
                    </FormGroup>
                </FormGroup>
                <FormGroup className="mr-sm-3">
                    <Label className="mr-sm-2">{resource.From}</Label>
                    <DatePicker minDate={minDate} maxDate={nowString} date={fromDate} isEnable={!isGetAll}
                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                        onChange={_handleChangeFromDate} />
                </FormGroup>
                <FormGroup className="mr-sm-3">
                    <Label className="mr-sm-2">{resource.To}</Label>
                    <DatePicker minDate={fromDate} maxDate={nowString} date={toDate} isEnable={!isGetAll}
                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                        onChange={_handleChangeToDate} />
                </FormGroup>
                <Button outline color="primary" type="button" onClick={_handleSearch}>
                    <span className="oi oi-magnifying-glass"></span> {resource.Search}
                </Button>
            </Form>
        </div>
    )
}

function mapStateToProps({ today, pagingOption }) {
    return Object.assign({}, { today, pagingOption });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));