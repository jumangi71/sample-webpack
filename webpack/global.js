'use strict';

var path         = require('path');
var webpack      = require('webpack');
var TextPlugin   = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var HtmlPlugin   = require('html-webpack-plugin');

var Manifest     = require('manifest-revision-webpack-plugin');
var jsonPresent  = require('./helpers/json-presenter');
var SvgStore     = require('webpack-svgstore-plugin');

/**
 * Global webpack config
 * @param  {[type]} _path [description]
 * @return {[type]}       [description]
 */
module.exports = function(_path) {
  var dependencies  = Object.keys(require(_path + '/package').dependencies);
  var rootAssetPath = './app/assets';
  var manifestPath = path.join(_path + '/webpack', 'manifest.json');

  return {
    entry: {
      application: _path + '/app/assets/javascripts/application.js',
      vendors: dependencies
    },

    output: {
      path: path.join(_path, 'public', 'assets'),
      filename: '[chunkhash].[name].js',
      chunkFilename: '[chunkhash].[id].js',
      publicPath: '/'
    },

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
        //{ test: /\.(ttf|eot|woff|woff2|svg)/i,
        //  include: [path.resolve(_path, 'app/assets/webfonts')],
        //  exclude: [
        //    path.resolve(_path, 'app/assets/svg'),
        //    path.resolve(_path, 'app/assets/images')
        //  ],
        //  loaders: ['file']
        //},
        //{ test: /\.(png|ico|jpg|jpeg|gif|svg)$/i,
        //  include: [
        //    path.resolve(_path, 'app/assets/svg'),
        //    path.resolve(_path, 'app/assets/images')
        //  ],
        //  exclude: [path.resolve(_path, 'app/assets/webfonts')],
        //  loaders: ['file?context=' + rootAssetPath + '&name=[path][hash].[name].[ext]']
        //},
        { test: /\.styl$/i,
          loader: TextPlugin.extract('style', 'css-loader?minimize!postcss!stylus?resolve url')
        }
      ]
    },

    postcss: [autoprefixer({ browsers: ['last 5 versions'] })],

    plugins: [
      new webpack.optimize.CommonsChunkPlugin('vendors', '[hash].vendors.js'),
      new TextPlugin('[chunkhash].[name].css'),
      //new Manifest(manifestPath, {
      //  rootAssetPath: rootAssetPath,
      //  ignorePaths: ['/stylesheets', '/javascript', '/svg', '/.DS_Store'],
      //  format: jsonPresent
      //}),
      //new SvgStore(),
      //new webpack.ProvidePlugin({
      //  _: 'lodash',
      //  gator: 'gator'
      //}),
      new HtmlPlugin({
        title: 'Webpack Sample',
        chunks: ['application', 'vendors'],
        filename: '../index.html',
        template: path.join(_path, 'app', 'assets', 'templates', 'layouts', 'index.jade')
      })
    ]
  };
};
