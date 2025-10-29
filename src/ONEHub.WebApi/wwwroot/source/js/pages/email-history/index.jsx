import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import reducer from './reducers';
import AppContainer from './components/AppContainer';
import { configureStore } from '../../modules/store';
import ClaimPrincipal from '../../modules/claim';

export default class App extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const storeState = Object.assign({}, window.initialState, { claimsPrincipal: ClaimPrincipal.currentClaimPrincipal });
        const store = configureStore(storeState, reducer);
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'))