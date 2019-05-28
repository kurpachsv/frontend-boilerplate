const React = require('react');
const {Cookies} = require('react-cookie');

const {addLocaleData} = require('react-intl');
const {IntlProvider} = require('react-intl-redux');
const deLocaleData = require('react-intl/locale-data/de');
const enLocaleData = require('react-intl/locale-data/en');

const {Provider} = require('react-redux');
const {StaticRouter} = require('react-router');
const {matchRoutes} = require('react-router-config');
const {ApolloProvider, renderToStringWithData} = require('react-apollo');

const {intlSelector} = require('packages/intl/redux');
const {createStore} = require('packages/redux');

const {ServerStyleSheet, StyleSheetManager} = require('styled-components');

const {createApolloClient} = require('packages/apollo-client/createApolloClient');

const {
    headStatic,
    headMeta,
    body,
    renderError,
} = require('./templates');

// react-intl global initialization
addLocaleData([
    ...deLocaleData,
    ...enLocaleData,
]);

module.exports = async ({req, res, routes, rootReducer, initialState, Layout, type}) => {
    const match = matchRoutes(routes, req.path);
    const status = match.length ? 200 : 404;

    // Immediate send status and static head
    res.status(status);
    res.write('<!DOCTYPE html>\n<html>');


    const sheet = new ServerStyleSheet();



    // Create Apollo client
    const apollo = createApolloClient({
        cookies: new Cookies(req.cookies),
    });

    // Create app store combined with Apollo store
    const store = createStore({apollo, rootReducer, initialState});

    const app = (
        <ApolloProvider client={apollo}>
            <Provider store={store}>
                <IntlProvider intlSelector={intlSelector}>
                    <StaticRouter location={req.url} context={{}}>
                        <StyleSheetManager sheet={sheet.instance}>
                            <Layout store={store}/>
                        </StyleSheetManager>
                    </StaticRouter>
                </IntlProvider>
            </Provider>
        </ApolloProvider>
    );

    // Try render app and catch network errors from react-apollo networkInterface.
    // If en error occurred the page without app content will be returned.
    // Then rendering will be happy on client.
    let content;
    try {
        content = await renderToStringWithData(app);
    } catch (err) {
        // TODO log error
        content = renderError(err);
    }

    const styleTags = sheet.getStyleTags();

    res.write(headStatic({type, styleTags}));

    res.write(headMeta({
        title: 'Frontend Boilerplate',
        description: 'MTD Frontend Boilerplate',
    }));

    res.write(body({
        content,
        initialState: store.getState()
            .toJS(),
        apolloState: apollo.cache.extract(),
        csrfToken: req.csrfToken(),
        type,
    }));
    res.write('</html>');
    res.end();
};
