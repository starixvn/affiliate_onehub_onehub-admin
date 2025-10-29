import React from 'react';
import { connect } from 'react-redux';

import AppLayout from '../../../../layouts/AppLayout';
import Loader from '../../../../components/Loader';
import Filter from './Filter';
import Content from './Content';

export const AppContainer = (props) => {
    return <AppLayout>
        <Loader show={props.isShowLoader} />
        <Filter />
        <Content />
    </AppLayout>;
};

const mapStateToProps = ({ isShowLoader }) => {
    return {
        isShowLoader
    };
};

export default connect(mapStateToProps)(React.memo(AppContainer));