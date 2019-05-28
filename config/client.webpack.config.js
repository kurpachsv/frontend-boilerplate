const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const CompressionPlugin = require('compression-webpack-plugin');

const __DEVELOPMENT__ = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const __PRODUCTION__ = process.env.NODE_ENV === 'production';
const __USE_MOCKS__ = process.env.USE_MOCKS === 'true';
const webpackMode = __PRODUCTION__ ? 'production' : 'development';
const baseDir = path.resolve(__dirname, '..');
const buildDir = path.resolve(baseDir, 'build');
const publicPath = '/assets/';
const pollyfill = [
    'isomorphic-unfetch',
    'proxy-polyfill',
];
const devTool = __PRODUCTION__ ? false : 'devtool';
let config = {
    mode: webpackMode,
    devtool: devTool,
    context: baseDir,
    target: 'web',
    profile: !!process.env.PROFILE,
    entry: {
        admin: [
            ...pollyfill,
            path.join(baseDir, '@admin/index.js'),
        ],
        landing: [
            ...pollyfill,
            path.join(baseDir, '@landing/index.js'),
        ],
    },
    output: {
        publicPath,
        path: path.join(buildDir, publicPath),
        filename: 'scripts/[name].js',
        chunkFilename: 'scripts/[name]-[chunkhash].js',
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            include: baseDir,
            loader: 'babel-loader?cacheDirectory=true',
        }, {
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
        }, {
            test: /(\.png|\.jpg|\.jpeg|\.gif|\.svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: 'img/',
                    name: '[name].[ext]',
                },
            }],
        },
            // CSS modules (see below)
        ],
    },
    resolve: {
        extensions: ['.js', '.json', '.less'],
        alias: {
            '@graphql': path.resolve(baseDir, '@graphql'),
            '@landing': path.resolve(baseDir, '@landing'),
            '@admin': path.resolve(baseDir, '@admin'),
            config: path.resolve(baseDir, 'config'),
            packages: path.resolve(baseDir, 'packages'),
        },
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        lodash: '_',
        raven: 'Raven',
        gtag: 'gtag',
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: '.',
            manifest: 'build/vendor-manifest.json',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                BUILD_TARGET: JSON.stringify('client'),
            },
            __DEVELOPMENT__: JSON.stringify(__DEVELOPMENT__),
            __PRODUCTION__: JSON.stringify(__PRODUCTION__),
            __USE_MOCKS__: JSON.stringify(__USE_MOCKS__),
            __NODE__: 'false',
            __BROWSER__: 'true',
            __TESTS__: 'false',
        }),
    ],
};

// CSS modules
const lessLoader = [{
    loader: 'css-loader',
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
                'Safari >= 8'],
        })],
    },
}];

if (__PRODUCTION__) {
    config.module.rules.push({
        test: /\.less$/,
        use: ExtractTextPlugin.extract({allChunks: true, use: lessLoader}),
    }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({allChunks: true, use: 'css-loader'}),
    });
    config.plugins = [
        ...config.plugins,
        new ExtractTextPlugin('styles/[name].css'),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessorOptions: {
                safe: true,
                autoprefixer: {
                    disable: true,
                },
                mergeLonghand: false,
                discardComments: {
                    removeAll: true,
                },
            },
            canPrint: true,
        }),
    ];
} else {
    config.module.rules.push({
        test: /\.less$/,
        use: [
            {loader: 'style-loader'},
            ...lessLoader,
        ],
    }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
    });
}

// HMR
if (__DEVELOPMENT__) {
    config.entry.admin.unshift('react-hot-loader/patch');
    config.entry.landing.unshift('react-hot-loader/patch');
    config.plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.SourceMapDevToolPlugin({
            include: /\.jsx?$/,
        }),
        ...config.plugins,
    ];
    config.devServer = {
        publicPath,
        contentBase: buildDir,
        host: '0.0.0.0',
        port: 3000,
        public: '0.0.0.0/sockjs-client',
        disableHostCheck: true,
        historyApiFallback: true,
        hotOnly: true,
        compress: true,
    };
}

// Mangler
if (__PRODUCTION__) {
    config.plugins = [
        ...config.plugins,
        new CompressionPlugin(),
    ];
}

module.exports = config;
