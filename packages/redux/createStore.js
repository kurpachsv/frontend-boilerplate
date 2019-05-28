// @flow
import {fromJS} from 'immutable';
import {createStore, applyMiddleware, compose} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

import {timeTravelMiddleware, timeTravelStoreListener} from './timeTravelMiddleware';

type CreateStoreArgs = {
    rootReducer: Function,
    initialState: Object,
    apollo: Object,
    middleware?: Array<Function>,
    history?: {},
    devToolName?: string,
}
/**
 * Создает store.
 * Поддерживает Redux DevTool и Time Traveling (в будущем поддержку добавят в react-router-redux).
 */
export default ({
    history,
    rootReducer,
    initialState,
    middleware = [],
    devToolName,
}: CreateStoreArgs) => {
    let composeEnhancers = compose;

    middleware = [
        promiseMiddleware,
        thunkMiddleware,
        ...middleware,
    ];

    if (__BROWSER__) {
        if (history) {
            // Связь с history позволяет использовать routerActions: push, replace, go, goBack, goForward.
            middleware.push(routerMiddleware(history));
        }
        if (__DEVELOPMENT__) {
            if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
                composeEnhancers = devToolName ?
                    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({name: devToolName}) :
                    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
                middleware.push(timeTravelMiddleware);
            }
        }
    }

    const store = createStore(
        rootReducer,
        fromJS(initialState),
        composeEnhancers(applyMiddleware(...middleware))
    );

    if (__BROWSER__ && __DEVELOPMENT__) {
        if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && history) {
            store.subscribe(timeTravelStoreListener(store, history));
        }
    }

    return store;
};
