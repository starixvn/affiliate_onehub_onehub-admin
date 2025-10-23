import React, { Fragment } from 'react';
import Content from './Content';
import ModificationForm from './ModificationForm';

export const AppContainer = () => {

    return (
        <Fragment>
            <Content />
            <ModificationForm />
        </Fragment>
    );
}

export default React.memo(AppContainer);