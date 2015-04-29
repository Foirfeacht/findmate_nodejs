/**
 * Created by vmaltsev on 4/17/2015.
 */
// and event model
var Meeting = require('../models/meeting');
var User = require('../models/user');


module.exports = function (app) {
	// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function (req, res) {
		res.render('index.ejs');
	});


	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile.ejs', {
			user: req.user,
			title: "Профиль " + req.user.name
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	// MAP ==============================
	app.get('/map', isLoggedIn, function (req, res) {
		res.render('map.ejs', {
			user: req.user,
			title: "События"
		});
	});

	app.get('/mapbox', isLoggedIn, function (req, res) {
		res.render('mapBox.ejs', {
			user: req.user,
			title: "События"
		});
	});

	// MEETINGS ==============================
	app.get('/meetings', isLoggedIn, function (req, res) {
		res.render('meetings.ejs', {
			user: req.user,
			title: "События"
		});
	});

	// SETTINGS ==============================
	app.get('/settings', isLoggedIn, function (req, res) {
		res.render('settings.ejs', {
			user: req.user,
			title: "Настройки"
		});
	});

	// MESSAGES ==============================
	app.get('/messages', isLoggedIn, function (req, res) {
		res.render('mapBox.ejs', {
			user: req.user,
			title: "Уведомления | " + req.user.name
		});
	});


	// ADMIN ==============================

	app.get('/admin', isLoggedIn, function (req, res) {
		res.render('admin.ejs', {
			user: req.user,
			title: "Админка"
		});
	});

	app.get('/main', isLoggedIn, function (req, res) {
		res.render('main.ejs', {
			user: req.user,
			title: "Главная"
		});
	});
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}