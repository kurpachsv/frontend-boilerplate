import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';
import {createHttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client';
import {concat} from 'apollo-link';
import isBrowser from 'packages/utils/isBrowser';
import {COOKIE, HEADER} from 'packages/enum';

/**
 * Create Apollo client for server and client usage.
 * @param {Cookies} cookies Instance of Cookies from react-cookie.
 * @param {Map} [apolloState] Used on client to hydrate Apollo state.
 * @return {ApolloClient}
 */
export const createApolloClient = ({cookies, apolloState}) => {
    let csrfToken = '';
    let uri;

    if (__BROWSER__) {
        csrfToken = window.__CSRF_TOKEN__;
        uri = `${window.location.origin}/graphql/`;
    }
    if (__NODE__) {
        uri = __PRODUCTION__ ?
            'http://mtd-graphql:3095/fromProtectedNetwork' :
            'http://0.0.0.0:3095/fromProtectedNetwork';
    }

    // Add api auth token and csrf token to request
    const authLink = cookies.get(COOKIE.token)
        ? setContext(() => ({
            headers: {
                [HEADER.authorization]: cookies.get(COOKIE.token),
                [HEADER.csrf]: csrfToken,
            },
        }))
        : setContext(() => ({
            headers: {
                [HEADER.csrf]: csrfToken,
            },
        }));
    const httpLink = createHttpLink({uri, credentials: 'same-origin'});
    const cache = new InMemoryCache();
    return new ApolloClient({
        link: concat(authLink, httpLink),
        cache: cache.restore(apolloState),
        ssrMode: !isBrowser,
    });
};
