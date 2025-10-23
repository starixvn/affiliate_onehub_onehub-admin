import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';

import Loader from '../../../../components/Loader';
import ControlButtons from '../../../common/components/ControlButtons';
import Content from './Content';
import RegistrationForm from './RegistrationForm';
import MediaReviewPopup from '../../../common/components/MediaReviewPopup';

import { messageDelete } from '../libs/constants';
import { fetchData, toggleLoader, setSelectedMediaId, setCheckedForms, deleteForms, setShouldResetScrollPosition, setFormDetailUrl, setNotification } from '../actions';
import Filter from './Filter';
import NotificationPopup from '../../../common/components/NotificationPopup';

export const AppContainer = (props) => {

    return (
        <>
            <Loader show={props.isShowLoader} />
            <Filter />
            <ControlButtons
                label={"Add Registration"}
                messages={messageDelete}
                gridData={props.param}
                fetchData={() => props.fetchData(props.param)}
                checkedItems={props.checkedForms}
                setCheckedItems={props.setCheckedForms}
                toggleLoader={props.toggleLoader}
                setShouldResetScrollPosition={props.setShouldResetScrollPosition}
                setSelectedItemId={props.setSelectedMediaId}
                deleteItems={(mediaIdList) => props.deleteForms({ mediaIdList })}
            />
            <Content />
            <RegistrationForm />
            <MediaReviewPopup
                mediaDetailUrl={props.formDetailUrl}
                setMediaDetailUrl={props.setFormDetailUrl}
            />
            <NotificationPopup
                message={props.notification.message}
                isConfirmPopup={props.notification.isConfirmPopup}
                onClose={(result) => {
                    if (props.notification.onConfirm && result) {
                        props.notification.onConfirm(result);
                    }
                    props.setNotification({ message: '', isConfirmPopup: false, onConfirm: null });
                }}
            />
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="landing-page-toast-container"
            />
        </>
    );
}

function mapStateToProps({ isShowLoader, gridData, checkedForms, formDetailUrl, param, notification }) {
    return Object.assign({}, { isShowLoader, gridData, checkedForms, formDetailUrl, param, notification });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchData, toggleLoader, setSelectedMediaId, setCheckedForms, deleteForms, setShouldResetScrollPosition, setFormDetailUrl, setNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));