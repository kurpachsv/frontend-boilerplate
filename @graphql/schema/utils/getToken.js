import {HEADER, COOKIE} from 'packages/enum';

/**
 * Returns the REST API token.
 * Cookies can be disabled in client browser.
 */
export default (req) => {
    const token = req.get(HEADER.authorization) || '';
    return req.cookies[COOKIE.token] || token;
};
