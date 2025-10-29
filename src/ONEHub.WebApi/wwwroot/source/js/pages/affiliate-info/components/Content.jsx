import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleLoader } from '../../../actions/loaderAction';
import ReportTitle from '../../../components/ReportTitle';
import GridData from './GridData';

import ReportExcel from '../libs/reportExcel';
import { post } from '../../../modules/ajaxRequest';
import { convertSelectedColumnList } from '../libs/utils';
import { regExp } from '../libs/constants';

export class Content extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextprops) {
        const { reportTitle } = this.props;

        return nextprops.reportTitle !== reportTitle;
    }

    handleExportExcel = async () => {
        this.props.toggleLoader(true);
        const { param, reportTitle, languageList, columnList, targetCountryList } = this.props;
        const selectedColumnList = convertSelectedColumnList(columnList);
        const regexCheckAffCode = new RegExp(regExp.CheckAffCode);

        if (param.AffCode === '' || regexCheckAffCode.test(param.AffCode)) {
            const url = `Portal/Affiliate/GetAffiliateList`;
            const postData = Object.assign({}, param, { IsExportExcel: true });
            const response = await post(url, postData);

            if (response && response.status === 200) {
                const reportExcel = new ReportExcel(response.data, reportTitle, targetCountryList, languageList, selectedColumnList)
                reportExcel.export();
            }
        }
        else {
            const reportExcel = new ReportExcel({ MainData: {}, TotalItem: 0 }, reportTitle, targetCountryList, languageList, selectedColumnList)
            reportExcel.export();
        }
        this.props.toggleLoader(false);
    }

    _buildReportTitle(reportTitle) {
        return (
            <div className="d-flex align-items-center">
                {reportTitle}
                <button type="button" className="ml-auto btn btn-link btn-excel" onClick={this.handleExportExcel} title="Export Excel">
                    <span className="oi icon-excel"></span>
                </button>
            </div>
        );
    }

    render() {
        const { reportTitle, } = this.props;

        return (
            <div className="data-content my-2">
                {reportTitle && <ReportTitle content={this._buildReportTitle(reportTitle)} />}
                <GridData />
            </div>
        );
    }
}

function mapStateToProps({ reportTitle, param, languageList, columnList, targetCountryList }) {
    return Object.assign({}, { reportTitle, param, languageList, columnList, targetCountryList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);