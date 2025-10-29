import React from "react";
import { Provider } from "react-redux";

import reducer from './reducers';
import { configureStore } from '../../../modules/store';
import AppContainer from "./components/AppContainer";
import { convertListToMutilpleSelected } from '../../../modules/utils';

const App = () => {
    const { deals } = window.initialState;
    const newDeals = convertListToMutilpleSelected(deals, 'GroupId', 'GroupName');

    const store = configureStore({
        ...window.initialState,
        deals: newDeals
    }, reducer);
    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
}

export default App;