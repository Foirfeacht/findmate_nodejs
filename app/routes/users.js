/**
 * Created by vmaltsev on 4/17/2015.
 */
// and event model
var Meeting    = require('../models/meeting');
var User 	   = require('../models/user');

module.exports = function(app) {
	// =============================================================================
// ROUTES FOR USERS ==================================================
// =============================================================================

	// get all users
	app.get('/api/users', isLoggedIn, function(req, res) {
		var user = req.user;
		User.find(function(err, users) {

			if (err)
				res.send(err)

			res.json(users); 
		}).populate('meetings._id', 'meetings.title');
	});

	var userByID = function(req, res, next, id) {
		User.findById(id, function(err, profile) {
			if (err) return next(err);
			if (!profile) return next(new Error('Failed to load user ' + id));
			req.profile = profile;
			next();
		});
	};

	app.param('userId', userByID);

	app.get('/users/:userId', isLoggedIn, function(req, res){
		res.render('userprofile.ejs', {
			profile: req.profile,
			user : req.user,
			title: "Профиль" + req.user.profile
		});
	});

	app.get('/current_user', isLoggedIn, function(req, res){
		var user = req.user;
		res.json(user);
	});

	// delete a user
	app.delete('/delete/:user_id', isLoggedIn, function(req, res) {
		User.remove({
			_id : req.params.user_id
		}, function(err, user) {
			if (err)
				res.send(err);
			Meeting.find({ '_owner._id': req.params.user_id }).remove(function (err, meetings) {
				if (err)
					res.send(err);
				res.redirect('/');
			});

			
		});
	});

	//update user image
	app.put('/update_userimage/users/:id', isLoggedIn, function (req, res){
		console.log(req.body.image)
	
		var update = { image: req.body.image };

		User.findByIdAndUpdate(req.params.id, update, function (err, user) {
			if(err)
				res.send (err)

			console.log("image updated");
			res.json(user);
		});
	});
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}