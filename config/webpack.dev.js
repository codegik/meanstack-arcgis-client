var server 	= require('./webpack.server');
var merge 	= require('webpack-merge');
var webpack = require('webpack');

var DefinePlugin = webpack.DefinePlugin;

module.exports = merge(server, {
    devtool: 'cheap-source-map',
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.TARGET_SERVER_PROTOCOL': JSON.stringify('http'),
            'process.env.TARGET_SERVER_HOST': JSON.stringify('localhost'),
            'process.env.TARGET_SERVER_PORT': JSON.stringify('3000'),
            'process.env.TARGET_SERVER_NAMESPACE': JSON.stringify('/map')
        })
    ]
});
