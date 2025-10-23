import React from "react";
import { Provider } from "react-redux";

import reducer from './reducers';
import AppContainer from "./components/AppContainer";
import { configureStore } from '../../../modules/store';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.store = configureStore({
            ...window.initialState,
        }, reducer);
    }

    render() {
        return (
            <Provider store={this.store}>
                <AppContainer />
            </Provider>
        );
    }
}