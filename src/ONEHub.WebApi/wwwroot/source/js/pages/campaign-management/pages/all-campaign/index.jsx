import React from 'react';
import AppContainer from './components/AppContainer';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { configureStore } from '@/modules/store';


const AllCampaigns = () => {
    const store = configureStore({}, reducer);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
};

export default AllCampaigns;
