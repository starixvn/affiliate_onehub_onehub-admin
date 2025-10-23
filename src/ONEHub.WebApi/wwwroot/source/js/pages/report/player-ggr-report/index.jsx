import React from "react";
import { Provider } from "react-redux";

import reducer from './reducers';
import AppContainer from "./components/AppContainer";
import { configureStore } from '../../../modules/store';
import { convertListToMutilpleSelected } from '../../../modules/utils';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        const { productList } = window.initialState;

        const newProductList = convertListToMutilpleSelected(productList, 'ProductId', 'ProductName')

        this.store = configureStore({
            ...window.initialState,
            productList: newProductList
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