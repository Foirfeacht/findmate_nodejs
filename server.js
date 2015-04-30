// server.js

// set up ======================================================================
var express = require('express.io');
var cors = require('cors'); //enable cross origin ajax requests
var app = express();
app.http().io();
var WORKERS = process.env.WEB_CONCURRENCY || 1;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var _ = require('lodash');

//dev section

var log = require('winston');

// configuration ===============================================================
var config = require('./config/config');
mongoose.connect(config.db); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

// setting static components
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(cors());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({limit: '5mb'})); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: config.secret
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes/authentication.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes/core.js')(app);
require('./app/routes/meetings.js')(app);
require('./app/routes/users.js')(app);
require('./app/routes/errors.js')(app);

//live reload, dev only
if (process.env.NODE_ENV === 'development') {
	app.use(require('connect-livereload')({
		port: 35729
	}));

	app.use(morgan('dev')); // log every request to the console
}

// launch ======================================================================
app.listen(config.port);
log.info('The magic happens on port ' + config.port);

exports = module.exports = app;
