import React from 'react';

import AppLayout from '../../../../layouts/AppLayout';
import Filter from './Filter';
import Content from './Content';

const AppContainer = (props) => {
    return (
        <AppLayout>
            <Filter />
            <Content />
        </AppLayout>
    );
}

export default React.memo(AppContainer);