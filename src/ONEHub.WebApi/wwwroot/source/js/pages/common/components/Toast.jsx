import React from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const ConfirmToast = ({ title, content, onConfirm, onCancel, cancelText, submitText, isNotification = false }) => (
    <div className="confirm-toast">
        <div className="toast-header confirm-header">
            <div className="header-content">
                <span className="iconpopup"></span>{title}
            </div>
            <button
                type="button"
                className="close-button"
                onClick={onCancel}
                aria-label="Close"
            >
                ×
            </button>
        </div>
        <div className="toast-content">
            {Array.isArray(content) ? (
                content.map((line, index) => (
                    <p key={index} className="toast-line"><div dangerouslySetInnerHTML={{ __html: line }}></div></p>
                ))
            ) : (
                <p className="toast-line"><div dangerouslySetInnerHTML={{ __html: content }}></div></p>
            )}
            <div className="toast-actions">
                {
                    !isNotification && (
                        <button
                            type="button"
                            className="btn btn-info mr-2"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    )
                }
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={onConfirm}
                >
                    {submitText}
                </button>
            </div>
        </div>
    </div>
);

const NotificationToast = ({ title, content, type, toastId }) => {
    const getIconClass = (type) => {
        switch (type) {
            case 'success':
                return 'toast-icon-success';
            case 'error':
                return 'toast-icon-error';
            case 'info':
                return 'toast-icon-info';
            case 'warning':
                return 'toast-icon-warning';
            default:
                return 'iconpopup';
        }
    };

    return (
        <div className="notification-toast">
            <div className={`toast-header ${type}-header`}>
                <div className="header-content">
                    <span className={getIconClass(type)}></span>{title}
                </div>
                <button
                    type="button"
                    className="close-button"
                    onClick={() => toast.dismiss(toastId)}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            <div className="toast-content">
                {Array.isArray(content) ? (
                    content.map((line, index) => (
                        <p key={index} className="toast-line"><div dangerouslySetInnerHTML={{ __html: line }}></div></p>
                    ))
                ) : (
                    <p className="toast-line"><div dangerouslySetInnerHTML={{ __html: content }}></div></p>
                )}
            </div>
        </div>
    );
};

export const showConfirmToast = ({
    title = "Confirm this Action",
    content = [],
    onConfirm,
    onCancel,
    cancelText = "Cancel",
    submitText = "Yes",
    isNotification = false
}) => {
    const toastId = `confirm-${uuidv4()}`;

    toast(
        <ConfirmToast
            title={title}
            content={content}
            cancelText={cancelText}
            submitText={submitText}
            isNotification={isNotification}
            toastId={toastId}
            onConfirm={() => {
                onConfirm && onConfirm();
                toast.dismiss(toastId);
            }}
            onCancel={() => {
                onCancel && onCancel();
                toast.dismiss(toastId);
            }}
        />,
        {
            toastId: toastId,
            position: 'top-center',
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            draggable: false,
            className: 'confirm-toast-container confirm-toast-modal',
            bodyClassName: 'confirm-toast-body',
            hideProgressBar: true,
        }
    );
};

export const showSuccessToast = (title = "Success!", message = "Operation completed successfully", autoClose = 5000) => {
    const toastId = `success-${uuidv4()}`;

    toast(
        <NotificationToast
            title={title}
            content={message}
            type="success"
            toastId={toastId}
        />,
        {
            toastId: toastId,
            position: 'top-right',
            autoClose: autoClose,
            closeOnClick: true,
            closeButton: false,
            draggable: false,
            className: 'notification-toast-container',
            bodyClassName: 'notification-toast-body',
            hideProgressBar: true,
        }
    );
};

export const showErrorToast = (title = "Error!", message = "Something went wrong", autoClose = 5000) => {
    const toastId = `error-${uuidv4()}`;

    toast(
        <NotificationToast
            title={title}
            content={message}
            type="error"
            toastId={toastId}
        />,
        {
            toastId: toastId,
            position: 'top-right',
            autoClose: autoClose,
            closeOnClick: true,
            closeButton: false,
            draggable: false,
            className: 'notification-toast-container',
            bodyClassName: 'notification-toast-body',
            hideProgressBar: true,
        }
    );
};

export const showInfoToast = (title = "Information", message = "Please note", autoClose = 5000) => {
    const toastId = `info-${uuidv4()}`;

    toast(
        <NotificationToast
            title={title}
            content={message}
            type="info"
            toastId={toastId}
        />,
        {
            toastId: toastId,
            position: 'top-right',
            autoClose: autoClose,
            closeOnClick: true,
            closeButton: false,
            draggable: false,
            className: 'notification-toast-container',
            bodyClassName: 'notification-toast-body',
            hideProgressBar: true,
        }
    );
};

export const showWarningToast = (title = "Warning", message = "Warning message", autoClose = 5000) => {
    const toastId = `warning-${uuidv4()}`;

    toast(
        <NotificationToast
            title={title}
            content={message}
            type="warning"
            toastId={toastId}
        />,
        {
            toastId: toastId,
            position: 'top-right',
            autoClose: autoClose,
            closeOnClick: true,
            closeButton: false,
            draggable: false,
            className: 'notification-toast-container',
            bodyClassName: 'notification-toast-body',
            hideProgressBar: true,
        }
    );
};

export default {
    showConfirmToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast
};
