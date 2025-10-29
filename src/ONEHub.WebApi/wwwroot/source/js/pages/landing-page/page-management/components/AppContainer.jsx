import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';

import Loader from '../../../../components/Loader';
import Filter from './Filter';
import Content from './Content';
import NotificationPopup from '../../../common/components/NotificationPopup';
import { setNotification } from '../actions';

export const AppContainer = (props) => {
    return (
        <>
            <Loader show={props.isShowLoader} />
            <Filter />
            <Content />
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

function mapStateToProps({ isShowLoader, notification }) {
    return Object.assign({}, { isShowLoader, notification });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));