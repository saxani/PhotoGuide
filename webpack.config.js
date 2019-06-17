var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './src/index',
    'whatwg-fetch'
  ],
  module: {
    rules: [
      { test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.svg$/, loader: 'svg-react-loader' },
      { test: /\.s?css$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.(jpe?g|png|gif)$/i, loaders: ['url-loader?limit=8192'] },
      { test: /\.(ttf|otf)$/, loader: 'file-loader?name=fonts/[name].[ext]' }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
