'use strict';

var _ = require('lodash')

module.exports = function () {
	require('./authentication.js')(app, passport); // load our routes and pass in our app and fully configured passport
	require('./core.js')(app);
	require('./meetings.js')(app);
	require('./users.js')(app);
	require('./errors.js')(app);
};