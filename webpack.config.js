var path = require('path');
var webpack = require('webpack');


module.exports = {
  entry: './frontend/app.jsx',
  output: { path: __dirname, filename: 'public/javascripts/bundle.min.js' },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015','stage-2'],

        }
      }
    ]
  }
};
