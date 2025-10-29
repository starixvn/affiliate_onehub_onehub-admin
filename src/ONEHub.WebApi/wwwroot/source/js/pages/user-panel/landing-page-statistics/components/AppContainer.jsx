import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../../layouts/AppLayout';
import Filter from './Filter';
import Content from './Content';
import Detail from './Detail';
import UserPanelSubMenu from '../../../common/components/UserPanelSubMenu';

import { setSelectedUserPanel } from '../actions';

export class AppContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.subMenuList = [
            { isActive: false, handleClick: () => this.props.setSelectedUserPanel('clickStatistics'), title: 'Referrers' },
            { isActive: true, handleClick: () => this.props.setSelectedUserPanel('landingPageStatistics'), title: 'Landing Pages' },
            { isActive: false, handleClick: () => this.props.setSelectedUserPanel('marketingStatistics'), title: 'Channels' }
        ];
    }

    render() {
        return (
            <AppLayout>
                <UserPanelSubMenu subMenuList={this.subMenuList} />
                <Filter />
                <Content />
                <Detail />
            </AppLayout>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedUserPanel }, dispatch);
}

export default connect(() => ({}), mapDispatchToProps)(AppContainer);