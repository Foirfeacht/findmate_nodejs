/**
 * Created by vmaltsev on 4/17/2015.
 */
// and event model
var Meeting = require('../models/meeting');
var User = require('../models/user');
var mongoose = require('mongoose');

//logger
var log = require('winston');

module.exports = function (app) {
	// =============================================================================
// ROUTES FOR USERS ==================================================
// =============================================================================

	// get all users
	app.get('/api/users', isLoggedIn, function (req, res) {
		User.find({}).populate('notifications.owner notifications.meeting').exec(function (err, users) {
			if (err)
				res.send(err)
			res.json(users);
		});
	});

	var userByID = function (req, res, next, id) {
		User.findById(id, function (err, profile) {
			if (err) return next(err);
			if (!profile) return next(new Error('Failed to load user ' + id));
			req.profile = profile;
			next();
		});
	};

	app.param('userId', userByID);

	app.get('/users/:userId', isLoggedIn, function (req, res) {
		res.render('userprofile.ejs', {
			profile: req.profile,
			user: req.user,
			title: "Профиль" + req.user.profile
		});
	});

	app.get('/current_user', isLoggedIn, function (req, res) {
		User.findById(req.user.id).populate('notifications.owner notifications.meeting').exec(function (err, user) {
			if(err){
				res.send(err);
			};
			res.json(user);
		});
		//var user = req.user;
	});

	// delete a user
	app.delete('/delete/:user_id', isLoggedIn, function (req, res) {
		User.remove({
			_id: req.params.user_id
		}, function (err, user) {
			if (err)
				res.send(err);
			Meeting.find({'_owner._id': req.params.user_id}).remove(function (err, meetings) {
				if (err)
					res.send(err);
				res.redirect('/logout');
			});


		});
	});
	//update user image
	app.put('/update_userimage/users/:id', isLoggedIn, function (req, res) {
		console.log(req.body.image);

		var update = {image: req.body.image};

		User.findByIdAndUpdate(req.params.id, update, function (err, user) {
			if (err)
				res.send(err)

			console.log("image updated");
			res.json(user);
		});
	});

	//send a ntoification to user
	app.put('/pushNotification/users/:id', isLoggedIn, function (req, res) {

		var meeting = req.body;
		console.log(meeting._id);

		var update = {
			$addToSet: {
				notifications: {
					_id: mongoose.Types.ObjectId(),
					owner: req.user._id,
					created_at: new Date(),
					status: 'Unread',
					ifNew: true,
					meeting: meeting._id,
					type: 'Notification'
				}
			}
		};

		User.findByIdAndUpdate(req.params.id, update, {safe: true, upsert: true}, function (err, user) {
			if (!user) {
				res.statusCode = 404;
				return res.send({error: 'Not found'});
			}
			log.info("invite sent");
			User.find({}).populate('notifications.owner notifications.meeting').exec(function (err, users) {
				if (err) {
					res.send(err);
				};
				app.io.broadcast('push notification added', {msg: users});
				res.send('notification sent');
			});
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}