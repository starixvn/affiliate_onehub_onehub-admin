import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import { configureStore } from '../../../modules/store';
import reducers from './reducers';
import { convertListToMutilpleSelected } from '../../../modules/utils';

const { deals } = window.initialState;
const newDeals = convertListToMutilpleSelected(deals, 'GroupId', 'GroupName');

const store = configureStore({
    ...window.initialState,
    deals: newDeals
}, reducers);

export const App = () => {
    return <Provider store={store}>
        <AppContainer />
    </Provider>;
};

export default App;