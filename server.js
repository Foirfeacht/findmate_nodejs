// server.js

//node time performance tracker
    require('nodetime').profile({
        accountKey: '451ff297568021cee4044ee387d6c39113df901f',
        appName: 'Cityvibe' // optional
    });


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
var chalk = require('chalk');
var blocked = require('blocked');
var log = require('winston');

// configuration ===============================================================
var config = require('./config/config');
mongoose.connect(config.db); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

// setting static components
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

//session options
var sessionOpts = {
    saveUninitialized: true, // saved new sessions
    resave: false, // do not automatically write to the session store
    secret: config.secret,
    cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
}

app.use(cors());
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser.raw({limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'})); // get information from html forms
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session(sessionOpts)); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes/authentication.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes/core.js')(app);
require('./app/routes/meetings.js')(app);
require('./app/routes/users.js')(app);
require('./app/routes/errors.js')(app);

blocked(function(ms){
    log.info('BLOCKED FOR %sms', ms | 0);
});

// A simple pid lookup
var exec = require('child_process').exec;
exec('node ./server.js', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});


var getHrDiffTime = function(time) {
    // ts = [seconds, nanoseconds]
    var ts = process.hrtime(time);
    // convert seconds to miliseconds and nanoseconds to miliseconds as well
    return (ts[0] * 1000) + (ts[1] / 1000000);
};

var outputDelay = function(interval, maxDelay) {
    maxDelay = maxDelay || 100;

    var before = process.hrtime();

    setTimeout(function() {
        var delay = getHrDiffTime(before) - interval;

        if (delay < maxDelay) {
            console.log('delay is %s', chalk.green(delay));
        } else {
            console.log('delay is %s', chalk.red(delay));
        }

        outputDelay(interval, maxDelay);
    }, interval);
};

outputDelay(300);

// heavy stuff happening every 2 seconds here
setInterval(function compute() {
    var sum = 0;

    for (var i = 0; i <= 999999999; i++) {
        sum += i * 2 - (i + 1);
    }
}, 2000);

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
