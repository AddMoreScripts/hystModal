const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');



module.exports = {
    mode: 'production',
    optimization: {
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    },
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: 'hystmodal.min.js',
        // library: 'HystModal',
        // libraryTarget: 'umd',
        // globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                ],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'hystmodal.min.css',
        }),
    ]
};