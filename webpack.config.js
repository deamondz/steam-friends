//const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = {
    src: path.resolve(__dirname, './src'),
    dist: path.resolve(__dirname, './public'),
}

module.exports = {
    entry: `${paths.src}/index.js`,
    devServer: {
        contentBase: paths.dist,
        compress: true,
        progress: true,
        https: true,
        host: '0.0.0.0',
        port: '8080',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: paths.src,
                loader: 'babel-loader',
            },
        ],
    },
    output: {
        path: paths.dist,
        filename: '[name].[hash].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: `${paths.src}/index.html`,
        }),
    ],
}
