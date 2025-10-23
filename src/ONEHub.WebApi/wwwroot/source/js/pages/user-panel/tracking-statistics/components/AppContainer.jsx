import React from 'react';

import AppLayout from '../../../../layouts/AppLayout';
import Filter from './Filter';
import Content from './Content';
import Detail from './Detail';

const AppContainer = (props) => {
    return (
        <AppLayout>
            <Filter />
            <Content />
            <Detail />
        </AppLayout>
    );
}

export default React.memo(AppContainer);