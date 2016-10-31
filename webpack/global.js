'use strict';

// Depends
var path         = require('path');
var webpack      = require('webpack');
var Manifest     = require('manifest-revision-webpack-plugin');
var TextPlugin   = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var SvgStore     = require('webpack-svgstore-plugin');
var jsonPresent  = require('./helpers/json-presenter');

/**
 * Global webpack config
 * @param  {[type]} _path [description]
 * @return {[type]}       [description]
 */
module.exports = function(_path) {
  // define local variables
  var dependencies  = Object.keys(require(_path + '/package').dependencies);
  var rootAssetPath = './app/assets';
  var manifestPath = path.join(_path + '/config', 'manifest.json');

  // return object
  return {

    // entry points
    entry: {
      orphus: _path + '/app/assets/javascripts/vendors/orphus.js',
      // polyfill: 'babel/polyfill',
      application: _path + '/app/assets/javascripts/application.js',
      vendors: dependencies
    },

    // output system
    output: {
      path: path.join(_path, 'public', 'assets'),
      filename: '[chunkhash].[name].js',
      chunkFilename: '[chunkhash].[id].js',
      publicPath: '/assets/'
    },

    // resolves modules
    resolve: {
      extensions: ['', '.js'],
      modulesDirectories: ['node_modules'],
      alias: {
        _javascript: path.join(_path, 'app', 'assets', 'javascripts'),
        _stylesheets: path.join(_path, 'app', 'assets', 'stylesheets'),
        _templates: path.join(_path, 'app', 'assets', 'templates'),
        _images: path.join(_path, 'app', 'assets', 'images'),
        _svg: path.join(_path, 'app', 'assets', 'svg')
      }
    },
    module: {
      loaders: [
        { test: /\.js?$/,
          exclude: /(node_modules|autoprefixer|vendors)/,
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        },
        { test: /\.jade$/, loader: 'jade' },
        { test: /\.(ttf|eot|woff|woff2|svg)/i,
          include: [path.resolve(_path, 'app/assets/webfonts')],
          exclude: [
            path.resolve(_path, 'app/assets/svg'),
            path.resolve(_path, 'app/assets/images')
          ],
          loaders: ['file']
        },
        { test: /\.(png|ico|jpg|jpeg|gif|svg)$/i,
          include: [
            path.resolve(_path, 'app/assets/svg'),
            path.resolve(_path, 'app/assets/images')
          ],
          exclude: [path.resolve(_path, 'app/assets/webfonts')],
          loaders: ['file?context=' + rootAssetPath + '&name=[path][hash].[name].[ext]']
        },
        { test: /\.styl$/i,
          loader: TextPlugin.extract('style', 'css-loader?minimize!postcss!stylus?resolve url')
        }
      ]
    },

    stylus: {
      define: {
        $grid_columns: 24,
        $grid_gutter_width: 12,
        $screen_xs: 320,
        $screen_sm: 640,
        $screen_md: 960,
        $screen_lg: 1280
      }
    },

    // post css
    postcss: [autoprefixer({ browsers: ['last 5 versions'] })],

    // load plugins
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('vendors', '[chunkhash].vendors.js'),
      new TextPlugin('[chunkhash].[name].css'),
      new Manifest(manifestPath, {
        rootAssetPath: rootAssetPath,
        ignorePaths: ['/stylesheets', '/javascript', '/logos', '/svg', '/.DS_Store'],
        format: jsonPresent
      }),
      new SvgStore(),
      new webpack.ProvidePlugin({
        _: 'lodash',
        gator: 'gator'
      })
    ]
  };
};
