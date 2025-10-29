import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../../layouts/AppLayout';
import Filter from './Filter';
import Content from './Content';
import PaymentRequestUpdateForm from '../../../common/components/PaymentRequestUpdateForm';

import { setTransactionId, setParam, getAffiliateInfo } from '../actions';

export class AppContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    handleClosePopup = () => {
        this.props.setTransactionId(null);
    }

    handleFetchData = () => {
        const { affName } = this.props;
        this.props.getAffiliateInfo(affName);
    }

    render() {
        const { transactionId, licenseeName } = this.props;

        return (
            <AppLayout>
                <Filter />
                <Content />
                <PaymentRequestUpdateForm
                    licenseeName={licenseeName}
                    transactionId={transactionId}
                    handleClosePopup={this.handleClosePopup}
                    handleFetchData={this.handleFetchData}
                />
            </AppLayout>
        );
    }
}

function mapStateToProps({ statementHistory, affCommonInfo, licenseeName }) {
    const { transactionId } = statementHistory;
    const { affName } = affCommonInfo;
    return Object.assign({}, { transactionId, affName, licenseeName });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTransactionId, setParam, getAffiliateInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);