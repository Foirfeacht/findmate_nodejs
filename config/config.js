'use strict';

var _ = require('lodash')

/**
 * Load app configurations
 */
module.exports = _.extend(
	require('./env/' + (process.env.NODE_ENV || 'development'))
);