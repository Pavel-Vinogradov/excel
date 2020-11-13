const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const jsloaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env',]
        }
    }]
    // if (isDev) {
    //     loaders.push('eslint-loader')
    // }

    return loaders;
}
module.exports = {
    context: path.resolve(__dirname, 'app'),// исходные файлы
    mode: "development",
    entry: ['@babel/polyfill', './index.js'],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'app'),
            '@core': path.resolve(__dirname, 'app/core')
        }
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: isDev,
        port: 8080,
    },

    devtool: isDev ? 'source-map' : false,
    plugins: [

        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(
            {
                template: "index.html",
                minimizerOptions: {
                    removeComments: isProd,
                    collapseWhitespace: isProd,
                }
            }
        ),
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, 'app/favicon.ico'), to: path.resolve(__dirname, 'dist')}
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [

                    // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: jsloaders(),
            }
        ]
    }
};