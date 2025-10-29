import React from 'react';
import { connect } from 'react-redux';
import AppLayout from '../../../../layouts/AppLayout';
import Content from './Content';
import Loader from '../../../../components/Loader';

export const AppContainer = (props) => {
    return (
        <AppLayout>
            <Loader show={props.isShowLoader} />
            <Content />
        </AppLayout>
    );
}

function mapStateToProps({ leftPanel }) {
    const { isShowLoader } = leftPanel;
    return Object.assign({}, { isShowLoader });
}

export default connect(mapStateToProps)(React.memo(AppContainer));