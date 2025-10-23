import React from 'react';
import { useSelector } from 'react-redux';

import Dashboard from './Dashboard';
import FilterForm from './FilterForm';
import TableGrid from './TableGrid';
import CampaignFormPopup from './CampaignFormPopup';

import Loader from '@/components/Loader';

const AppContainer = () => {
    const [isShowLoader] = useSelector(state => [state.isShowLoader]);

    return (
        <>
            <Loader show={isShowLoader} />
            <Dashboard />
            <FilterForm />
            <TableGrid />
            <CampaignFormPopup />
        </>
    );
}

export default AppContainer;