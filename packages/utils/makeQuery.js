import _ from 'lodash/fp';

/**
 * Joins keys and values in to query string, i.e:
 * {page: 1, filter: '', size: 2} becomes 'page=1&size=2'
 *
 * @param {Object}
 */
export default _.compose(
    _.join('&'),
    _.map(([k, v]) => `${k}=${encodeURIComponent(v)}`),
    _.reject(pair => _.isUndefined(pair[1])),
    _.toPairs
);
