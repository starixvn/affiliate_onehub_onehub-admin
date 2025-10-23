import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../../layouts/AppLayout';
import UserPanelBreadcrumb from '../../../common/components/UserPanelBreadcrumb';
import Filter from './Filter';
import Content from './Content';

import { monthNames, userPanelMenuKey } from '../libs/constants';
import { setSelectedUserPanel, redirectToStatementHistory } from '../actions';

export class AppContainer extends PureComponent {
    constructor(props) {
        super(props);

        const { param } = this.props;
        this.monthDate = param.monthDate;

        const date = new Date(this.monthDate);
        this.breadcrumbList = [
            { handleClick: () => this.props.redirectToStatementHistory(param.statementHistory), title: 'Statement History' },
            { title: `${monthNames[date.getMonth()]} ${date.getFullYear()}` }
        ];
    }

    render() {
        return this.monthDate && (
            <AppLayout>
                <UserPanelBreadcrumb breadcrumbList={this.breadcrumbList} />
                <Filter baseCurrencyList={this.props.baseCurrencyList} />
                <Content />
            </AppLayout>
        );
    }
}

function mapStateToProps({ subAffiliate, baseCurrencyList }) {
    const { param } = subAffiliate;
    return Object.assign({}, { param, baseCurrencyList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedUserPanel, redirectToStatementHistory }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);