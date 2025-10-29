import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../layouts/AppLayout';
import Filter from './Filter';
import Content from './Content';
import ChangePasswordForm from '../../common/components/ChangePasswordForm';
import Loader from '../../../components/Loader';

import { setShowPopupPassword, setShowPopupCommGroup } from '../actions'

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { isShowLoader, showPopupPassword, affId, commGroup, showPopupCommGroup } = this.props;
        return (
            <AppLayout>
                <Loader show={isShowLoader} />
                <Filter />
                <Content />
                <ChangePasswordForm
                    showPopupPassword={showPopupPassword}
                    selectedId={affId}
                    setShowPopupPassword={this.props.setShowPopupPassword}
                />
            </AppLayout>
        );
    }
}

function mapStateToProps({ isShowLoader, showPopupPassword, affId, commGroup, showPopupCommGroup }) {
    return Object.assign({}, { isShowLoader, showPopupPassword, affId, commGroup, showPopupCommGroup });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setShowPopupPassword, setShowPopupCommGroup }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);