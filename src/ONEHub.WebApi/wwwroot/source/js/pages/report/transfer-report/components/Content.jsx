import React, { Component } from "react";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GridData from './GridData';
import ReportTitle from '../../../../components/ReportTitle';

import { toggleLoader } from '../../../../actions/loaderAction';
import ReportExcel from '../libs/reportExcel';
import { fetchData } from '../actions';

export class Content extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        const { reportTitle } = this.props;

        return nextProps.reportTitle !== reportTitle;
    }

    handleExportExcel = async () => {
        this.props.toggleLoader(true);
        const { param, reportTitle } = this.props;
        const newParam = Object.assign({}, param, { IsExportExcel: true });

        const data = await this.props.fetchData(newParam);

        if (data) {
             const reportExcel = new ReportExcel(data, reportTitle);
             reportExcel.export();
         }
        this.props.toggleLoader(false);
    }

    _buildReportTitle() {
        const { reportTitle } = this.props;

        return (
            <div className="d-flex align-items-center">
                {reportTitle}
                <button type="button" className="ml-auto btn btn-link btn-excel" onClick={this.handleExportExcel} title="Export Excel">
                    <span className="oi icon-excel"></span>
                </button>
            </div>
        )
    }

    render() {
        const { reportTitle } = this.props;

        return (
            <div className="data-content my-2 report-content-container">
                {
                    reportTitle && (
                        <ReportTitle content={this._buildReportTitle()} />
                    )
                }
                <GridData />
            </div>
        );
    }
}

function mapStateToProps({ reportTitle, param }) {
    return Object.assign({}, { reportTitle, param });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);