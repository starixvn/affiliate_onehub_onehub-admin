import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';

import { updateLanguage, getAffiliateInfo } from '../../actions';
import { messages } from '../../libs/constants';
import NotificationPopup from '../../../../common/components/NotificationPopup';

export class Language extends PureComponent {
    constructor(props) {
        super(props);

        this.languageDropdown = React.createRef();

        this.state = {
            isChangingLanguage: false,
            preferredLanguage: '',
            messageNotification: '',
            isConfirmPopup: true
        }
    }

    handleCloseNotificationPopup = (confirmResult) => {
        this.setState({ messageNotification: '' });

        const { preferredLanguage } = this.state;
        if (confirmResult && preferredLanguage) {
            this._changeLanguage(preferredLanguage);
        }
    }

    _handleChangeLanguage = (event) => {
        this.setState({ messageNotification: messages.areYouChangeLanguage, isConfirmPopup: true, preferredLanguage: event.target.value });
    }

    _changeLanguage = async (preferredLanguage) => {
        const param = Object.assign({}, { AffId: this.props.affiliateInfo.AffId, PreferredLanguage: preferredLanguage });
        const result = await this.props.updateLanguage(param);

        if (result.IsSuccessful) {
            this.setState({ messageNotification: messages.languageUpdatedSuccess, isConfirmPopup: false });
            this.props.getAffiliateInfo(this.props.affName);
        }
        else {
            this.setState({ messageNotification: result.Message, isConfirmPopup: false });
        }
    }

    toggleChangingLanguage = (isChanging) => {
        this.setState({ isChangingLanguage: isChanging }, () => isChanging && this.languageDropdown.current.focus());
    }

    _renderLanguageList() {
        const { affiliateInfo, languageList } = this.props;

        return (
            <select value={affiliateInfo.PreferredLanguage}
                onChange={this._handleChangeLanguage} onBlur={() => this.toggleChangingLanguage(false)} ref={this.languageDropdown}>
                {
                    Object.keys(languageList).map(key => {
                        return (<option value={key} key={`affinfo-lang-${key}`}>{languageList[key]}</option>)
                    })
                }
            </select>
        )
    }

    _renderLanguageLabel() {
        const { affiliateInfo, languageList } = this.props;
        const languageName = languageList[affiliateInfo.PreferredLanguage];

        return (
            <Button color="link" className="left-panel-btn-link" onClick={() => this.toggleChangingLanguage(true)}>
                {languageName}
            </Button>
        )
    }

    render() {
        const { isChangingLanguage, messageNotification, isConfirmPopup } = this.state;

        return (
            <React.Fragment>
                {
                    isChangingLanguage ? this._renderLanguageList() : this._renderLanguageLabel()
                }
                {
                    !!messageNotification && <NotificationPopup
                        message={messageNotification}
                        isConfirmPopup={isConfirmPopup}
                        onClose={this.handleCloseNotificationPopup}
                    />
                }
            </React.Fragment>
        )
    }
}

function mapStateToProps({ affCommonInfo, leftPanel, languageList }) {
    const { affiliateInfo } = leftPanel;
    const { affName } = affCommonInfo;
    return Object.assign({}, { affiliateInfo, languageList, affName });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAffiliateInfo, updateLanguage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Language);