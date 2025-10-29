import React from 'react';
import AppContainer from './components/AppContainer';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { configureStore } from '@/modules/store';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

const App = () => {
    const store = configureStore({}, reducer);

    return (
        <Provider store={store}>
            <AppContainer />
            <ToastContainer className="asset-modification-toast-container" />
        </Provider>
    );
};

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
