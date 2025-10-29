import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';
import { memberTypes, resource, minDate } from '../modules/constants';
import { setParam } from '../actions';
import { getDateRange } from '../../../../modules/utils';

export class Filter extends React.Component {
    constructor(props) {
        super(props);

        const now = new Date(this.props.today);
        this.nowString = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

        this.state = {
            memberType: '0',
            fromDate: `${now.getMonth() + 1}/01/${now.getFullYear()}`,
            toDate: this.nowString,
            isGetAll: false
        }
    }

    handleChangeInput = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleChangeFromDate = (momentDate) => {
        this.setState(getDateRange(momentDate, this.state.toDate));
    }

    handleChangeToDate = (momentDate) => {
        this.setState({ toDate: momentDate.format("MM/DD/YYYY") });
    }

    handleSearch = () => {
        const param = Object.assign({}, this.state);
        this.props.setParam(param);
    }

    render() {
        const { memberType, fromDate, toDate, isGetAll } = this.state;

        return (
            <div className="filter-container py-0">
                <Form inline tag="div">
                    <FormGroup className="my-2 mr-sm-2">
                        <Label htmlFor="memberType" className="mr-sm-2">{resource.Member}</Label>
                        <Input type="select" name="memberType" id="memberType" value={memberType} onChange={this.handleChangeInput}>
                            <option key="memberType-0" value="0">Select</option>
                            {
                                Object.keys(memberTypes).map(k => {
                                    return (<option key={`memberType-${k}`} value={k}>{memberTypes[k]}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup className="my-2 mr-sm-2">
                        <Label className="mr-sm-2">{resource.From}</Label>
                        <DatePicker minDate={minDate} maxDate={this.nowString} date={fromDate} isEnable={!isGetAll}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeFromDate} />
                    </FormGroup>
                    <FormGroup className="my-2 mr-sm-2">
                        <Label className="mr-sm-2">{resource.To}</Label>
                        <DatePicker minDate={fromDate} maxDate={this.nowString} date={toDate} isEnable={!isGetAll}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeToDate} />
                    </FormGroup>
                    <FormGroup className="my-2 mr-sm-2">
                        <FormGroup check>
                            <Label check>
                                {resource.GetAll}
                                <Input name="isGetAll" className="ml-1 mr-2" type="checkbox" checked={isGetAll} onChange={this.handleChangeInput} />
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    <Button outline color="primary" type="button" className="my-2" onClick={this.handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {resource.Search}
                    </Button>
                </Form>
            </div>
        )
    }
}

function mapStateToProps({ today }) {
    return Object.assign({}, { today });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);