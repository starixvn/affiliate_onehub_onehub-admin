import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '../../../modules/store';
import ClaimPrincipal, { claimResource } from '../../../modules/claim';

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
        const isModifiable = claimsPrincipal.hasWriteClaim(claimResource.Player);
        const storeState = Object.assign({}, window.initialState, { isModifiable });
        this.store = configureStore(storeState, reducer);
    }

    render() {
        return (
            <Provider store={this.store}>
                <AppContainer />
            </ Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));