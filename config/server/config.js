const baseDomain = 'movetodigital.dev';

module.exports = {
    strictCSP: {
        appDomain: `${baseDomain} 'self'`,
        apiDomain: `${baseDomain} 'self'`,
    },
};
