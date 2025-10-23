import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import { toggleLoader } from '../../../actions/loaderAction';
import { setIsShowAddAffMktAccountPopup, setAff, fetchMarketingAccounts } from '../actions';
import ReportTitle from '../../../components/ReportTitle';
import GridData from './GridData';

import ReportExcel from '../libs/reportExcel';

export const Content = (props) => {
    const { params, canAddAffMktAccount, defaultMktAffInfo, reportTitle, targetCountryCodeList, languageCodeList } = props;

    const handleExportExcel = async () => {
        props.toggleLoader(true);

        const postData = Object.assign({}, params, { IsExportExcel: true });
        const data = await props.fetchMarketingAccounts(postData);

        const reportExcel = new ReportExcel(!data ? { MainData: [], TotalItem: 0 } : data, reportTitle, targetCountryCodeList, languageCodeList);
        reportExcel.export();

        props.toggleLoader(false);
    };

    const buildReportTitle = (reportTitle) => {
        return (
            <div className="d-flex align-items-center">
                {reportTitle}
                <button type="button" className="ml-auto btn btn-link btn-excel" onClick={handleExportExcel} title="Export Excel">
                    <span className="oi icon-excel"></span>
                </button>
            </div>
        );
    };

    const handleAddNewAccount = (affId, affName) => {
        props.setIsShowAddAffMktAccountPopup(true);
        props.setAff({ affId, affName });
    };

    const isShowCreateAffMktAccBtn = params && canAddAffMktAccount;
    const shouldShowReportTitle = params && reportTitle;

    return (
        <div className="data-content my-2">
            {isShowCreateAffMktAccBtn && <div className="my-2">
                <Button outline type="button" onClick={() => handleAddNewAccount(defaultMktAffInfo.affId, defaultMktAffInfo.affName)}>
                    Add New Account
                    <span className="oi oi-plus ml-2"></span>
                </Button>
            </div>}
            {shouldShowReportTitle && <ReportTitle content={buildReportTitle(reportTitle)} />}
            <GridData handleAddNewAccount={handleAddNewAccount} />
        </div>
    )
}

const mapStateToProps = ({ params, languageCodeList, targetCountryCodeList, canAddAffMktAccount, defaultMktAffInfo, reportTitle }) => {
    return {
        params,
        languageCodeList,
        targetCountryCodeList,
        defaultMktAffInfo,
        reportTitle,
        canAddAffMktAccount
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        toggleLoader,
        fetchMarketingAccounts,
        setIsShowAddAffMktAccountPopup,
        setAff
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));