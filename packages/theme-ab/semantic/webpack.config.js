// Semantic-UI css build
const fs = require('fs');
const path = require('path');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const WebpackOnBuildPlugin = require('on-build-webpack');

const baseDir = path.resolve(__dirname);
const outDir = path.resolve(baseDir, 'dist');

module.exports = {
    context: baseDir,
    target: 'web',
    entry: {
        semantic: path.join(baseDir, 'semantic.less'),
    },
    output: {
        path: outDir,
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.less'],
    },
    module: {
        rules: [{
            test: /\.less/,
            use: [{
                loader: 'file-loader',
                options: {name: '[name].css'},
            }, {
                loader: 'extract-loader',
            }, {
                loader: 'css-loader',
                options: {minimize: true},
            }, {
                loader: 'less-loader',
                options: {
                    plugins: [new LessPluginAutoPrefix({browsers: ['last 2 versions', '> 1%']})],
                },
            }],
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
        new WebpackOnBuildPlugin((stats) => {
            const jsBundle = path.join(stats.compilation.outputOptions.path, 'semantic.js');
            if (fs.existsSync(jsBundle)) {
                fs.unlinkSync(jsBundle);
            }
        }),
    ],
};
