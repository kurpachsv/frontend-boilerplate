require('regenerator-runtime/runtime');
const http = require('http');
const app = require('./express');

const server = http.createServer(app);
let currentApp = app;

server.listen(3095);

if (!__PRODUCTION__) {
    if (module.hot) {
        module.hot.accept('./express', () => {
            const app = require('./express'); // eslint-disable-line
            server.removeListener('request', currentApp);
            server.on('request', app);
            currentApp = app;
        });
    }
}
