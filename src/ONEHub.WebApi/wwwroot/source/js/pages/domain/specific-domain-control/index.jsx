import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '../../../modules/store';

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.store = configureStore({ }, reducer);
    }

    render() {
        return (
            <Provider store={this.store}>
                <AppContainer />
            </ Provider>
        );
    }
}