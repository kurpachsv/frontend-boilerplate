// Общий конфиг сборки для всех тем. Переопределяется в самих темах
const fs = require('fs');
const path = require('path');
const ncp = require('ncp');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackOnBuildPlugin = require('on-build-webpack');

const __DEVELOPMENT__ = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const __PRODUCTION__ = process.env.NODE_ENV === 'production';
const webpackMode = __PRODUCTION__ ? 'production' : 'development';

const baseDir = path.resolve(__dirname, '..');
const buildDir = path.resolve(baseDir, 'build');
const publicPath = '/assets/themes/';

const devTool = __PRODUCTION__ ? false : 'devtool';

/**
 * @param {string} themeName Theme name.
 * @param {boolean} [removeJsBundle] JS bundle must be removed (only css bundle has the meaning).
 * @param {string} [resourcesDir] Path (absolute). Content will be copied to the buildDir.
 * @param {Array} entry
 * @return {Object}
 */
module.exports = ({themeName, removeJsBundle = false, resourcesDir, entry = []}) => {
    let config = {
        mode: webpackMode,
        devtool: devTool,
        context: baseDir,
        target: 'web',
        profile: !!process.env.PROFILE,
        entry: {
            theme: entry,
        },
        output: {
            publicPath,
            path: path.join(buildDir, publicPath),
            filename: `${themeName}/[name].js`,
            library: 'themeApi',
        },
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            lodash: '_',
            'lodash/fp': 'lodash_fp', // for semantic-ui-react
        },
        resolve: {
            extensions: ['.js', '.json', '.less'],
            alias: {
                packages: path.resolve(baseDir, 'packages'),
            },
        },
        module: {
            rules: [{
                test: /\.jsx?$/,
                loader: 'babel-loader?cacheDirectory=true',
            }, {
                // Theme styles with css-modules
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            module: true,
                            localIdentName: __PRODUCTION__ ? '[hash:base64:5]' : '[name]__[local]--[hash:base64:5]',
                        },
                    }, {
                        loader: 'less-loader',
                        options: {plugins: [new LessPluginAutoPrefix({browsers: ['last 2 versions', '> 1%']})]},
                    }],
                }),
            }, {
                test: /\.css$/,
                include: /semantic/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader',
                }),
            }, {
                test: /(\.png|\.jpg|\.jpeg|\.gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/assets/themes/theme-ab/img/',
                        outputPath: `${themeName}/img/`,
                        name: '[name].[ext]',
                    },
                },
            }, {
                test: /(\.ttf|\.woff|\.woff2|\.eot|\.svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/assets/themes/theme-ab/fonts/',
                        outputPath: `${themeName}/fonts/`,
                        name: '[name].[ext]',
                    },
                },
            }],
        },
        plugins: [
            new ExtractTextPlugin(`${themeName}/[name].css`),
            new webpack.DllReferencePlugin({
                context: '.',
                manifest: 'build/vendor-manifest.json',
            }),
            new webpack.DefinePlugin({
                __DEVELOPMENT__: JSON.stringify(__DEVELOPMENT__),
                __PRODUCTION__: JSON.stringify(__PRODUCTION__),
            }),
            new WebpackOnBuildPlugin(() => {
                const outDir = path.join(buildDir, publicPath, themeName);

                if (removeJsBundle) {
                    const jsBundle = path.join(outDir, 'theme.js');
                    if (fs.existsSync(jsBundle)) {
                        fs.unlinkSync(jsBundle);
                    }
                    if (fs.existsSync(`${jsBundle}.map`)) {
                        fs.unlinkSync(`${jsBundle}.map`);
                    }
                }
                if (resourcesDir) {
                    ncp(resourcesDir, outDir);
                }
            }),
        ],
    };

    if (__PRODUCTION__) {
        // Mangler and compressor for production
        config.plugins = [
            ...config.plugins,
            new CompressionPlugin(),
        ];
    }

    return config;
};
