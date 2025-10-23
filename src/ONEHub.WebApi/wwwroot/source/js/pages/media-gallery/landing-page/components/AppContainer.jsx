import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../../layouts/AppLayout';
import Loader from '../../../../components/Loader';
import ControlButtons from '../../../common/components/ControlButtons';
import Content from './Content';
import InsertUpdateForm from './InsertUpdateForm';

import { messages } from '../libs/constants';
import { fetchData, toggleLoader, setSelectedLandingPageId, setCheckedLandingPages, deleteLandingPages, setShouldResetScrollPosition } from '../actions';

export const AppContainer = (props) => {
    return (
        <AppLayout>
            <Loader show={props.isShowLoader} />
            <ControlButtons
                messages={messages}
                gridData={props.gridData}
                fetchData={props.fetchData}
                checkedItems={props.checkedLandingPages}
                setCheckedItems={props.setCheckedLandingPages}
                toggleLoader={props.toggleLoader}
                setShouldResetScrollPosition={props.setShouldResetScrollPosition}
                setSelectedItemId={props.setSelectedLandingPageId}
                deleteItems={props.deleteLandingPages}
            />
            <Content />
            <InsertUpdateForm />
        </AppLayout>
    );
}

function mapStateToProps({ isShowLoader, gridData, checkedLandingPages }) {
    return Object.assign({}, { isShowLoader, gridData, checkedLandingPages });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchData, toggleLoader, setSelectedLandingPageId, setCheckedLandingPages, deleteLandingPages, setShouldResetScrollPosition }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));