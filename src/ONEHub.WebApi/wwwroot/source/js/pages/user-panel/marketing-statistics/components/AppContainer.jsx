import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../../layouts/AppLayout';
import UserPanelSubMenu from '../../../common/components/UserPanelSubMenu';
import { setSelectedUserPanel } from '../actions';
import Filter from './Filter';
import Content from './Content';

export const AppContainer = (props) => {
    const subMenuList = [
        { isActive: false, handleClick: () => props.setSelectedUserPanel('clickStatistics'), title: 'Referrers' },
        { isActive: false, handleClick: () => props.setSelectedUserPanel('landingPageStatistics'), title: 'Landing Pages' },
        { isActive: true, handleClick: () => props.setSelectedUserPanel('marketingStatistics'), title: 'Channels' }
    ];

    return (
        <AppLayout>
            <UserPanelSubMenu subMenuList={subMenuList} />
            <Filter />
            <Content />
        </AppLayout>
    );
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedUserPanel }, dispatch);
}

export default connect(() => ({}), mapDispatchToProps)(React.memo(AppContainer));