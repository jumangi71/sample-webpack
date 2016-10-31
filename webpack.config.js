'use strict';

/**
 * [config description]
 * @type {Object}
 */
var _configs = {
  global: require(__dirname + '/webpack/global'),

  production: require(__dirname + '/webpack/env/production'),
  development: require(__dirname + '/webpack/env/development')
};

/**
 * Load webpack config via enviroments
 * @param  {[type]} enviroment [description]
 * @return {[type]}            [description]
 */
var _load = function(enviroment) {
  if (!enviroment) throw new Error('Can\'t find local enviroment variable via process.env.NODE_ENV');
  if (!_configs[enviroment]) throw new Error('Can\'t find enviroments see _congigs object');

  return _configs && Object.assign(
    _configs[enviroment](__dirname),
    _configs.global(__dirname)
  );
};

/**
 * Export WebPack config
 * @type {[type]}
 */
module.exports = _load(process.env.NODE_ENV);
