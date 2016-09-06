var webpack = require("webpack");
var path = require("path")
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        'app': [path.resolve(__dirname, "static_dev/js/main_module.jsx")]
    },
    output: {
        path: path.join(__dirname, "static"),
        publicPath: "static/",
        filename: "app.js"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin("[name].css")
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/, // Match both .js and .jsx files
            include: path.join(__dirname, 'static_dev'),
            loaders: ['react-hot', 'babel?presets[]=react'],
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }]
    },
    resolve: {
        alias: {
            "jquery": "../lib/jquery/1.10.0/jquery.min",
            "alertify": "../lib/alertify/alertify.min",
            "alertify_css": "../lib/alertify/css/alertify.min.css",
            "sortable": "../lib/sortable/sortable.min",
        }
    },
    debug: false
};