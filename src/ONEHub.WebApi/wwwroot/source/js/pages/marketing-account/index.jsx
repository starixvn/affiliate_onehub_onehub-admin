import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from '../../modules/store';
import reducer from './reducers';
import AppContainer from './components/AppContainer';
import { convertArrayToObjectProps } from '../../modules/utils';
import ClaimPrincipal, { claimResource } from '../../modules/claim';

const App = () => {
    const { languageList, targetCountryList, dealList, marketingSpecificAffId, marketingSpecificAffName } = window.initialState;
    const languageCodeList = convertArrayToObjectProps(languageList, 'LanguageCode', 'LanguageName');
    const targetCountryCodeList = convertArrayToObjectProps(targetCountryList, 'TargetCountryCode', 'TargetCountryName');
    const dealOptionsList = convertArrayToObjectProps(dealList, 'GroupId', 'GroupName');
    const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
    const canAddAffMktAccount = claimsPrincipal.hasWriteClaim(claimResource.CreateMarketingAccount);
    const defaultMktAffInfo = {
        affId: marketingSpecificAffId,
        affName: marketingSpecificAffName
    };

    const store = configureStore({
        languageCodeList,
        targetCountryCodeList,
        dealOptionsList,
        defaultMktAffInfo,
        canAddAffMktAccount
    }, reducer);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
};

export default App;

ReactDOM.render(<App />, document.getElementById("root"))