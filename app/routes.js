// and event model
var Meeting    = require('./models/meeting');

module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user,
			picture: 'https://graph.facebook.com/' + req.user.facebook.id + '/picture?height=350&width=250',
			friends: 'https://graph.facebook.com/' + req.user.facebook.id + '/friends' + '?access_token=' + req.user.facebook.token
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
			user : req.user,
			picture: 'https://graph.facebook.com/' + req.user.facebook.id + '/picture?height=350&width=250',
			friends: 'https://graph.facebook.com/' + req.user.facebook.id + '/friends' + '?access_token=' + req.user.facebook.token
		});
	});

	// MEETINGS ==============================
	app.get('/meetings', isLoggedIn, function(req, res) {
		res.render('meetings.ejs', {
			user : req.user,
			picture: 'https://graph.facebook.com/' + req.user.facebook.id + '/picture?height=350&width=250',
			friends: 'https://graph.facebook.com/' + req.user.facebook.id + '/friends' + '?access_token=' + req.user.facebook.token
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
				successRedirect : '/map',
				failureRedirect : '/'
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

	//routes for meetings 

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
	        startDate: req.body.startDate,
	        startTime: req.body.startTime,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            location: req.body.location,
            visibility : req.body.visibility,
            _owner: req.user._id,
            ownerName: req.user.facebook.name
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

    //update a meeting
    app.put('/api/meetings/:id', isLoggedIn, function (req, res){
	    return Meeting.findById(req.params.id, function (err, meeting) {
	        if(!meeting) {
	            res.statusCode = 404;
	            return res.send({ error: 'Not found' });
	        }

	        meeting.title = req.body.title;
	        meeting.description = req.body.description;
	        meeting.startDate = req.body.startDate;
	        meeting.startTime = req.body.startTime;
	        meeting.updated_at = Date.now;
	        meeting.latitude = req.body.latitude;
	        meeting.longitude = req.body.longitude;
	        meeting.location = req.body.location;
	        meeting.visibility = req.body.visibility;
	        return meeting.save(function (err) {
	            if (!err) {
	                log.info("meeting updated");
	                return res.send({ status: 'OK', meeting:meeting });
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
	});


    //get single meeting
    app.get('/api/meetings/:id', isLoggedIn, function(req, res, next) {
	  Meeting.findById(req.params.id, function(err, show) {
	    if (err) return next(err);
	    res.send(meeting);
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

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}


