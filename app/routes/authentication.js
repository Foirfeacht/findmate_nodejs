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
	app.get('/auth/vk', passport.authenticate('vkontakte', {scope: ['friends, photos, email, photo_big']}));

	// handle the callback after vk has authenticated the user
	app.get('/auth/vk/callback',
		passport.authenticate('vkontakte', {
			scope: ['friends, photos, email, photo_big'],
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


