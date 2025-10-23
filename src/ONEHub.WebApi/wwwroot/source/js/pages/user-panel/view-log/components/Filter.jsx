import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import { headerText, globalResource, minDate } from '../modules/constants';
import { setParam, setShowIdList, getLogTypeList } from '../actions';
import { getDateRange } from '../../../../modules/utils';

export class Filter extends React.Component {
    constructor(props) {
        super(props);

        const { today } = this.props;
        const now = new Date(today);

        this.nowString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

        let sixMonthAgo = new Date(today);
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

        this.state = {
            logType: 0,
            fromDate: sixMonthAgo < minDate ? '01/01/2020' : `${sixMonthAgo.getMonth() + 1}/${sixMonthAgo.getDate()}/${sixMonthAgo.getFullYear()}`,
            toDate: this.nowString,
            logTypeList: null
        }
    }

    componentDidMount() {
        this.getLogTypeList();
    }

    getLogTypeList = async () => {
        const logTypeList = await this.props.getLogTypeList();

        this.setState({ logTypeList });
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

    handleSearch = () => {
        this.props.setParam(this.state);
        this.props.setShowIdList({});
    }

    render() {
        const { logType, fromDate, toDate, logTypeList } = this.state;

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    {
                        logTypeList && <FormGroup className="mr-sm-2">
                            <Label htmlFor="logType" className="mr-sm-2">{headerText.Type}</Label>
                            <Input type="select" name="logType" id="logType" value={logType} onChange={this.handleChange}>
                                <option value="0">{globalResource.All}</option>
                                {
                                    logTypeList.map(logType => {
                                        return (<option key={`logType-${logType.TypeId}`} value={logType.TypeId}>{logType.TypeName}</option>)
                                    })
                                }
                            </Input>
                        </FormGroup>
                    }
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
                    <Button outline color="primary" type="button" onClick={this.handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </Form>
            </div>
        )
    }
}

function mapStateToProps({ today }) {
    return Object.assign({}, {
        today
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam, setShowIdList, getLogTypeList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);