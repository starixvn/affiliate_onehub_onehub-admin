import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';

import { resource, messages } from '../libs/constants';
import { fetchData, deleteEmailHistory, toggleLoader } from '../actions';
import { NotificationPopup } from '../../common/components/NotificationPopup';

export class DeleteEmail extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            emailIdList: '',
            messageNotification: '',
            isConfirmPopup: true
        }
    }

    handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ messageNotification: '' });

        const { emailIdList } = this.state;
        if (confirmResult && emailIdList) {
            this._deleteEmails(emailIdList);
        }
    }

    _handleDeleteEmails = () => {
        const emailIdList = this._getCheckedEmailIdList();

        !emailIdList.length ? this.setState({ messageNotification: messages.PleaseSelect, isConfirmPopup: false }) : this.setState({ messageNotification: messages.AreYouSureDeleteEmails, isConfirmPopup: true, emailIdList });
    }

    _deleteEmails = async (emailIdList) => {
        this.props.toggleLoader(true);

        const param = {
            EmailIdList: emailIdList.join(',')
        };

        const result = await this.props.deleteEmailHistory(param);

        if (result) {
            if (result.IsSuccessful) {
                this.setState({ messageNotification: messages.DeleteEmails, isConfirmPopup: false });
                this.props.fetchData(this.props.param);
            }
            else {
                this.setState({ messageNotification: result.Message, isConfirmPopup: false });
            }
        }

        this.props.toggleLoader(false);
    }

    _getCheckedEmailIdList() {
        const { checkedEmails } = this.props;

        return Object.keys(checkedEmails).filter(key => checkedEmails[key]);
    }

    render() {
        const { messageNotification, isConfirmPopup } = this.state;

        return (
            <div className="my-2">
                <Button outline type="button" color="danger" onClick={this._handleDeleteEmails}>{resource.Delete}<span className="oi oi-trash ml-2"></span></Button>
                {
                    !!messageNotification && <NotificationPopup
                        message={messageNotification}
                        isConfirmPopup={isConfirmPopup}
                        onClose={this.handleCloseNotificationPopup}
                    />
                }
            </div>
        );
    }
}


function mapStateToProps({ checkedEmails, param }) {
    return Object.assign({}, { checkedEmails, param });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchData, deleteEmailHistory, toggleLoader }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteEmail);