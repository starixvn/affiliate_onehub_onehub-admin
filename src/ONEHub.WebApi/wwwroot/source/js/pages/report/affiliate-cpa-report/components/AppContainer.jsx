import React from 'react';
import { connect } from 'react-redux';

import AppLayout from '../../../../layouts/AppLayout';
import Filter from './Filter';
import Content from './Content';
import Loader from '../../../../components/Loader';
import ViewDealWrapper from '../../../operation/view-deal';

import { toggleDealPopup } from '../actions';

export const AppContainer = (props) => {
    return (
        <AppLayout>
            <Loader show={props.isShowLoader} />
            <Filter />
            <Content />
            {props.isShowDealPopup && <ViewDealWrapper dealId={props.dealId} affName={props.affName} toggle={props.toggleDealPopup} />}
        </AppLayout>
    );
}

const mapStateToProps = (state) => {
    return {
        isShowLoader: state.isShowLoader,
        isShowDealPopup: state.isShowDealPopup,
        dealId: state.dealId,
        affName: state.affName
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleDealPopup: () => dispatch(toggleDealPopup())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));