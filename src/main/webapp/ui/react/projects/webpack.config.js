let webpack = require('webpack');
let path = require('path');

//http://stackoverflow.com/questions/30596715/plug-webpack-dev-server-and-hot-load-react-with-tomcat
//https://www.npmjs.com/package/gulp-webpack

module.exports = {
  //debug: true,
  devtool: 'source-map',
  // entry: [
  //   'eventsource-polyfill', // necessary for hot reloading with IE
  //   //'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
  //   './src/index'
  // ],

  // entry: {
  //   cases:'./src/cases/index',
  //   datatables:'./src/datatables/index'
  // },
  context: __dirname + "/src",
  entry: {
    // cases:'./src/cases/index',
    // datatables:'./src/datatables/index'
    app:'./index.js'
  },
  target: 'web',
  output: {
    // Note: Physical files are only output by the production build task `npm run build`.
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './src'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      // {test: /\.jsx?$/, include: path.join(__dirname, 'cases-src'), loader: 'babel-loader',
      //   query: { presets:[ 'es2015', 'react', 'stage-2' ]}
      // },
      // {test: /\.jsx?$/, include: path.join(__dirname, 'datatables-src'),
      //   loader: 'babel-loader', query: { presets:[ 'es2015', 'react', 'stage-2' ]}
      // },
      {test: /\.jsx?$/,  include: path.join(__dirname, 'src'), loader: 'babel-loader',
    	  options: { presets:[ 'es2015', 'react', 'stage-2' ]}
      },
      {test: /(\.css)$/, loaders: ['style-loader', 'css-loader']}
      /*{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      {test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=5000"},
      {test: /\.svg/, loader: 'svg-url-loader'},
      {test: /\.(png|jpg)$/, loader: 'url-loader' } // direct URLs for the rest*/
    ]
  }
};
