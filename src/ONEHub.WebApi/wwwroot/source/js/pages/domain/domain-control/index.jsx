import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '../../../modules/store';

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        const { targetCountryList, affSubDomainList, dealList } = window.initialState;

        const newAffSubDomainList = affSubDomainList.map(item => {
            return {
                columnKey: item,
                columnName: item,
                checked: true
            }
        });

        this.store = configureStore({ targetCountryList, affSubDomainList: newAffSubDomainList, dealList }, reducer);
    }

    render() {
        return (
            <Provider store={this.store}>
                <AppContainer />
            </ Provider>
        );
    }
}