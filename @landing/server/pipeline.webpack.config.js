const path = require('path');
const serverConfig = require('../../config/pipeline.server.webpack.config');

let config = serverConfig({
    serverName: 'landing',
    entry: [path.resolve(__dirname, './index.js')],
});

module.exports = config;
