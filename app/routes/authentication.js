// and event model
var Meeting = require('./../models/meeting');
var User = require('./../models/user');

module.exports = function (app, passport) {
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// facebook -------------------------------

	// send to facebook to do the authentication
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email, public_profile, user_photos, user_friends']}));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			scope: ['email, public_profile, user_photos, user_friends'],
			successRedirect: '/map',
			failureRedirect: '/'
		}));

	// facebook -------------------------------

	// send to facebook to do the authentication
	app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email, user_photos, user_friends'}));

	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect: '/profile',
			failureRedirect: '/profile'
		}));

	// vk -------------------------------

	// send to vk to do the authentication
	app.get('/auth/vk', passport.authenticate('vkontakte', {scope: ['friends, photos, email, photo_200']}));

	// handle the callback after vk has authenticated the user
	app.get('/auth/vk/callback',
		passport.authenticate('vkontakte', {
			scope: ['friends, photos, email, photo_200'],
			successRedirect: '/map',
			failureRedirect: '/'
		}));

	// vk connect-------------------------------

	// send to vk to do the authentication
	app.get('/connect/vk', passport.authorize('vkontakte', {scope: ['friends, photos, email']}));

	// handle the vk after facebook has authorized the user
	app.get('/connect/vk/callback',
		passport.authorize('vkontakte', {
			successRedirect: '/profile',
			failureRedirect: '/profile'
		}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function (req, res) {
		var user = req.user;
		user.local.email = undefined;
		user.local.password = undefined;
		user.save(function (err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', isLoggedIn, function (req, res) {
		var user = req.user;
		user.facebook.token = undefined;
		user.save(function (err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/vk', isLoggedIn, function (req, res) {
		var user = req.user;
		user.vk.token = undefined;
		user.save(function (err) {
			res.redirect('/profile');
		});
	});


	/*app.get('/views/partials/:name', isLoggedIn, function (req, res) {
	 var name = req.params.name;
	 res.render('views/partials/' + name, {
	 user : req.user
	 });
	 });

	 app.get('*', isLoggedIn, function(req, res){
	 user = req.user
	 res.render('main.ejs')
	 });*/
};

/*
 */


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}


