// and event model
var Meeting    = require('./models/meeting');
var User 	   = require('./models/user');

module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	
	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// MAP ==============================
	app.get('/map', isLoggedIn, function(req, res) {
		res.render('map.ejs', {
			user : req.user
		});
	});

	app.get('/mapbox', isLoggedIn, function(req, res) {
		res.render('mapBox.ejs', {
			user : req.user
		});
	});

	// MEETINGS ==============================
	app.get('/meetings', isLoggedIn, function(req, res) {
		res.render('meetings.ejs', {
			user : req.user
		});
	});

	// ADMIN ==============================

	app.get('/admin', isLoggedIn, function(req, res) {
		res.render('admin.ejs', {
			user : req.user
		});
	});

	app.get('/main', isLoggedIn, function(req, res) {
		res.render('main.ejs', {
			user : req.user
		});
	});



// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================


	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email, public_profile, user_photos, user_friends'] }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', { scope: ['email, public_profile, user_photos, user_friends'],
				successRedirect : '/map',
				failureRedirect : '/'
			}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email, user_photos, user_friends' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/profile'
			}));

		// vk -------------------------------

		// send to vk to do the authentication
		app.get('/auth/vk', passport.authenticate('vkontakte', { scope : ['friends, photos, email, photo_200'] }));

		// handle the callback after vk has authenticated the user
		app.get('/auth/vk/callback',
			passport.authenticate('vkontakte', { scope: ['friends, photos, email, photo_200'],
				successRedirect : '/map',
				failureRedirect : '/'
			}));

	// vk connect-------------------------------

		// send to vk to do the authentication
		app.get('/connect/vk', passport.authorize('vkontakte', { scope: ['friends, photos, email']}));

		// handle the vk after facebook has authorized the user
		app.get('/connect/vk/callback',
			passport.authorize('vkontakte', {
				successRedirect : '/profile',
				failureRedirect : '/profile'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/vk', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.vk.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

// =============================================================================
// ROUTES FOR MEETINGS ==================================================
// =============================================================================


// get all meetings
    app.get('/api/meetings', isLoggedIn, function(req, res) {
    	var user = req.user;
        // use mongoose to get all meetings in the database
        Meeting.find(function(err, meetings) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(meetings); // return all meetings in JSON format
        }).populate('_owner', 'ownerName');
    });

    // create meeting and send back all meetings after creation
    app.post('/api/meetings', isLoggedIn, function(req, res) {
    	var user = req.user;

        // create a meeting, information comes from AJAX request from Angular
        Meeting.create({
            title : req.body.title,
            description: req.body.description,
            category: req.body.category,
	        startDate: req.body.startDate,
	        startTime: req.body.startTime,
	        created_at: new Date(),
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            position: req.body.position,
            location: req.body.location,
            visibility : req.body.visibility || 'Все',
            _owner: req.user._id,
            ownerName: req.user.name,
			ownerFacebook: req.user.facebook.id,
			ownerVkontakte: req.user.vkontakte.id,
			invitedUsers: req.body.invitedUsers
        }, function(err, meeting) {
            if (err)
                res.send(err);

            // get and return all the meetins after you create another
            Meeting.find(function(err, meetings) {
                if (err)
                    res.send(err)
                res.json(meetings);
            });
        });

    });

	//meeting by id middleware

	var meetingByID = function(req, res, next, id) {
		Meeting.findById(id).populate('_owner', 'ownerName').exec(function(err, meeting) {
			if (err) return next(err);
			if (!meeting) return next(new Error('Failed to load meeting ' + id));
			req.meeting = meeting;
			next();
		});
	};

	app.param('meetingId', meetingByID);


    // decline invitation


	app.put('/decline/meetings/:id', isLoggedIn, function (req, res){

	     var update = { $pull: {invitedUsers: req.user} };

		Meeting.findByIdAndUpdate(req.params.id, update, function (err, meeting) {
			if (!err) {
				console.log("meeting updated");
				Meeting.find(function(err, meetings) {
					if (err)
						res.send(err)
					res.json(meetings);
				});
			} else {
				if(err.name == 'ValidationError') {
					res.statusCode = 400;
					res.send({ error: 'Validation error' });
				} else {
					res.statusCode = 500;
					res.send({ error: 'Server error' });
				}
				console.log('Internal error(%d): %s',res.statusCode,err.message);
			}
		});
	});


	// store user in meetings.joined
	app.put('/join/meetings/:id', isLoggedIn, function (req, res){
		var update = { $addToSet: {joinedUsers: req.user}, $pull: {invitedUsers: req.user} };

		Meeting.findByIdAndUpdate(req.params.id, update, function (err, meeting) {
			if(err)
				res.send (err)

			console.log("meeting joined");
			Meeting.find(function(err, meetings) {
				if (err)
					res.send(err)
				res.json(meetings);
			});
		});
	});



		// and delete user from meetings.joined
	app.put('/unjoin/meetings/:id', isLoggedIn, function (req, res){

		var update = { $pull: {joinedUsers: req.user}};

				Meeting.findByIdAndUpdate(req.params.id, update, function (err, meeting) {
					if(!meeting) {
						res.statusCode = 404;
						return res.send({ error: 'Not found' });
					}
					console.log("meeting updated");
					Meeting.find(function(err, meetings) {
						if (err)
							res.send(err)
						res.json(meetings);
					});
				});

	});



    //update a meeting
    app.put('/api/meetings/:id', isLoggedIn, function (req, res){
    	var user = req.user;
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

			Meeting.findByIdAndUpdate(req.params.id, update, function (err, meeting) {
		        if(!meeting) {
		            res.statusCode = 404;
		            return res.send({ error: 'Not found' });
		        }
				if(err){
					res.send(err)
				}
		        console.log("meeting updated");
	            Meeting.find(function(err, meetings) {
	                if (err)
	                    res.send(err)
	                res.json(meetings);
	            });
	        });
	});

	
    // get single meeting

	app.get('/api/meetings/:meetingId', isLoggedIn, function(req, res){
		res.json(req.meeting);
	});

	//route to single meeting	

	app.get('/meetings/:meetingId', isLoggedIn, function(req, res){
		res.render('meeting.ejs', {
			    	meeting: req.meeting,
					user : req.user
				});
	});

    // delete a meeting
    app.delete('/api/meetings/:meeting_id', isLoggedIn, function(req, res) {
        Meeting.remove({
            _id : req.params.meeting_id
        }, function(err, meeting) {
            if (err)
                res.send(err);

            // get and return all the meetings after you create another
            Meeting.find(function(err, meetings) {
                if (err)
                    res.send(err)
                res.json(meetings);
            });
        });
    });

    // delete a meeting from single meeting page
    app.delete('/api/meeting/:meeting_id', isLoggedIn, function(req, res) {
        Meeting.remove({
            _id : req.params.meeting_id
        }, function(err, meeting) {
            if (err)
                res.send(err);

            res.redirect('/meetings');
        });
    });

// =============================================================================
// ROUTES FOR USERS ==================================================
// =============================================================================

    // get all users
    app.get('/api/users', isLoggedIn, function(req, res) {
    	var user = req.user;
        // use mongoose to get all meetings in the database
        User.find(function(err, users) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(users); // return all meetings in JSON format
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
					user : req.user
				});
	});

/*
    app.get('*', isLoggedIn, function(req, res){
		res.render('index.ejs')
	});
*/
};

/*app.get('/partials/:name', isLoggedIn, function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
});
*/


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}


