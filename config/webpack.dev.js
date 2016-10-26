var server 	= require('./webpack.server');
var merge 	= require('webpack-merge');
var webpack = require('webpack');

var DefinePlugin = webpack.DefinePlugin;

module.exports = merge(server, {
    devtool: 'cheap-source-map',
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
});
