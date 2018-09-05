var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/index.tsx'
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CopyWebpackPlugin([{
        from: './index.html',
        to: './[name].[ext]'
      }, {
        from: './shaders/**.*',
        to: './shaders/[name].[ext]'
      },
      {
        from: './textures/**.*',
        to: './textures/[name].[ext]'
      },
    ], {
      debug: 'error'
    }),
  ],
  module: {
    rules: [{
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }, {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
};