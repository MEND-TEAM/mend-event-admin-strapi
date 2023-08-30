const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',
    entry:  {        
        index : [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=/__webpack_hmr_admin&timeout=20000&overlay=false',
            './src/index.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, './public/bundle'),
        filename: "js/[name].js",
        publicPath: '/bundle/',
        hotUpdateChunkFilename: "hot/[id].[hash].hot-update.js",
        hotUpdateMainFilename: "hot/[hash].hot-update.json",
        chunkFilename: "js/[name].js"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional            
            filename: "css/[name].css",
            publicPath: '/bundle/'
          }),          
        // new HtmlWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [path.resolve(__dirname, './src')],
                loaders: ['babel-loader']
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                  ],
            },
            {
                test: /\.less$/,
                //use: [MiniCssExtractPlugin.loader, "style-loader", "css-loader", "less-loader"]
                use: [MiniCssExtractPlugin.loader, "css-loader", { loader: "less-loader", options: { javascriptEnabled: true } }]
              },
        ]
    },
    resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom'
        }
      }
};
