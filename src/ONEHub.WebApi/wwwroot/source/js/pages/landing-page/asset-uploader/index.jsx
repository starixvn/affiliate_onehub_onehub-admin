import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '../../../modules/store';

import ClaimPrincipal from '../../../modules/claim';
import { claimResource } from '../../../modules/claim';

const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
const isModifyInAssetUploader = claimsPrincipal.hasWriteClaim(claimResource.AssetUploader);

const store = configureStore({
    moduleList: [],
    targetCountryList: [],
    languageList: [],
    allLanguagesInSystem: [],
    maxFileSize: 3,
    maximumFiles: 50,
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    bannerRootUrl: '',
    statusList: [],
    isModifyInAssetUploader
}, reducer);

const App = () => {
    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
};

export default App;