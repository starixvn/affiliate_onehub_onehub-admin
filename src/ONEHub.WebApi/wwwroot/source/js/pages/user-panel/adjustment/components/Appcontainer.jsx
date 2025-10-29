import React from 'react';

import AppLayout from '../../../../layouts/AppLayout';
import Content from './Content';

const AppContainer = (props) => {
    return (
        <AppLayout>
            <Content />
        </AppLayout>
    );
}

export default React.memo(AppContainer);