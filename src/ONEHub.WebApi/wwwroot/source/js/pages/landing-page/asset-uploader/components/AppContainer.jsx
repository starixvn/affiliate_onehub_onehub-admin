import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer } from 'react-toastify';

import Loader from '../../../../components/Loader';
import Filter from './Filter';
import ControlButtons from '../../../common/components/ControlButtons';
import Content from './Content';
import MediaReviewPopup from '../../../common/components/MediaReviewPopup';
import AssetUploaderForm from './AssetUploaderForm';

import { messageDelete, messageSwitchStatus } from '../libs/constants';
import { assetStatus } from '../../libs/constants';
import { setParam, fetchData, toggleLoader, setSelectedMediaId, setCheckedAssets, deleteAssets, setShouldResetScrollPosition, setAssetDetailUrl, setNotification, toggleAssetStatus } from '../actions';
import NotificationPopup from '../../../common/components/NotificationPopup';
import { showSuccessToast, showErrorToast } from '../../../common/components/Toast';

export const AppContainer = (props) => {
    const { isModifyInAssetUploader } = props;

    const _getCheckedItemIdList = () => {
        const { checkedAssets } = props;
        if (!checkedAssets || typeof checkedAssets !== 'object') {
            return [];
        }

        return Object.keys(checkedAssets).filter(key => {
            const item = checkedAssets[key];
            return item && item.isChecked;
        });
    }

    const _handleSwitchStatus = async () => {
        if (!isModifyInAssetUploader) {
            return;
        }

        const itemIdList = _getCheckedItemIdList();

        if(itemIdList.length === 0) {
            showErrorToast("Selection Required", messageSwitchStatus.PleaseSelect);
        }
        else {
            const firstItem = props.gridData.find(item => itemIdList.includes(item.MediaId.toString()));
            const newStatus = firstItem.StatusId === assetStatus.active ? assetStatus.inactive : assetStatus.active;

            const htmlMessage = `
                <div style="white-space: normal;">
                    <span>Only active image(s) will be available for selection when creating a new landing page.</span>
                    <div class="switch-status-popup">
                        <label for="selected-status">Switch status of all selected image(s) to:</label><br/>
                        <select 
                            name="selected-status" 
                            id="selected-status" 
                            class="form-control ml-2" 
                            style="width: auto; display: inline-block;"
                        >
                            <option value="${assetStatus.active}" ${newStatus === assetStatus.active ? 'selected' : ''}>Active</option>
                            <option value="${assetStatus.inactive}" ${newStatus === assetStatus.inactive ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                    <span>Are you sure you want to proceed?</span>
                </div>
            `;

            props.setNotification({
                message: htmlMessage,
                isConfirmPopup: true,
                onConfirm: async (confirmData) => {
                    let statusToApply = newStatus;
                    if (confirmData && typeof confirmData === 'object' && confirmData.selectValue) {
                        statusToApply = parseInt(confirmData.selectValue);
                    }
                    
                    const result = await props.toggleAssetStatus({ mediaIds: itemIdList.join(','), statusId: statusToApply });
                    if (result && result.IsSuccessful) {
                        props.fetchData(props.param);
                    }
                    
                    if (result?.IsSuccessful) {
                        showSuccessToast("Status Updated!", messageSwitchStatus.SwitchStatusSuccessfully);
                    } else {
                        showErrorToast("Status Update Failed", result?.Message || messageSwitchStatus.FailedToSwitchStatus);
                    }
                }
            });
        }
    }

    return (
        <>
            <Loader show={props.isShowLoader} />
            <Filter />
            <ControlButtons
                messages={messageDelete}
                gridData={props.gridData}
                fetchData={() => props.fetchData(props.param)}
                checkedItems={isModifyInAssetUploader ? props.checkedAssets : null}
                setCheckedItems={props.setCheckedAssets}
                toggleLoader={props.toggleLoader}
                setShouldResetScrollPosition={props.setShouldResetScrollPosition}
                setSelectedItemId={props.setSelectedMediaId}
                deleteItems={(mediaIds) => props.deleteAssets(mediaIds)}
                optionLabel="Switch Status <span class='oi oi-loop-circular'></span>"
                clickOptionButton={_handleSwitchStatus}
            />
            <Content />
            <MediaReviewPopup
                mediaDetailUrl={props.assetDetailUrl}
                setMediaDetailUrl={props.setAssetDetailUrl}
            />
            <AssetUploaderForm />
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

function mapStateToProps({ isShowLoader, param, gridData, checkedAssets, assetDetailUrl, notification, statusList, isModifyInAssetUploader }) {
    return Object.assign({}, { isShowLoader, param, gridData, checkedAssets, assetDetailUrl, notification, statusList, isModifyInAssetUploader });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam, fetchData, toggleLoader, setSelectedMediaId, setCheckedAssets, deleteAssets, setShouldResetScrollPosition, setAssetDetailUrl, setNotification, toggleAssetStatus }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));