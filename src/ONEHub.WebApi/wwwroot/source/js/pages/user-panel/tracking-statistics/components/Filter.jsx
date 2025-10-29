import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

import { setParam, setSelectedMonth, getTrackingCodeList } from '../actions';
import { resource, globalResource } from '../modules/constants';

export class Filter extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedTrackingCode: '',
            trackingCodeList: null
        }
    }

    componentDidMount() {
        if (!this.state.trackingCodeList) {
            this.handleGetTrackingCodeList(this.props.affId);
        }

        if (this.props.isClickLink) {
            this.handleClickSearch();
        }
    }

    componentDidUpdate() {
        if (this.props.isClickLink) {
            this.handleClickSearch();
        }
    }

    handleGetTrackingCodeList = async (affId) => {
        const trackingCodeList = await this.props.getTrackingCodeList(affId);

        this.setState({ trackingCodeList });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleClickSearch = () => {
        const param = { trackingCode: this.state.selectedTrackingCode };

        this.props.setParam(param);
        this.props.setSelectedMonth(null);
    }

    render() {
        const { selectedTrackingCode, trackingCodeList } = this.state;

        return trackingCodeList && (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-2">
                        <Label className="mr-2">{resource.TrackingCode}</Label>
                        <Input type="select" name="selectedTrackingCode" value={selectedTrackingCode} onChange={this.handleChange}>
                            <option value="">{resource.All}</option>
                            {
                                trackingCodeList.map(trackingCode => {
                                    return (<option key={'trackingCode-' + trackingCode} value={trackingCode}>{trackingCode}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <Button outline color="primary" type="button" onClick={this.handleClickSearch} >
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ affCommonInfo, trackingStatistics }) {
    const { param } = trackingStatistics;
    const { affId } = affCommonInfo;

    return Object.assign({}, {
        isClickLink: !!param.isClickLink,
        affId
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam, setSelectedMonth, getTrackingCodeList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);