export const SERVICE = {
    landing: 'landing',
    admin: 'admin',
};

export const mobileBreakpoint = {
    thin: 768,
    veryThin: 414,  // iPhone 6 Plus vertical
};

export const COOKIE = {
    token: 't',
    locale: 'l',
    csrf: 'r',
};

export const HEADER = {
    authorization: 'Authorization',
    csrf: 'x-csrf-token',
    userAgent: 'user-agent',
    forwarded: 'x-forwarded-for',
};

export const PERIOD = {
    oneYear: 31536e3,
    neverExpires: new Date(2147483647000),
};

export const ROLE = {
    client: 'CLIENT',
    admin: 'ADMIN',
};

export const URLS = {
    root: '/',
};
