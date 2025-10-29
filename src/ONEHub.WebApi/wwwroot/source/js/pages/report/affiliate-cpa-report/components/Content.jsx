import React from "react";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GridData from './GridData';
import ReportTitle from '../../../../components/ReportTitle';

import { toggleLoader } from '../../../../actions/loaderAction';
import { fetchAffiliateCpaData } from '../libs/services';
import ExportExcel from "../libs/exportExcel";
import { headers } from "../libs/constants";

const isExportExcel = true;

const Title = ({ reportTitle, params, toggleLoader}) => {

    const handleExportExcel = async () => {
        toggleLoader(true);
        const data = await fetchAffiliateCpaData(params, isExportExcel);
        const excel = new ExportExcel(data, reportTitle, headers);
        excel.export();
        toggleLoader(false);
    }

    return (
        <div className="d-flex align-items-center">
            {reportTitle}
            <button type="button" className="ml-auto btn btn-link btn-excel" onClick={handleExportExcel} title="Export Excel">
                <span className="oi icon-excel"></span>
            </button>
        </div>
    )
}

const Content = ({ reportTitle, params, toggleLoader }) => {
    return (
        <div className="data-content my-2 report-aff-cpa-content-container">
            {
                reportTitle && (
                    <ReportTitle content={<Title reportTitle={reportTitle} params={params} toggleLoader={toggleLoader} />} />
                )
            }
            <GridData />
        </div>
    );
}

function mapStateToProps({ reportTitle, params }) {
    return Object.assign({}, { reportTitle, params });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);