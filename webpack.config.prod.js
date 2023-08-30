const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    mode: 'production',    
    entry:  {
        index : [
            './src/index.js'
        ]
    },
    output: {
      path: path.resolve(__dirname, './public/bundle'),
      filename: "js/[name].js",
      publicPath: '/bundle/'      
  },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.less$/,
          //use: [MiniCssExtractPlugin.loader, "style-loader", "css-loader", "less-loader"]
          use: [MiniCssExtractPlugin.loader, "css-loader", { loader: "less-loader", options: { javascriptEnabled: true } }]
        },
        {
          test: /\.(jpg|png|svg)$/,
          //`publicPath`  only use to assign assets path in build
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                publicPath: '/'
              }
            }
          ]
        },
        {
            test: /\.html$/,
            use: [
              {
                loader: "html-loader"
              }
            ]
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
        },
        {
            test: /\.ico$/,
            // include: SRC,
            use: [{
                loader: 'file-loader?name=[name].[ext]'
            }],
        },  
        {
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
          loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
        },
      ]
    },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
            },
            __VERSION__: (new Date()).getTime()
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional            
            filename: "css/[name].css",
            publicPath: '/bundle/'
          }),        
    ],
  };
