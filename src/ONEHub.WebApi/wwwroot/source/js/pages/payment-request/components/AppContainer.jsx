import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../layouts/AppLayout';
import Loader from '../../../components/Loader';
import Filter from './Filter';
import Content from './Content';
import PaymentRequestUpdateForm from '../../common/components/PaymentRequestUpdateForm';
import { setTransactionId, setParam } from '../actions';

export class AppContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    handleClosePopup = () => {
        this.props.setTransactionId(null);
    }

    handleFetchData = () => {
        this.props.setParam(this.props.param);
    }

    render() {
        const { isShowLoader, transactionId, licenseeName } = this.props;

        return (
            <AppLayout>
                <Loader show={isShowLoader} />
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

function mapStateToProps({ isShowLoader, transactionId, param, licenseeName }) {
    return Object.assign({}, { isShowLoader, transactionId, param, licenseeName });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setTransactionId, setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);