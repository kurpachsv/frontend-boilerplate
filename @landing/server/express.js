/* eslint-disable no-console */
const csurf = require('csurf');
const express = require('express');
const cookieParser = require('cookie-parser');
const MobileDetect = require('mobile-detect');

const {
    COOKIE,
    SERVICE,
} = require('packages/enum');

const renderer = require('packages/ssr-renderer');
const {defaultLocale, getMessages} = require('packages/intl');

const routes = require('../routes').default;
const rootReducer = require('../redux/rootReducer').default;
const Layout = require('../components/Layout').default;

const app = express();

app.use(cookieParser());
app.use(csurf({
    cookie: {
        key: COOKIE.csrf,
        sameSite: true,
    },
}));

app.get('*', async (req, res) => {
    const md = new MobileDetect(req.headers['user-agent']);
    let cookieLocale = req.cookies[COOKIE.locale];
    // set locale according to ip address

    const initialState = {
        intl: {
            defaultLocale,
            ...getMessages({locale: cookieLocale, type: SERVICE.landing}),
        },
        userAgent: {
            isMobile: !!md.mobile(),
            isBot: md.is('bot') || 'isBot' in req.query,
        },
    };
    await renderer({
        req,
        res,
        Layout,
        routes,
        rootReducer,
        initialState,
        type: SERVICE.landing,
    });
});

module.exports = app;
