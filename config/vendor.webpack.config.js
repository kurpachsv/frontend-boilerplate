// Create library bundles
const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const __PRODUCTION__ = process.env.NODE_ENV === 'production';
const webpackMode = __PRODUCTION__ ? 'production' : 'development';
const baseDir = path.resolve(__dirname, '..');
const buildDir = path.resolve(baseDir, 'build');
const publicPath = '/assets/';

const devTool = __PRODUCTION__ ? false : 'devtool';

let config = {
    mode: webpackMode,
    devtool: devTool,
    context: baseDir,
    target: 'web',
    profile: !!process.env.PROFILE,
    entry: {
        vendor: [
            'classnames',
            'cuid',
            'es6-error',
            'hoist-non-react-statics',
            'immutable',
            'invariant',
            'mobile-detect',
            'prop-types',
            'query-string',
            'react-apollo',
            'react-cookie',
            'react-intl',
            'react-intl/locale-data/de',
            'react-intl/locale-data/en',
            'react-intl-redux',
            'react-redux',
            'react-router',
            'react-router-config',
            'react-router-dom',
            'react-router-redux',
            'reduce-reducers',
            'redux',
            'redux-actions',
            'redux-immutable',
            'redux-promise',
            'redux-thunk',
            'reselect',
            './packages/components/semantic',

        ],
    },
    output: {
        publicPath,
        path: path.join(buildDir, publicPath),
        filename: 'scripts/[name].js',
        library: 'vendorJS',
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            site: path.resolve(baseDir, 'site'),
            minisite: path.resolve(baseDir, 'minisite'),
        },
    },
    optimization: {
        // https://github.com/webpack/webpack/issues/7425
        // https://github.com/webpack/webpack/issues/7491
        sideEffects: false,
    },
    externals: (context, request, callback) => {
        // externalize react
        if (request === 'react') {
            return callback(null, 'root React');
        } else if (request === 'react-dom') {
            return callback(null, 'root ReactDOM');
        }

        // externalize lodash
        if (request === 'lodash') {
            return callback(null, 'root _');
        }

        // externalize lodash/fp. Global namespace `lodash_fp`
        // is defined as `var lodash_fp = _.noConflict();`
        if (request.match(/lodash\/fp/)) {
            return callback(null, 'root lodash_fp');
        }

        // externalize lodash modules
        const match = request.match(/(lodash\.|lodash\/|lodash-es\/)(.+)$/);
        if (match) {
            let lodashModule = match[2];
            // Special cases for some packages
            if (lodashModule === 'isplainobject') {
                lodashModule = 'isPlainObject';
            }
            return callback(null, `root _.${lodashModule}`);
        }

        callback();
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            include: /semantic-ui-react/,
            loader: 'babel-loader?cacheDirectory=true',
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: 'css-loader',
            }),
        }, {
            test: /(\.png|\.jpg|\.jpeg|\.gif)$/,
            use: {
                loader: 'file-loader',
                options: {
                    outputPath: 'img/',
                    name: '[name].[ext]',
                },
            },
        }, {
            test: /(\.ttf|\.woff|\.woff2|\.eot|\.svg)$/,
            use: {
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts/',
                    name: '[name].[ext]',
                },
            },
        }],
    },
    plugins: [
        new ExtractTextPlugin('styles/vendor.css'),
        new webpack.DllPlugin({
            path: path.join(buildDir, 'vendor-manifest.json'),
            name: 'vendorJS',
        }),
    ],
    node: {
        fs: 'empty',
    },
};

if (__PRODUCTION__) {
    config.plugins = [
        ...config.plugins,
        new CompressionPlugin(),
    ];
}

module.exports = config;
