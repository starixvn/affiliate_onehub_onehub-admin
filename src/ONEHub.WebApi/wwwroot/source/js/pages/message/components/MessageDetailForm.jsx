import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Alert, Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { setSelectedMessageId, getMessageDetail, fetchData, insertMessage, updateMessage, toggleLoader, deleteMessages } from '../actions';

import { htmlDecode } from '../../../modules/htmlHelper';
import { resource, popupTitle, messages, messageInsertId, messageCurrentId } from '../libs/constants';
import Notification from '../../common/components/NotificationPopup';
import ButtonDeleteItems from '../../common/components/ButtonDeleteItems';

export class MessageDetailForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isClickedEdit: false,
            important: false,
            messageContentList: this.props.defaultMessageContentList,
            isShowMessage: false,
            isSuccess: true,
            message: '',
            messageNotification: '',
            isInsert: this.props.selectedMessageId === messageInsertId
        }

        this.modalRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        const { selectedMessageId } = this.props;

        if (selectedMessageId !== prevProps.selectedMessageId) {

            this.setState({ isInsert: selectedMessageId === messageInsertId });

            selectedMessageId && this._handleGetMessageDetail(selectedMessageId);
        }
    }

    _handleGetMessageDetail = async (selectedMessageId) => {
        const item = await this.props.getMessageDetail(selectedMessageId);

        if (item) {
            const messageContentList = {};

            Object.keys(this.state.messageContentList).map(key => {
                messageContentList[key] = htmlDecode(item[key]);
            })

            this.setState({ messageContentList, important: item.Important });
        }
    }

    _handleChangeMessageContent = (event) => {
        const messageContentList = Object.assign({}, this.state.messageContentList, { [event.target.name]: event.target.value })
        this.setState({ messageContentList })
    }

    _handleFetchData = () => {
        this._handleClosePopup();
        this.props.fetchData(this.props.param);
    }

    _handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ messageNotification: '' });

        !!confirmResult && this._save();
    }

    _validateMessageContent = () => {
        const result = {
            isValid: false,
            message: messages.PleaseEnter
        }
        const { messageContentList } = this.state;

        Object.keys(messageContentList).map(key => {
            if (messageContentList[key]) {
                result.isValid = true;
                result.message = '';
            }
        })

        return result;
    }

    _handleSave = () => {
        const validateMessageContent = this._validateMessageContent();

        if (validateMessageContent.isValid) {
            this.state.isClickedEdit ? this.setState({ messageNotification: messages.AreYouWant }) : this._save();
        } else {
            this._handleShowAlert(false, validateMessageContent.message);
        }
    }

    _save = async () => {
        const { messageContentList, important, isInsert } = this.state;
        const message = isInsert ? "Add Successfully!" : "Update Successfully!";
        const messageInfo = Object.assign({}, { ...messageContentList, important });
        const result = isInsert ? await this.props.insertMessage(messageInfo) : await this.props.updateMessage(messageInfo);

        if (result) {
            this._handleShowAlert(result.IsSuccessful, result.IsSuccessful ? message : result.Message);
        } else {
            this._handleShowAlert(false, isInsert ? "Add Failed!" : "Update Failed!");
        }
    }

    _handleShowAlert = (isSuccess, message) => {
        this.modalRef.current.scrollTo({ top: 0, behavior: "smooth" });

        this.setState({
            message,
            isSuccess,
            isShowMessage: true,
        }, () => window.setTimeout(() => this._hideMessage(isSuccess), 3000));
    }

    _hideMessage = (isSuccess) => {
        this.setState({
            isShowMessage: false,
            confirmResult: false
        });

        isSuccess && this._handleFetchData();
    }

    _handleClosePopup = () => {
        this.props.setSelectedMessageId(null);
        this.setState({ isClickedEdit: false, important: false, messageContentList: this.props.defaultMessageContentList });
    }

    render() {
        const { important, messageContentList, isClickedEdit, isSuccess, isShowMessage, message, messageNotification, isInsert } = this.state;
        const { selectedMessageId, languages } = this.props;
        const isShowPopup = selectedMessageId !== null;
        const isCurrentMessage = selectedMessageId === messageCurrentId;
        const title = isInsert ? popupTitle.Add : (isCurrentMessage ? popupTitle.Current : `${popupTitle.Detail} (ID=${selectedMessageId})`);
        const isDisabled = !isInsert && !isClickedEdit;

        return (
            <React.Fragment>
                <Modal isOpen={isShowPopup} size="lg" toggle={this._handleClosePopup} backdrop='static' innerRef={this.modalRef}>
                    <ModalHeader toggle={this._handleClosePopup}><span className="iconpopup"></span>{title}</ModalHeader>
                    <ModalBody>
                        <div className="modal-body-wrapper">
                            <div className="message-form-container">
                                <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                    <div dangerouslySetInnerHTML={{ __html: message }}></div>
                                </Alert>
                                <Form tag="form" className="mb-2 p-1 border" autoComplete="off">
                                    <FormGroup row className="mb-2">
                                        <Label htmlFor="important" sm={2} className="text-right">{resource.Important}</Label>
                                        <Col sm={10}>
                                            <Input name="important" id="important" type="checkbox" className="important-checkbox" checked={important} disabled={isDisabled} onChange={() => this.setState({ important: !important })} />
                                        </Col>
                                    </FormGroup>
                                    {
                                        Object.keys(messageContentList).map(key => {
                                            return key === 'MessageId' ? null : (
                                                <FormGroup row className="mb-2" key={key}>
                                                    <Label for={key} sm={2} className="d-flex justify-content-end align-items-center text-right">{languages[key]}</Label>
                                                    <Col sm={10}>
                                                        <Input type="textarea" name={key} id={key} rows="4"
                                                            value={messageContentList[key]} onChange={this._handleChangeMessageContent} disabled={isDisabled} />
                                                    </Col>
                                                </FormGroup>
                                            )
                                        })
                                    }
                                </Form>
                                {
                                    isInsert ? (<Button type="button" color="success" onClick={this._handleSave}>{resource.Add}</Button>)
                                        : (
                                            <React.Fragment>
                                                {
                                                    isClickedEdit ? <Button type="button" color="success" className="mr-2" onClick={this._handleSave}>{resource.Update}</Button>
                                                        : <Button type="button" color="success" className="mr-2" onClick={() => this.setState({ isClickedEdit: true })}>{resource.Edit}</Button>
                                                }
                                                <ButtonDeleteItems
                                                    checkedItems={{ [messageContentList.MessageId]: true }}
                                                    toggleLoader={this.props.toggleLoader}
                                                    deleteItems={this.props.deleteMessages}
                                                    fetchData={() => this._handleShowAlert(true, "Delete Successfully!")}
                                                    messages={messages}
                                                />
                                            </React.Fragment>
                                        )
                                }
                                <Button type="button" color="info" className="ml-2" onClick={this._handleClosePopup}>{resource.Cancel}</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                {
                    !!messageNotification && (<Notification
                        message={messageNotification}
                        isConfirmPopup={true}
                        onClose={this._handleCloseNotificationPopup}
                    />)
                }
            </React.Fragment>
        );
    }
}

function mapStateToProps({ selectedMessageId, param, defaultMessageContentList, languages }) {
    return Object.assign({}, { selectedMessageId, param, defaultMessageContentList, languages });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedMessageId, getMessageDetail, fetchData, insertMessage, updateMessage, toggleLoader, deleteMessages }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(MessageDetailForm));