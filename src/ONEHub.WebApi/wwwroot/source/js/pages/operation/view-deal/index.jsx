import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { post } from '../../../modules/ajaxRequest';

import ViewDealPopup from './ViewDealPopup';

import { configureStore } from '../../../modules/store';
import reducer from '../deal/reducers';

export default function ViewDealWrapper({ dealId, toggle, affName }) {
    const [store, setStore] = useState(null);

    useEffect(() => {
        const fetchDataAndCreateStore = async () => {
            const res = await post('Portal/Operation/GetDealCommonInfo');
            const data = res.data;

            const preloadedState = {
                dealTypeList: data.DealTypes,
                targetCountryList: data.TargetCountries,
                productList: data.Products,
                deductionList: data.Deductions,
                paymentFrequencyList: data.PaymentFrequencies
            };

            const storeInstance = configureStore(preloadedState, reducer);
            setStore(storeInstance);
        };

        fetchDataAndCreateStore();
    }, []);

    if (!store) return null;

    return (
        <Provider store={store}>
            <ViewDealPopup dealId={dealId} toggle={toggle} affName={affName} />
        </Provider>
    );
}
