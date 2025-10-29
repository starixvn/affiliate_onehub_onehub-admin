import React, { PureComponent } from 'react';
import { Button } from 'reactstrap';
import NotificationPopup from './NotificationPopup';

export default class ButtonDeleteItems extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            itemIdList: [],
            message: '',
            isConfirmPopup: false
        }
    }

    _getCheckedItemIdList = (shouldCheckCanDelete = false) => {
        const { checkedItems } = this.props;
        if (!checkedItems || typeof checkedItems !== 'object') {
            return [];
        }

        const checkedItemsList = Object.keys(checkedItems);
        if (checkedItemsList.length === 0) {
            return [];
        }

        const firstValue = checkedItems[checkedItemsList[0]];
        if (typeof firstValue === 'boolean') {
            return checkedItemsList.filter(key => checkedItems[key]);
        }

        return checkedItemsList.filter(key => {
            const item = checkedItems[key];
            return item && item.isChecked && (shouldCheckCanDelete ? item.isCanDelete : true);
        });
    }

    _handleOpenNotificationPopup = (message, isConfirmPopup, itemIdList) => {
        this.setState({ message, isConfirmPopup: isConfirmPopup || false, itemIdList: itemIdList || [] });
    }

    _handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ message: '' });

        const { itemIdList } = this.state;
        if (confirmResult && itemIdList) {
            this._deleteExcute(itemIdList);
        }
    }

    _handleDelete = () => {
        const itemIdList = this._getCheckedItemIdList();
        itemIdList.length === 0 ? this._handleOpenNotificationPopup(this.props.messages.PleaseSelect) : this._handleOpenNotificationPopup(this.props.messages.AreYouSureDeleteItems, true, this._getCheckedItemIdList(true));
    }

    _deleteExcute = async (itemIdList) => {
        this.props.toggleLoader(true);
        
        if (itemIdList.length === 0) {
            this._handleOpenNotificationPopup('All selected items are currently in use and cannot be deleted.');
        } else {
            const result = await this.props.deleteItems(itemIdList.join(','));

            if (result) {
                if (result.IsSuccessful) {
                    this.props.isOpenNotification && this._handleOpenNotificationPopup(this.props.messages.DeleteItemsSuccessfully);
    
                    this.props.fetchData();
                }
                else {
                    this._handleOpenNotificationPopup(result.Message);
                }
            }
        }

        this.props.toggleLoader(false);
    }

    render() {
        const { message, isConfirmPopup } = this.state;

        return (
            <React.Fragment>
                {
                    !!message && <NotificationPopup
                        message={message}
                        isConfirmPopup={isConfirmPopup}
                        onClose={this._handleCloseNotificationPopup}
                    />
                }
                <Button outline type="button" color="danger" disabled={this.props.disabled} onClick={this._handleDelete}>Delete<span className={this.props.hasIcon ? "oi oi-x ml-2" : ""}></span></Button>
            </React.Fragment>
        );
    }
}