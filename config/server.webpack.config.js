// Default server config
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

const __PRODUCTION__ = process.env.NODE_ENV === 'production';
const __DEVELOPMENT__ = !process.env.NODE_ENV || !__PRODUCTION__;
const __INSPECT__ = process.env.NODE_ENV === 'inspect';
const __USE_MOCKS__ = process.env.USE_MOCKS === 'true';
const webpackMode = __PRODUCTION__ ? 'production' : 'development';
process.traceDeprecation = false; // https://github.com/webpack/loader-utils/issues/56

const baseDir = path.resolve(__dirname, '..');
const buildDir = path.resolve(__dirname, '../build/server');

const devTool = __PRODUCTION__ ? false : 'devtool';

/**
 * @param {string} serverName
 * @param {Array} entry
 * @return {Object}
 */
module.exports = ({serverName, entry, outputPath = buildDir}) => {
    let config = {
        mode: webpackMode,
        devtool: devTool,
        context: baseDir,
        target: 'node',
        entry: {
            [serverName]: entry,
        },
        output: {
            path: outputPath,
            filename: '[name].js',
        },
        externals: [nodeExternals({
            whitelist: [
                'webpack/hot/poll?1000',
                /^semantic-ui-react\/src/,
            ],
        })],
        module: {
            rules: [{
                test: /\.jsx?$/,
                loader: 'babel-loader?cacheDirectory=true',
            }, {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            }, {
                test: /\.less/,
                use: [{
                    loader: 'css-loader/locals',
                    options: {
                        module: true,
                        localIdentName: __PRODUCTION__ ? '[hash:base64:5]' : '[name]__[local]--[hash:base64:5]',
                    },
                }, {
                    loader: 'less-loader',
                    options: {
                        plugins: [new LessPluginAutoPrefix({
                            browsers: [
                                'last 2 versions',
                                'iOS >= 8',
                                'Safari >= 8',
                            ]}
                        )],
                    },
                }],
            }, {
                test: /\.css$/,
                loader: 'null-loader',
            }, {
                test: /sprite\.svg$/,
                loader: 'svg-sprite-loader',
            }, {
                test: /(\.png|\.jpg|\.jpeg|\.gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        publicPath: '/assets/img/',
                        outputPath: 'img/',
                        name: '[name].[ext]',
                        emitFile: false,
                    },
                }],
            }],
        },
        resolve: {
            extensions: ['.js', '.json', '.scss'],
            alias: {
                '@graphql': path.resolve(baseDir, '@graphql'),
                '@landing': path.resolve(baseDir, '@landing'),
                '@admin': path.resolve(baseDir, '@admin'),
                config: path.resolve(baseDir, 'config'),
                packages: path.resolve(baseDir, 'packages'),
            },
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    BUILD_TARGET: JSON.stringify('server'),
                },
                BUILD_DIR: JSON.stringify(path.join(baseDir, 'build')), // for inline assets
                __DEVELOPMENT__: JSON.stringify(__DEVELOPMENT__),
                __PRODUCTION__: JSON.stringify(__PRODUCTION__),
                __USE_MOCKS__: JSON.stringify(__USE_MOCKS__),
                __NODE__: 'true',
                __BROWSER__: 'false',
            }),
            new webpack.BannerPlugin({
                banner: '\nglobal.fetch=require(\'node-fetch\');',
                raw: true,
            }),
        ],
    };

    // HMR
    if (__DEVELOPMENT__ || __INSPECT__) {
        config.watch = true;
        config.entry[serverName] = [
            'webpack/hot/poll?1000',
            ...config.entry[serverName],
        ];
        config.plugins = [
            new webpack.HotModuleReplacementPlugin(),
            new StartServerPlugin(`${serverName}.js`),
            ...config.plugins,
        ];
    }

    // Source map
    if (__INSPECT__) {
        config.devtool = 'inline-source-map';
        config.plugins = [
            new webpack.BannerPlugin({
                banner: '\nrequire("source-map-support").install();',
                raw: true,
            }),
            ...config.plugins,
        ];
    }

    if (__PRODUCTION__) {
        config.watch = false;
        config.entry[serverName] = [
            ...config.entry[serverName],
        ];
        config.plugins = [
            new StartServerPlugin(`${serverName}.js`),
            ...config.plugins,
        ];
    }

    return config;
};
