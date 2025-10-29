import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '../../modules/store';

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        const { languageList, today } = window.initialState;

        const defaultMessageContentList = {
            MessageId: 0
        };
        const languages = {};

        for (let languageItem of languageList) {
            const key = 'Message_' + languageItem.ShortedLanguageCode;
            defaultMessageContentList[key] = '';
            languages[key] = languageItem.LanguageName;
        }

        this.store = configureStore({ today, defaultMessageContentList, languages }, reducer);
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