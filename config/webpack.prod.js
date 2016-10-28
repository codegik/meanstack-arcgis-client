var server 	= require('./webpack.server');
var merge 	= require('webpack-merge');
var webpack = require('webpack');

var DefinePlugin = webpack.DefinePlugin;

module.exports = merge(server, {
    devtool: 'source-map',
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.TARGET_SERVER_PROTOCOL': JSON.stringify('https'),
            'process.env.TARGET_SERVER_HOST': JSON.stringify('arcane-mountain-81855.herokuapp.com'),
            'process.env.TARGET_SERVER_PORT': JSON.stringify(''),
            'process.env.TARGET_SERVER_NAMESPACE': JSON.stringify('/map')
        })
    ]
});
