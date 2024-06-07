let webpack = require('webpack');
let path = require('path');

let {npm_config_source: SOURCE_DIR = 'src'} = process.env;
//http://stackoverflow.com/questions/30596715/plug-webpack-dev-server-and-hot-load-react-with-tomcat
//https://www.npmjs.com/package/gulp-webpack

module.exports = {
  //debug: true,
  devtool: 'cheap-module-eval-source-map',
  context: __dirname + '/' + SOURCE_DIR,
  entry: {
    app: './index.js'
  },
  target: 'web',
  output: {
    // Note: Physical files are only output by the production build task `npm run build`.
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: [`./${SOURCE_DIR}`]
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
      {test: /\.jsx?$/, include: path.join(__dirname, 'src'), loader: 'babel-loader',
        options: { presets:[ 'es2015', 'react', 'stage-2' ]}
      },

      //{test: /(\.css)$/, loaders: ['style-loader', 'css-loader']},
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: false,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
              , getLocalIdent: (context, localIdentName, localName, options) => {
                return 'whatever_random_class_name';
              }
            }


          }
        ]
      }
//      ,{
//	      test: /\.js$/,
//	      exclude: /\/node_modules\//,
//	      loader: 'babel',
//	      query: {
//	        presets: ['airbnb']
//	      }
//        }
      /*{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      {test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=5000"},
      {test: /\.svg/, loader: 'svg-url-loader'},
      {test: /\.(png|jpg)$/, loader: 'url-loader' } // direct URLs for the rest*/
    ]
  },
  externals: {
    'jsdom': 'window',
    'cheerio': 'window',
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react'
  }
};

export default module;
