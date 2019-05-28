const {SERVICE} = require('../enum');

/* eslint-disable global-require */
const messages = {
    common: {
        de: require('./messages/common/messages.de'),
        en: require('./messages/common/messages.en'),
    },
    [SERVICE.landing]: {
        de: require('./messages/landing/messages.de'),
        en: require('./messages/landing/messages.en'),
    },
    [SERVICE.admin]: {
        de: require('./messages/admin/messages.de'),
        en: require('./messages/admin/messages.en'),
    },
};
const defaultLocale = 'en';
const defaultType = SERVICE.landing;

/**
 * Returns translated messages for locale and type
 * @param {string} locale One of 'en', 'de'.
 * @param {string} type One of 'landing', 'admin'
 * @return {{locale: string, messages: {}}}
 */
function getMessages({locale = defaultLocale, type = defaultType}) {
    type = type in messages ? type : defaultType;
    locale = locale in messages[type] ? locale : defaultLocale;

    return {
        locale,
        type,
        messages: {
            // ...messages.common[locale],
            // ...messages[type][locale],
            ...messages.common[defaultLocale],
            ...messages[type][defaultLocale],
        },
    };
}


/**
 * Returns messages for Legal documents/
 * @param locale
 * @return {*}
 */
function getLegalMessages({locale = defaultLocale}) {
    return {
        messages: messages.legal[locale],
    };
}

module.exports = {
    defaultLocale,
    getMessages,
    getLegalMessages,
};
