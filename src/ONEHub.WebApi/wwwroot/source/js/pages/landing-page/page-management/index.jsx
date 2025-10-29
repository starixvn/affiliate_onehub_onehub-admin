import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '../../../modules/store';
import ClaimPrincipal from '../../../modules/claim';
import { claimResource } from '../../../modules/claim';

const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
const isModifyInPageManagement = claimsPrincipal.hasWriteClaim(claimResource.PageManagement);

const store = configureStore({
    targetCountryList: [],
    languageList: [],
    dealList: [],
    statusList: [],
    landingPageUrl: '',
    allLanguagesInSystem: [],
    campaignList: [],
    isModifyInPageManagement
}, reducer);

const App = () => {
    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
};

export default App;