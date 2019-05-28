const path = require('path');
const themeConfig = require('../../config/theme.webpack.config');

module.exports = themeConfig({
    themeName: 'theme-ab',
    entry: [path.resolve(__dirname, 'semantic/dist/semantic.css')],
    removeJsBundle: true,
    resourcesDir: path.join(__dirname, 'resources'),
});

