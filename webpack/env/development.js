'use strict';

module.exports = function(_path) {
  return {
    context: _path,
    debug: true,
    devtool: 'eval',
    module: {
      preLoaders: [
        { test: /\.js$/, loader: 'eslint-loader', exclude: [/node_modules/, /app\/assets\/javascripts\/vendors/, /app\/assets\/javascripts\/lib\/re-counter.js/] },
        { test: /\.styl$/, loader: 'stylint' }
      ]
    },
    stylint: {
      config: '.stylintrc'
    },
    eslint: {
      configFile: '.eslintrc'
    },
    devServer: {
      proxy: {
        '**': 'http://localhost:3000'
      }
    }
  };
};
