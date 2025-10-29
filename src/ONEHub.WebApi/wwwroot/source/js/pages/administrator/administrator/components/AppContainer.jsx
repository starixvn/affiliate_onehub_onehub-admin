import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../../layouts/AppLayout';
import Loader from '../../../../components/Loader';
import Filter from '../../common/components/Filter';
import Content from '../../common/components/Content';
import { setParam, setShouldResetScrollPosition, fetchData, changeStatus } from '../actions';

export const AppContainer = (props) => {
    return (
        <AppLayout>
            <Loader show={props.isShowLoader} />
            <Filter
                setParam={props.setParam}
                fetchData={props.fetchData}
            />
            <Content
                param={props.param}
                gridData={props.gridData}
                shouldResetScrollPosition={props.shouldResetScrollPosition}
                setShouldResetScrollPosition={props.setShouldResetScrollPosition}
                fetchData={props.fetchData}
                changeStatus={props.changeStatus}
            />
        </AppLayout>
    );
}

function mapStateToProps({ isShowLoader, param, gridData, shouldResetScrollPosition }) {
    return Object.assign({}, { isShowLoader, param, gridData, shouldResetScrollPosition });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam, setShouldResetScrollPosition, fetchData, changeStatus }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));