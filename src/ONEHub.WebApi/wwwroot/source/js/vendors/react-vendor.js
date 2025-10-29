import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

window.React = React;
window.ReactDOM = ReactDOM;
window.ReduxProvider = Provider;
window.ReduxCreateStore = createStore;
window.ReduxApplyMiddleware = applyMiddleware;
window.ReduxThunk = thunk;

export default {
    React,
    ReactDOM,
    Provider,
    createStore,
    applyMiddleware,
    thunk
};

