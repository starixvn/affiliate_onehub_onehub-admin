import React from 'react';
import { connect } from 'react-redux';

import AppLayout from '../../../layouts/AppLayout';
import Loader from '../../../components/Loader';
import Filter from './Filter';
import Content from './Content';
import EmailDetailForm from './EmailDetailForm';

export const AppContainer = (props) => {
    return (
        <AppLayout>
            <Loader show={props.isShowLoader} />
            <Filter />
            <Content />
            <EmailDetailForm />
        </AppLayout>
    );
}

function mapStateToProps({ isShowLoader }) {
    return Object.assign({}, { isShowLoader });
}

export default connect(mapStateToProps)(React.memo(AppContainer));