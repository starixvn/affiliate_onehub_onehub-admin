import React from 'react';
import { useSelector } from 'react-redux';

import FilterForm from './FilterForm';

import AppLayout from '@/layouts/AppLayout';
import Loader from '@/components/Loader';

const AppContainer = () => {
    const [isShowLoader] = useSelector(state => [state.isShowLoader]);

    return (
        <AppLayout>
            <Loader show={isShowLoader} />
            <FilterForm />
        </AppLayout>
    );
}

export default AppContainer;