import {createBrowserHistory} from 'history';
import React from 'react';
import {hydrate} from 'react-dom';
import {Cookies} from 'react-cookie';

import {addLocaleData} from 'react-intl';
import {IntlProvider} from 'react-intl-redux';
import deLocaleData from 'react-intl/locale-data/de';
import enLocaleData from 'react-intl/locale-data/en';

import {Provider} from 'react-redux';
import {ApolloProvider} from 'react-apollo';
import {ConnectedRouter} from 'react-router-redux';
import {AppContainer} from 'react-hot-loader';

import {SERVICE} from 'packages/enum';
import {intlSelector} from 'packages/intl/redux';
import {createApolloClient} from 'packages/apollo-client/createApolloClient';
import {createStore} from 'packages/redux';
import shineHmr from 'packages/utils/shine';

import {initialState, apolloState} from 'packages/utils/hydrateInitialState';
import rootReducer from './redux/rootReducer';
import Layout from './components/Layout';

// Set react-intl locales
addLocaleData([
    ...deLocaleData,
    ...enLocaleData,
]);

const history = createBrowserHistory();

// Create app store combined with Apollo
const store = createStore({
    history,
    rootReducer,
    initialState,
    devToolName: SERVICE.landing,
});

// Create apollo client. Cookies are needed for authentication
const apollo = createApolloClient({
    cookies: new Cookies(),
    apolloState,
    dispatch: store.dispatch,
});

const render = () => {
    hydrate((
        <AppContainer>
            <ApolloProvider client={apollo}>
                <Provider store={store}>
                    <IntlProvider intlSelector={intlSelector}>
                        <ConnectedRouter history={history}>
                            <Layout/>
                        </ConnectedRouter>
                    </IntlProvider>
                </Provider>
            </ApolloProvider>
        </AppContainer>
    ), document.getElementById('app-root'));
};

render();

if (__DEVELOPMENT__) {
    if (module.hot) {
        module.hot.accept('./components/Layout', () => {
            render();
            shineHmr();
        });
        module.hot.accept('./redux/rootReducer', () => {
            store.replaceReducer(rootReducer);
            shineHmr();
        });
    }
}
