const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: './client/src/index.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            template: './client/public/index.html',
            favicon: './client/public/favicon.ico'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env",
                            "@babel/preset-react"],
                    },
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    // 'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                exclude: /node_modules/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 8192,
                        name: "static/media/[name].[hash:8].[ext]"
                    }
                }
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2|ico)$/,
                exclude: /node_modules/,
                loader: require.resolve("file-loader"),
                options: {
                    name: "static/media/[name].[hash:8].[ext]"
                }
            }
        ]
    },
    // devServer: {
    //     historyApiFallback: true,
    // }
}