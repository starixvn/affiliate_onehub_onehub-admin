import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import { setSelectedSiteUrl, setParam } from '../actions';
import { getDateRange } from '../../../../modules/utils';
import { headerText, globalResource, deviceTypes, AllDevices, minDate } from '../modules/constants';

export class Filter extends PureComponent {
    constructor(props) {
        super(props);

        const { today, param } = this.props;
        const { deviceType, fromDate, toDate } = param;

        const now = new Date(today);
        this.nowString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
        const firstDayOfCurrentMonth = `${now.getMonth() + 1}/01/${now.getFullYear()}`;

        this.state = {
            deviceType: param.isClickLink ? deviceType : AllDevices,
            fromDate: param.isClickLink ? fromDate : firstDayOfCurrentMonth,
            toDate: param.isClickLink ? toDate : this.nowString
        }
    }

    componentDidMount() {
        if (this.props.param.isClickLink) {
            this.handleSearch(this.state);
        }
    }

    componentDidUpdate(prevProps) {
        const { param } = this.props;

        if (param !== prevProps.param) {
            const newState = Object.assign({}, { deviceType: param.deviceType, fromDate: param.fromDate, toDate: param.toDate });

            this.setState(newState);
            this.props.setSelectedSiteUrl(null);

            if (param.isClickLink) {
                this.handleSearch(newState);
            }
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeFromDate = (momentDate) => {
        this.setState(getDateRange(momentDate, this.state.toDate));
    }

    handleChangeToDate = (momentDate) => {
        this.setState({ toDate: momentDate.format("MM/DD/YYYY") });
    }

    handleSearch = (state) => {
        this.props.setParam(state);
        this.props.setSelectedSiteUrl(null);
    }

    render() {
        const { deviceType, fromDate, toDate } = this.state;

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.From}</Label>
                        <DatePicker minDate={minDate} maxDate={this.nowString} date={fromDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeFromDate} />
                    </FormGroup>
                    <FormGroup className="mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.To}</Label>
                        <DatePicker minDate={fromDate} maxDate={this.nowString} date={toDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeToDate} />
                    </FormGroup>
                    <FormGroup className="mr-sm-2">
                        <Label htmlFor="deviceType" className="mr-sm-2">{headerText.Device}</Label>
                        <Input type="select" name="deviceType" id="deviceType" value={deviceType} onChange={this.handleChange}>
                            {
                                Object.keys(deviceTypes).map(key => {
                                    return (<option key={`deviceType-${deviceTypes[key]}`} value={deviceTypes[key]}>{key}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <Button outline color="primary" type="button" onClick={() => this.handleSearch(this.state)}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </Form>
            </div>
        )
    }
}

function mapStateToProps({ today, clickStatistics }) {
    const { param } = clickStatistics;

    return Object.assign({}, {
        today,
        param
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedSiteUrl, setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);