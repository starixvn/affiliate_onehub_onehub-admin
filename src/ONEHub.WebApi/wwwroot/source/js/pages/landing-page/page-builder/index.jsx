import React, { useState, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '../../../modules/store';
import { convertListToMutilpleSelected } from '../../../modules/utils';
import { initializeFromPageBuilderDetail, initializeDefaultValues } from './actions';
import ClaimPrincipal from '../../../modules/claim';

const App = () => {
    const [isReady, setIsReady] = useState(false);
    const storeRef = useRef(null);

    useEffect(() => {
        const initStore = async () => {
            // Load filters if not already loaded
            if (!window.initialState?.filtersLoaded) {
                await window.pageInitializer.initLandingPage();
            }

            const { 
                targetCountryList = [], 
                allLanguagesInSystem = [], 
                dealList = [], 
                statusList = [], 
                moduleList = [], 
                bannerRootUrl = '',
                landingPageUrl = '',
                campaignList = [],
                pageBuilderDetail = null
            } = window.initialState || {};

            const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;

            // Convert lists to proper format for dropdowns
            const newDealList = convertListToMutilpleSelected(dealList, 'GroupId', 'GroupName');

            // Create Redux store
            storeRef.current = configureStore({
                moduleList,
                campaignList,
                targetCountryList,
                languageList: allLanguagesInSystem,
                dealList: newDealList,
                statusList: statusList.sort((a, b) => a.Status - b.Status),
                bannerRootUrl,
                landingPageUrl,
                pageBuilderDetail,
                deals: [],
                sources: {},
                claimsPrincipal
            }, reducer);

            // Initialize store after creation
            if (pageBuilderDetail) {
                storeRef.current.dispatch(initializeFromPageBuilderDetail(pageBuilderDetail));
            } else {
                storeRef.current.dispatch(initializeDefaultValues());
            }

            setIsReady(true);
        };

        initStore();
    }, []);

    if (!isReady) {
        return null;
    }

    return (
        <Provider store={storeRef.current}>
            <AppContainer />
        </Provider>
    );
};

export default App;