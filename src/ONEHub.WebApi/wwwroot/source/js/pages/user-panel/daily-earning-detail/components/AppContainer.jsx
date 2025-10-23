import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppLayout from '../../../../layouts/AppLayout';
import UserPanelBreadcrumb from '../../../common/components/UserPanelBreadcrumb';
import Filter from './Filter';
import Content from './Content';

import { setSelectedUserPanel, redirectToDailyEarning, redirectToStatementHistory } from '../actions';
import { monthNames } from '../modules/constants';

export class AppContainer extends PureComponent {
    constructor(props) {
        super(props);

        const { param } = this.props;
        this.monthDate = param.monthDate;
        this.date = new Date(this.monthDate);

        const dailyEarningParam = Object.assign({}, param, { monthDate: this.monthDate });

        this.breadcrumbList = [
            { handleClick: () => this.props.redirectToStatementHistory(param.statementHistory), title: 'Statement History' },
            { handleClick: () => this.props.redirectToDailyEarning(dailyEarningParam), title: `${monthNames[this.date.getMonth()]} ${this.date.getFullYear()}` },
            { title: this.monthDate }
        ];
    }

    render() {
        const { productList, currencyList, baseCurrencyList } = this.props;

        return this.monthDate && (
            <AppLayout>
                <UserPanelBreadcrumb breadcrumbList={this.breadcrumbList} />
                <Filter productList={productList} currencyList={currencyList} baseCurrencyList={baseCurrencyList} />
                <Content />
            </AppLayout>
        );
    }
}

function mapStateToProps({ dailyEarningDetail, productList, currencyList, baseCurrencyList }) {
    const { param } = dailyEarningDetail;
    return Object.assign({}, { param, productList, currencyList, baseCurrencyList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedUserPanel, redirectToDailyEarning, redirectToStatementHistory }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);