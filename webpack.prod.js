const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var webpack = require('webpack');

module.exports = [
    {
        mode: 'production',
        entry: './src/main/index.ts',
        target: 'electron-main',
        module: {
            rules: [{
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.py$/i,
                use: 'raw-loader',
            }]
        },
        output: {
            path: __dirname + '/build',
            filename: 'main.js'
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: false,
                    extractComments: true
                })
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins: [
            new webpack.NormalModuleReplacementPlugin(/\.\/environment\.dev/, './environment.prod'),
            new webpack.EnvironmentPlugin({ 'NODE_ENV': 'production' })
        ]
    },
    {
        mode: 'production',
        entry: './src/renderer/React.tsx',
        target: 'electron-renderer',
        module: {
            rules: [{
                test: /\.ts(x?)$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
                use: 'url-loader'
            }]
        },
        output: {
            path: __dirname + '/build',
            filename: 'render.js'
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: false,
                    extractComments: true
                })
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new CopyWebpackPlugin([
                { from: './src/assets/', to: 'assets' }
            ]),
            new webpack.NormalModuleReplacementPlugin(/\.\/environment\.dev/, './environment.prod'),
            new webpack.EnvironmentPlugin({ 'NODE_ENV': 'production' })
        ]
    }
];
