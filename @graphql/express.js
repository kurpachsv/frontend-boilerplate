const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const graphqlHTTP = require('express-graphql');
const {HEADER, COOKIE} = require('packages/enum');
const schema = require('./schema/schema').default;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const csrfProtetction = csurf({
    cookie: {
        key: COOKIE.csrf,
        sameSite: true,
    },
    value: (req) => req.headers[HEADER.csrf],
});

const graphqlServer = graphqlHTTP((req, res) => ({
    schema,
    context: {req, res},
    graphiql: !__PRODUCTION__,
}));

// Request from microservices
app.use('/fromProtectedNetwork', graphqlServer);

if (__PRODUCTION__) {
    app.use('*', csrfProtetction, graphqlServer);
} else {
    app.use('*', graphqlServer); // to allow graph*i*Ql work
}

module.exports = app;
