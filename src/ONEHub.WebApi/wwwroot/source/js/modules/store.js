import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";

const middlewares = [];
middlewares.push(thunkMiddleware);
if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger');

    middlewares.push(logger);
}

export const configureStore = (initialState, reducer) => {
    const enhancer = compose(
        applyMiddleware(...middlewares)
    );

    return createStore(reducer, initialState, enhancer);
}