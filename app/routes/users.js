/**
 * Created by vmaltsev on 4/17/2015.
 */
// and event model
var Meeting = require('../models/meeting');
var User = require('../models/user');
var mongoose = require('mongoose');
var async = require('async');

//logger
var log = require('winston');

module.exports = function (app) {
	// =============================================================================
// ROUTES FOR USERS ==================================================
// =============================================================================

	// get all users
	app.get('/api/users', isLoggedIn, function (req, res) {
		User.find({})
			.populate('notifications.owner')
			.populate({path: 'notifications.meeting', model: 'Meeting' })
			.exec(function (err, users) {
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
		User.findById(req.user.id)
			.populate('notifications.owner')
			.populate({path: 'notifications.meeting', model: 'Meeting' })
			.exec(function (err, user) {
				if(err){
					res.send(err);
				};
				res.json(user);
			});
	});

	// delete a user
	app.delete('/users/delete/:id', isLoggedIn, function (req, res) {
		//Meeting.find({'owner': req.params.user_id}).remove(function (err, meetings) {
		//	if (err){
        //        res.send(err);
        //    };
        //    log.info(meetings);

			User.remove({
				_id: req.params.user_id
			}, function (err, user) {
				if (err){
                    res.send(err);
                };
                log.info('User deleted');
				//res.send('removed');
                User.find({})
                    .populate('notifications.owner')
                    .populate({path: 'notifications.meeting', model: 'Meeting' })
                    .exec(function (err, users) {
                        if (err)
                            res.send(err)
                        res.json(users);
                    });
			});

		//});

	});

	//update user image
	app.put('/update_userimage/users/:id', isLoggedIn, function (req, res) {
		var update = {settings: req.body.image};

		User.findByIdAndUpdate(req.params.id, update, function (err, user) {
			if (err)
				res.send(err)

			console.log("image updated");
			User.findById(req.user.id)
			.populate('notifications.owner')
			.populate({path: 'notifications.meeting', model: 'Meeting' })
			.exec(function (err, user) {
				if(err){
					res.send(err);
				};
				res.json(user);
			});
		});
	});

	//update user image
	app.put('/update_settings/users/:id', isLoggedIn, function (req, res) {
		var update = {settings: {distance: req.body.distance}};

		User.findByIdAndUpdate(req.params.id, update, function (err, user) {
			if (err)
				res.send(err)

			console.log("settings updated");
			User.findById(req.user.id)
			.populate('notifications.owner')
			.populate({path: 'notifications.meeting', model: 'Meeting' })
			.exec(function (err, user) {
				if(err){
					res.send(err);
				};
				res.json(user);
			});
		});
	});

	//send a ntoification to user
	// notification about new meeting
	app.put('/pushNotification/users/', isLoggedIn, function (req, res) {

		var meeting = req.body;
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
		var invited = meeting.invitedUsers;
		async.each(invited, function(user, callback){
			log.info(user._id);
			User.findByIdAndUpdate(user._id, update, {safe: true, upsert: true})
				.populate('notifications.owner')
				.populate({path: 'notifications.meeting', model: 'Meeting' })
				.exec(function (err, user) {
					if (!user) {
						res.statusCode = 404;
						return res.send({error: 'Not found'});
					};
					log.info("invite sent");
					app.io.broadcast('push notification added', {msg: user});
					callback();
				});
		}, function(err){
			// All tasks are done now
				if(err){
				res.send(err)
				};
			res.send('notification sent');
		});
	});

	// notification about new meeting
	app.put('/pushUpdateNotification/users/', isLoggedIn, function (req, res) {

		var meeting = req.body;
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
		log.info(meeting._id);
		var invited = meeting.invitedUsers;
		async.each(invited, function(user, callback){
			log.info(user._id);
			User.findByIdAndUpdate(user._id, update, {safe: true, upsert: true})
				.populate('notifications.owner')
				.populate({path: 'notifications.meeting', model: 'Meeting' })
				.exec(function (err, user) {
					if (!user) {
						res.statusCode = 404;
						return res.send({error: 'Not found'});
					};
					log.info("invite sent");
					app.io.broadcast('push notification about update', {msg: user});
					callback();
				});
		}, function(err){
			// All tasks are done now
			if(err){
				res.send(err)
			};
			res.send('notification sent');
		});
	});

	//delete notification
	app.put('/deleteNotification/users/:userId/notifications/:id', isLoggedIn, function (req, res) {
		var update = {$pull: {notifications: {_id: mongoose.Types.ObjectId(req.params.id)}}};
		User.findByIdAndUpdate(req.params.userId, update, {safe: true, upsert: true}, function (err, user) {
			if (!user) {
				res.statusCode = 404;
				return res.send({error: 'Not found'});
			}
			log.info("notification deleted " + req.params.id)
			log.info(req.params.userId);
			User.findById(req.params.userId)
				.populate('notifications.owner')
				.populate({path: 'notifications.meeting', model: 'Meeting' })
				.exec(function (err, user) {
					if (err) {
						res.send(err);
					};
					app.io.broadcast('push notification removed', {msg: user});
					res.send('notification removed');
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