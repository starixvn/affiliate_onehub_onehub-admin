const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const { environment, projectPath } = require("./config-utils/constant");
const entry = require("./config-utils/entry");
const layoutEntry = require("./config-utils/layoutEntry");

let pathsToClean = ["dist/js/**/*.*", "dist/style/**/*.*"];

let cleanOptions = {
    root: path.resolve(__dirname, "."),
    verbose: true,
    dry: false
};

const relativeOutputPath = projectPath.relativeOutputPath;

module.exports = env => {
    env = environment[env] || environment.development;
    const isDevBuild = env !== environment.production;

    const sharedConfig = () => ({
        mode: env,
        stats: { modules: false },
        performance: {
            hints: isDevBuild ? false : 'warning',
            maxAssetSize: 300000, // 300KB limit for main bundles
            maxEntrypointSize: 300000
        },
        resolve: { 
            extensions: [".js", ".jsx"],
            alias: {
                '@': path.resolve(__dirname, 'source/js'),
                "crypto": "crypto-browserify"
            }
        },
        output: {
            path: projectPath.rootPath,
            filename: "[name].js",
            chunkFilename: relativeOutputPath + '/js/dynamic-chunks/[name].chunk.js'
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: 10,
                maxAsyncRequests: 10,
                minSize: 20000,
                cacheGroups: {
                    // Separate React/Redux into their own chunks
                    react: {
                        test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
                        name: 'vendors/react-core',
                        priority: 30,
                        reuseExistingChunk: true
                    },
                    redux: {
                        test: /[\\/]node_modules[\\/](redux|react-redux|redux-thunk)[\\/]/,
                        name: 'vendors/redux',
                        priority: 25,
                        reuseExistingChunk: true
                    },
                    // Large libraries
                    toastify: {
                        test: /[\\/]node_modules[\\/]react-toastify[\\/]/,
                        name: 'vendors/toastify',
                        priority: 20,
                        reuseExistingChunk: true
                    },
                    // Common vendor chunks
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors/common',
                        priority: 10,
                        reuseExistingChunk: true
                    },
                    // Common code shared between pages
                    common: {
                        minChunks: 2,
                        priority: 5,
                        name: 'common',
                        reuseExistingChunk: true
                    }
                }
            },
            runtimeChunk: false, // Keep runtime inline for simpler deployment
            minimize: !isDevBuild
        },
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 6144,
                        name: "[name].[ext]",
                        outputPath: relativeOutputPath + "/style/assets/",
                        publicPath: "assets/"
                    }
                }]
            }
            ]
        },
        node: {
            fs: 'empty',
            crypto: true,
            stream: true,
            buffer: true
        },
        externals: [
            { './jszip': 'jszip' },
            { './ods': 'ods' },
            { './cptable': 'var cptable' },
            {
                'react': 'React',
                'react-dom': 'ReactDOM'
            }
        ]
    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = projectPath.clientOutputPath;
    const clientBundleConfig = merge(sharedConfig(), {
        entry: entry,
        module: {
            rules: [{
                test: /\.s?[ac]ss$/,
                use: [{
                    loader: 'style-loader',
                },
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: 'css-loader',
                }, {
                    loader: 'resolve-url-loader',
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        sourceMapContents: false,
                        implementation: require('sass') // Use Dart Sass explicitly
                    }
                }
                ]
            }]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css"
            })
        ].concat(isDevBuild ? [] : [new OptimizeCSSAssetsPlugin(), new CleanWebpackPlugin(pathsToClean, cleanOptions),]),
        devtool: isDevBuild ? "source-map" : undefined
    });

    const layoutBundleConfig = merge(sharedConfig(), {
        entry: layoutEntry,
        devtool: isDevBuild ? "source-map" : undefined
    });

    return [clientBundleConfig, layoutBundleConfig];
};