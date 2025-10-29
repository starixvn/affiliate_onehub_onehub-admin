import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import AppLayout from "../../../layouts/AppLayout";
import AssignDeal from './AssignDeal';

export default class App extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppLayout>
                <AssignDeal />
            </AppLayout>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));