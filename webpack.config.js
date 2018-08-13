var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpack = require('webpack');
 
module.exports = {
  entry: {
    app : './index.js'
  },
  devtool: 'inline-source-map',
  output: { 
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js' 
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './shaders/**.*', to : './shaders/[name].[ext]' },
      { from: './textures/**.*', to : './textures/[name].[ext]' },
    ], {
      debug : 'error'
    }),
  ]
};