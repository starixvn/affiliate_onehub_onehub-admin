import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../layouts/AppLayout';
import Loader from '../../../components/Loader';
import Filter from './Filter';
import { ControlButtons } from '../../common/components/ControlButtons';
import Content from './Content';
import MessageDetailForm from './MessageDetailForm';
import { resource, messages, messageInsertId, messageCurrentId } from '../libs/constants';
import { fetchData, deleteMessages, toggleLoader, setCheckedMessages, setSelectedMessageId, setShouldResetScrollPosition } from '../actions';

export const AppContainer = (props) => {

    function _handleSetSelectedItemId(selectedType) {
        props.setSelectedMessageId(messageInsertId);
        props.setShouldResetScrollPosition(false);
    }

    function _handleClickOptionButton() {
        props.setSelectedMessageId(messageCurrentId);
        props.setShouldResetScrollPosition(false);
    }

    return (
        <AppLayout>
            <Loader show={props.isShowLoader} />
            <div className="message mt-2">
                <Filter />
                <ControlButtons
                    gridData={props.gridData}
                    checkedItems={props.checkedMessages}
                    toggleLoader={props.toggleLoader}
                    deleteItems={props.deleteMessages}
                    fetchData={() => props.fetchData(props.param)}
                    messages={messages}
                    setSelectedItemId={_handleSetSelectedItemId}
                    setShouldResetScrollPosition={props.setShouldResetScrollPosition}
                    label={resource.Add}
                    optionLabel={resource.CurrentMessage}
                    clickOptionButton={_handleClickOptionButton}
                    param={props.param}
                />
                <Content />
                <MessageDetailForm />
            </ div>
        </AppLayout>
    );
}

function mapStateToProps({ isShowLoader, checkedMessages, param, gridData }) {
    return Object.assign({}, { isShowLoader, checkedMessages, param, gridData });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchData, deleteMessages, toggleLoader, setCheckedMessages, setSelectedMessageId, setShouldResetScrollPosition }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));