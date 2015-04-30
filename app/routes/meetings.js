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
// ROUTES FOR MEETINGS ==================================================
// =============================================================================


// get all meetings
	app.get('/api/meetings', isLoggedIn, function (req, res) {
		Meeting.find({}).populate('owner comments.owner').exec(function (err, meetings) {
			if (err){
				res.send(err)
			};
			res.json(meetings);
		});
	});

	app.post('/api/meetings', isLoggedIn, function (req, res) {

		Meeting.create({
			title: req.body.title,
			description: req.body.description,
			category: req.body.category,
			startDate: req.body.startDate,
			startTime: req.body.startTime,
			created_at: new Date(),
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			position: req.body.position,
			location: req.body.location,
			visibility: req.body.visibility || 'Все',
			owner: req.user._id,
			invitedUsers: req.body.invitedUsers
		}, function (err, meeting) {
			if (err) {
				res.send(err);
			};

			app.io.broadcast('meeting added', {msg: meeting});
			
			// get and return all the meetins after you create another
			Meeting.find({}).populate('owner comments.owner').exec(function (err, meetings) {
				if (err) {
					res.send(err);
				};
				//res.json(meetings);
				app.io.broadcast('meetings changed', {msg: meetings});
			});
		});

	});

	//meeting by id middleware

	var meetingByID = function (req, res, next, id) {
		Meeting.findById(id).populate('owner comments.owner').exec(function (err, meeting) {
			if (err) return next(err);
			if (!meeting) return next(new Error('Failed to load meeting ' + id));
			req.meeting = meeting;
			next();
		});
	};

	app.param('meetingId', meetingByID);


	// decline invitation


	app.put('/decline/meetings/:id', isLoggedIn, function (req, res) {

		var update = {$pull: {invitedUsers: {_id: req.user._id}}};

		Meeting.findByIdAndUpdate(req.params.id, update, function (err, meeting) {
			if (err) {
				res.send(err);
			};

			log.info("meeting joined");
			Meeting.find({}).populate('owner comments.owner').exec(function (err, meetings) {
				if (err) {
					res.send(err);
				};
				app.io.broadcast('meetings changed', {msg: meetings});
			});
		});
	});


	// store user in meetings.joined
	app.put('/join/meetings/:id', isLoggedIn, function (req, res) {
		var update = {$addToSet: {joinedUsers: req.user}, $pull: {invitedUsers: {_id: req.user._id}}};

		Meeting.findByIdAndUpdate(req.params.id, update, function (err, meeting) {
			if (err) {
				res.send(err);
			};
			log.info("meeting joined");
			Meeting.find({}).populate('owner comments.owner').exec(function (err, meetings) {
				if (err) {
					res.send(err);
				};
				app.io.broadcast('meetings changed', {msg: meetings});
			});

		});
	});

	// and delete user from meetings.joined
	app.put('/unjoin/meetings/:id', isLoggedIn, function (req, res) {

		var update = {$pull: {joinedUsers: {_id: req.user._id}}};

		Meeting.findByIdAndUpdate(req.params.id, update, function (err, meeting) {
			if (err){
				res.send(err)
			};

			log.info("meeting updated");
			Meeting.find({}).populate('owner comments.owner').exec(function (err, meetings) {
				if (err) {
					res.send(err);
				};
				app.io.broadcast('meetings changed', {msg: meetings});
			});
		});
	});

	//update a meeting
	app.put('/api/meetings/:id', isLoggedIn, function (req, res) {
		var meeting = req.meeting;
		var id = req.params.id;
		var update = {
			$set: {
				title: req.body.title,
				description: req.body.description,
				category: req.body.category,
				startDate: req.body.startDate,
				updated_at: Date.now(),
				visibility: req.body.visibility
			},
			$addToSet: {
				invitedUsers: req.body.invitedUsers
			}
		};

		Meeting.findByIdAndUpdate(id, update, function (err, meeting) {
			if (!meeting) {
				res.statusCode = 404;
				return res.send({error: 'Not found'});
			}
			if (err) {
				res.send(err);
			};
			log.info("meeting updated");
			Meeting.find({}).populate('owner comments.owner').exec(function (err, meetings) {
				if (err) {
					res.send(err);
				};
				app.io.broadcast('meetings changed', {msg: meetings});
			});
		});
	});


	// get single meeting

	app.get('/api/meetings/:meetingId', isLoggedIn, function (req, res) {
		res.json(req.meeting);
	});

	//route to single meeting

	app.get('/meetings/:meetingId', isLoggedIn, function (req, res) {
		res.render('meeting.ejs', {
			meeting: req.meeting,
			user: req.user,
			title: req.meeting.title
		});
		//app.io.broadcast('meeting rendered', {msg: meetings});
	});

	// delete a meeting
	app.delete('/api/meetings/:meeting_id', isLoggedIn, function (req, res) {
		Meeting.remove({
			_id: req.params.meeting_id
		}, function (err, meeting) {
			if (err){
				res.send(err);
			};

			// get and return all the meetings after you create another
			Meeting.find({}).populate('owner comments.owner').exec(function (err, meetings) {
				if (err){
					res.send(err)
				};
				app.io.broadcast('meetings changed', {msg: meetings});
			});
		});
	});

	// delete a meeting from single meeting page
	app.delete('/remove/meetings/:meeting_id', isLoggedIn, function (req, res) {
		Meeting.remove({
			_id: req.params.meeting_id
		}, function (err, meeting) {
			if (err)
				res.send(err);
		}).then(function (err) {
			if (err)
				res.send(err);
			res.redirect('/meetings');
		})
	});

	// =============================================================================
	// ROUTES FOR COMMENTS==================================================
	// =============================================================================

	// add message to meetings
	app.put('/addComment/meetings/:id', isLoggedIn, function (req, res) {

		var update = {
			$push: {
				comments: {
					_id: mongoose.Types.ObjectId(),
					content: req.body.content,
					created_at: new Date(),
					owner: req.user._id
				}
			}
		};

		Meeting.findByIdAndUpdate(req.params.id, update, {safe: true, upsert: true}, function (err, meeting) {
			if (!meeting) {
				res.statusCode = 404;
				return res.send({error: 'Not found'});
			}
			//log.info("comment updated");
			Meeting.find({}).populate('owner comments.owner').exec(function (err, meetings) {
				if (err) {
					res.send(err);
				};
				app.io.broadcast('comment added', {msg: meetings});
				res.send('comment added');
			});
		});
	});

	// delete a comment
	app.put('/delete/meetings/:id/comments/:commentId', isLoggedIn, function (req, res) {
		var update = {$pull: {comments: {_id: mongoose.Types.ObjectId(req.params.commentId)}}};
		Meeting.findByIdAndUpdate(req.params.id, update, {safe: true, upsert: true}, function (err, meeting) {
			if (!meeting) {
				res.statusCode = 404;
				return res.send({error: 'Not found'});
			}
			log.info("comment deleted " + req.params.commentId);
			Meeting.find({}).populate('owner comments.owner').exec(function (err, meetings) {
				if (err) {
					res.send(err);
				};
				app.io.broadcast('comment added', {msg: meetings});
				res.send('comment added');
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
