import React from 'react';
import { Provider } from 'react-redux';

import reducer from './reducers';
import AppContainer from './components/AppContainer';
import { configureStore } from '../../../modules/store';
import ClaimPrincipal, { claimResource } from '../../../modules/claim';

const App = () => {
    const { dealTypes, targetCountries, products, deductions, defaultCurrency, paymentFrequencies, today } = window.initialState;
    const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
    const isModifiable = claimsPrincipal.hasWriteClaim(claimResource.Deal);
    const store = configureStore({
        claimsPrincipal,
        dealTypeList: dealTypes,
        targetCountryList: targetCountries,
        productList: products,
        deductionList: deductions,
        isModifiable,
        defaultCurrency,
        paymentFrequencyList: paymentFrequencies,
        today
    }, reducer);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
}

export default App;