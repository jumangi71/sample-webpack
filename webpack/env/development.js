'use strict';

module.exports = function(_path) {
  return {
    context: _path,
    debug: true,
    devtool: 'eval',
    module: {
      preLoaders: [
        { test: /\.js$/, loader: 'eslint-loader', exclude: [/node_modules/] },
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
      contentBase: './public/assets',
      hot: true
    }
  };
};
