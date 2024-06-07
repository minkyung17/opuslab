require('babel-register');
require('core-js');
var webpackConfig = require('./webpack.config.dev.js');
//webpackConfig.entry = {};

//https://kentor.me/posts/testing-react-and-flux-applications-with-karma-and-webpack/
// karma.conf.js
module.exports = function (config) {
  config.set({
    //basePath: './src/',
    frameworks: ['jasmine', 'es6-shim'],
    colors: true,
    autoWatch: true,
    //logLevel:config.LOG_DEBUG,
    browserNoActivityTimeout: 600000,
    //browserDisconnectTolerance: 4,
    files: [
      '../../plugins/jquery-1.11.1.min.js',
      '../../plugins/jquery-ui-1.11.2/jquery-ui.min.js',
      '../../plugins/bootstrap.min.js',
      //'../../stylesheets/styles.css',
      'node_modules/babel-polyfill/dist/polyfill.js',
      './src/tests*/**/*.test.js*'
    ],
    exclude: [],
    preprocessors: {
    	'./src/tests/opus-logic/datatables/classes/AdminComp.test.js': ['webpack',
            'sourcemap', 'coverage']
//      './src/tests/opus-logic/cases/**/*.test.js': ['webpack',
//        'sourcemap', 'coverage']
//      './src/tests*/**/*.test.js*': ['webpack', 'sourcemap', 'coverage'],
//      './src/tests/opus-logic/**/*.test.js*': ['webpack', 'sourcemap', 'coverage']
    },
    proxies: {
      '/tomcat': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    },
    browsers: [
      'Chrome'
      //, 'PhantomJS'

    ],
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {//These are the default values
      type: 'html',
      dir: 'coverage/'
    }
  });

  return config;
};
