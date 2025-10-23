import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './components/AppContainer';

export default class App extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return <AppContainer {...window.initialState} />;
    }
}

ReactDOM.render(<App />, document.getElementById("root"));